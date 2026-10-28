
const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = `message show ${type}`;
}

function clearMessage() {
  message.textContent = "";
  message.className = "message";
}

// Afficher ou masquer le mot de passe
document.getElementById("togglePassword").addEventListener("click", () => {
  const visible = password.type === "password";

  password.type = visible ? "text" : "password";

  document.getElementById("togglePassword").textContent =
    visible ? "◎" : "◉";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  if (!email.validity.valid || !email.value.trim()) {
    showMessage(
      "Veuillez saisir une adresse e-mail valide.",
      "error"
    );
    email.focus();
    return;
  }

  if (password.value.length < 8) {
    showMessage(
      "Le mot de passe doit contenir au moins 8 caractères.",
      "error"
    );
    password.focus();
    return;
  }

  submitButton.disabled = true;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        motDePasse: password.value,
        seSouvenir: document.getElementById("remember").checked
      })
    });
    const result = await response.json();

    if (!response.ok) {
      showMessage(result.error || "Adresse e-mail ou mot de passe incorrect.", "error");
      return;
    }

    window.location.assign("/page/page.html");
  } catch (error) {
    console.error("Erreur pendant la connexion :", error);
    showMessage(
      "Le serveur est injoignable. Vérifiez qu'il est bien démarré, puis réessayez.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
  }
});

document.getElementById("forgot").addEventListener("click", () => {
  if (!email.value.trim() || !email.validity.valid) {
    showMessage(
      "Saisissez d'abord une adresse e-mail valide.",
      "error"
    );
    email.focus();
    return;
  }

  showMessage("La réinitialisation du mot de passe n'est pas encore configurée.", "error");
});

fetch("/api/auth/me")
  .then((response) => {
    if (response.ok) window.location.replace("/page/page.html");
  })
  .catch((error) => console.error("Impossible de vérifier la session :", error));
