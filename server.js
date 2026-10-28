require("dotenv").config();

const path = require("node:path");
const { spawn } = require("node:child_process");
const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2/promise");

const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
const configuredSessionSecret = process.env.SESSION_SECRET;

if (isProduction) {
  app.set("trust proxy", 1);
}

if (!configuredSessionSecret || configuredSessionSecret.length < 32) {
  throw new Error("Definissez SESSION_SECRET (au moins 32 caracteres) dans le fichier .env.");
}

const sessionSecret = configuredSessionSecret;

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "Foot_AI",
  waitForConnections: true,
  connectionLimit: 10
});

const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 30 * 24 * 60 * 60 * 1000,
  createDatabaseTable: true
}, pool);

app.use(session({
  name: "fottai.sid",
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json({ limit: "10kb" }));

function requireAuthentication(req, res, next) {
  if (!req.session.user) {
    if (req.path.startsWith("/api/")) {
      return res.status(401).json({ error: "Connectez-vous pour continuer." });
    }
    return res.redirect("/maquette/maquette.html");
  }
  return next();
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => error ? reject(error) : resolve());
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => error ? reject(error) : resolve());
  });
}

function analyzeWithPython(payload) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "page", "Analyse.py");
    const python = spawn(
      process.env.PYTHON_EXECUTABLE || "python",
      [scriptPath],
      { windowsHide: true, stdio: ["pipe", "pipe", "pipe"] }
    );
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let outputTooLarge = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      python.kill();
    }, 10000);

    python.stdout.setEncoding("utf8");
    python.stderr.setEncoding("utf8");
    python.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (stdout.length > 65536) {
        outputTooLarge = true;
        python.kill();
      }
    });
    python.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    python.on("error", (error) => {
      clearTimeout(timeout);
      error.statusCode = 503;
      reject(error);
    });
    python.on("close", (code) => {
      clearTimeout(timeout);

      if (timedOut) {
        const error = new Error("Le service d'analyse a dépassé le délai autorisé.");
        error.statusCode = 504;
        reject(error);
        return;
      }

      if (outputTooLarge) {
        const error = new Error("La réponse du service d'analyse est trop volumineuse.");
        error.statusCode = 502;
        reject(error);
        return;
      }

      if (code !== 0) {
        const error = new Error(stderr.trim() || "Le calcul de l'analyse a échoué.");
        error.statusCode = code === 2 ? 400 : 500;
        reject(error);
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        error.statusCode = 502;
        reject(error);
      }
    });

    python.stdin.on("error", (error) => {
      if (error.code !== "EPIPE") {
        console.error("Erreur d'envoi au service d'analyse Python :", error);
      }
    });
    python.stdin.end(JSON.stringify(payload));
  });
}

app.post("/api/analyse", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Connectez-vous pour analyser les matchs." });
  }

  try {
    const result = await analyzeWithPython(req.body);
    return res.json(result);
  } catch (error) {
    if (error.statusCode >= 500) {
      console.error("Erreur du service d'analyse Python :", error);
    }
    return res.status(error.statusCode || 500).json({
      error: error.statusCode === 400
        ? error.message
        : "Le service d'analyse est momentanément indisponible."
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { nom, email, motDePasse } = req.body || {};

  if (
    typeof nom !== "string" ||
    typeof email !== "string" ||
    typeof motDePasse !== "string"
  ) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  const normalizedName = nom.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || normalizedName.length > 100) {
    return res.status(400).json({ error: "Le nom doit contenir de 1 à 100 caractères." });
  }

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return res.status(400).json({ error: "Veuillez saisir une adresse e-mail valide." });
  }

  if (motDePasse.length < 8 || Buffer.byteLength(motDePasse, "utf8") > 72) {
    return res.status(400).json({
      error: "Le mot de passe doit contenir au moins 8 caractères et ne pas dépasser 72 octets."
    });
  }

  try {
    const passwordHash = await bcrypt.hash(motDePasse, 12);

    const [result] = await pool.execute(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)",
      [normalizedName, normalizedEmail, passwordHash]
    );

    await regenerateSession(req);
    req.session.user = {
      id: result.insertId,
      nom: normalizedName,
      email: normalizedEmail
    };
    await saveSession(req);

    return res.status(201).json({ message: "Compte créé.", redirect: "/page/page.html" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Cette adresse e-mail est déjà utilisée." });
    }

    console.error("Erreur pendant la création du compte :", error);
    return res.status(500).json({ error: "Impossible de créer le compte pour le moment." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, motDePasse, seSouvenir } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof motDePasse !== "string" ||
    email.trim().length > 254 ||
    Buffer.byteLength(motDePasse, "utf8") > 72
  ) {
    return res.status(400).json({ error: "Adresse e-mail ou mot de passe invalide." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await pool.execute(
      "SELECT id, nom, email, mot_de_passe FROM utilisateurs WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );
    const user = rows[0];
    const passwordMatches = user
      ? await bcrypt.compare(motDePasse, user.mot_de_passe)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({ error: "Adresse e-mail ou mot de passe incorrect." });
    }

    await regenerateSession(req);
    req.session.user = { id: user.id, nom: user.nom, email: user.email };
    req.session.cookie.maxAge = seSouvenir === true
      ? 30 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;
    await saveSession(req);

    return res.json({ message: "Connexion réussie.", redirect: "/page/page.html" });
  } catch (error) {
    console.error("Erreur pendant la connexion :", error);
    return res.status(500).json({ error: "Impossible de vous connecter pour le moment." });
  }
});

app.get("/api/auth/me", requireAuthentication, (req, res) => {
  return res.json({ user: req.session.user });
});

app.post("/api/auth/logout", requireAuthentication, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("fottai.sid", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict"
    });
    return res.json({ message: "Déconnexion réussie." });
  });
});

app.use("/maquette", express.static(path.join(__dirname, "maquette")));
app.use("/Inscription", express.static(path.join(__dirname, "Inscription")));
app.use("/page", requireAuthentication, express.static(path.join(__dirname, "page")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res) => {
  res.redirect("/maquette/maquette.html");
});

sessionStore.onReady()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur démarré : http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Impossible d'initialiser le stockage MySQL des sessions :", error);
    pool.end()
      .catch((closeError) => {
        console.error("Impossible de fermer le pool MySQL :", closeError);
      })
      .finally(() => {
        process.exitCode = 1;
      });
  });
