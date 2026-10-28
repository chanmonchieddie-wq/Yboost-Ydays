const matches = [
  {
    id: "arsenal-city",
    competition: "Premier League",
    home: "Arsenal",
    away: "Manchester City",
    homeShort: "ARS",
    awayShort: "MCI",
    homeColor: "#9e2439",
    awayColor: "#65b7d8",
    score: "2 – 1",
    state: "live",
    label: "EN DIRECT · 72′",
    time: "72e minute",
    stats: { possession: [54, 46], tirs: [14, 11], cadres: [6, 4], xg: [1.82, 1.34] }
  },
  {
    id: "psg-lyon",
    competition: "Ligue 1",
    home: "Paris SG",
    away: "Lyon",
    homeShort: "PSG",
    awayShort: "OL",
    homeColor: "#3154a6",
    awayColor: "#b43545",
    score: "1 – 0",
    state: "live",
    label: "EN DIRECT · 58′",
    time: "58e minute",
    stats: { possession: [61, 39], tirs: [12, 7], cadres: [5, 2], xg: [1.55, 0.62] }
  },
  {
    id: "real-barca",
    competition: "La Liga",
    home: "Real Madrid",
    away: "FC Barcelone",
    homeShort: "RMA",
    awayShort: "FCB",
    homeColor: "#e7e5db",
    awayColor: "#a32e4b",
    score: "21:00",
    state: "upcoming",
    label: "À VENIR",
    time: "Aujourd'hui · 21:00",
    stats: { possession: [52, 48], tirs: [13, 12], cadres: [5, 4], xg: [1.68, 1.52] }
  },
  {
    id: "milan-inter",
    competition: "Serie A",
    home: "AC Milan",
    away: "Inter Milan",
    homeShort: "ACM",
    awayShort: "INT",
    homeColor: "#c63743",
    awayColor: "#3477c5",
    score: "20:45",
    state: "upcoming",
    label: "À VENIR",
    time: "Aujourd'hui · 20:45",
    stats: { possession: [49, 51], tirs: [10, 12], cadres: [4, 5], xg: [1.21, 1.48] }
  },
  {
    id: "bayern-dortmund",
    competition: "Bundesliga",
    home: "Bayern Munich",
    away: "Borussia Dortmund",
    homeShort: "FCB",
    awayShort: "BVB",
    homeColor: "#c93248",
    awayColor: "#e4c938",
    score: "Demain · 18:30",
    state: "upcoming",
    label: "À VENIR",
    time: "Demain · 18:30",
    stats: { possession: [57, 43], tirs: [16, 9], cadres: [7, 3], xg: [2.04, 1.08] }
  },
  {
    id: "liverpool-tottenham",
    competition: "Premier League",
    home: "Liverpool",
    away: "Tottenham",
    homeShort: "LIV",
    awayShort: "TOT",
    homeColor: "#c83240",
    awayColor: "#e4eaf0",
    score: "3 – 2",
    state: "finished",
    label: "TERMINÉ",
    time: "Terminé",
    stats: { possession: [58, 42], tirs: [17, 10], cadres: [8, 5], xg: [2.35, 1.42] }
  }
];

const recentResults = [
  { date: "Hier · 20:45", competition: "Premier League", home: "Liverpool", away: "Tottenham", homeShort: "LIV", awayShort: "TOT", homeColor: "#c83240", awayColor: "#e4eaf0", score: "3 – 2", form: ["W", "W", "D", "W", "W"] },
  { date: "Hier · 18:30", competition: "Ligue 1", home: "Marseille", away: "Monaco", homeShort: "OM", awayShort: "ASM", homeColor: "#3b84c5", awayColor: "#d33d4a", score: "1 – 1", form: ["D", "W", "L", "W", "D"] },
  { date: "Dim. · 17:00", competition: "La Liga", home: "Atlético", away: "Séville", homeShort: "ATM", awayShort: "SEV", homeColor: "#c83c48", awayColor: "#e9e5dc", score: "2 – 0", form: ["W", "W", "W", "D", "L"] },
  { date: "Dim. · 15:00", competition: "Serie A", home: "Juventus", away: "Naples", homeShort: "JUV", awayShort: "NAP", homeColor: "#e4e7e8", awayColor: "#397f52", score: "0 – 1", form: ["L", "D", "W", "L", "W"] }
];

const leagueTables = {
  premier: [
    ["Manchester City", "MCI", 28, 20, 5, 3, "+38", 65, "WWWDW", "#65b7d8"],
    ["Arsenal", "ARS", 28, 19, 5, 4, "+35", 62, "WWWWD", "#9e2439"],
    ["Liverpool", "LIV", 28, 19, 4, 5, "+39", 61, "WWDWW", "#c83240"],
    ["Aston Villa", "AVL", 28, 17, 4, 7, "+20", 55, "WLWWW", "#8c73ad"],
    ["Tottenham", "TOT", 27, 15, 5, 7, "+16", 50, "WDWLW", "#e4eaf0"]
  ],
  ligue1: [
    ["Paris SG", "PSG", 26, 17, 8, 1, "+39", 59, "WWWDW", "#3154a6"],
    ["Monaco", "ASM", 26, 15, 7, 4, "+18", 52, "DWWLW", "#d33d4a"],
    ["Brest", "SB", 26, 13, 8, 5, "+16", 47, "WDWWW", "#d7e3ed"],
    ["Lille", "LOSC", 26, 11, 10, 5, "+13", 43, "DWWDD", "#c32936"],
    ["Nice", "OGCN", 26, 12, 7, 7, "+7", 43, "LLDWW", "#202c46"]
  ],
  liga: [
    ["Real Madrid", "RMA", 29, 22, 6, 1, "+42", 72, "WWWDW", "#e7e5db"],
    ["FC Barcelone", "FCB", 29, 20, 7, 2, "+27", 67, "WDWWW", "#a32e4b"],
    ["Girona", "GIR", 29, 19, 5, 5, "+22", 62, "WWLDW", "#d44856"],
    ["Atlético", "ATM", 29, 17, 4, 8, "+23", 55, "WLWWW", "#c83c48"],
    ["Athletic Bilbao", "ATH", 29, 16, 8, 5, "+22", 56, "DWWDW", "#eee8d9"]
  ]
};

const matchGrid = document.getElementById("a-venir");
const emptyMatches = document.getElementById("emptyMatches");
const searchInput = document.getElementById("matchSearch");
let currentFilter = "all";
let currentQuery = "";

function normalizeSearch(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

function teamMarkup(name, short, color) {
  return `<span class="team"><span class="team-crest" style="--crest-bg:${color}">${short}</span><span class="team-name">${name}</span></span>`;
}

function renderMatches() {
  matchGrid.innerHTML = matches.map((match) => {
    const isUpcoming = match.state === "upcoming";
    const scoreClass = isUpcoming ? "score upcoming" : "score";
    const statusClass = match.state === "upcoming" ? "match-status upcoming" : match.state === "finished" ? "match-status finished" : "match-status";

    return `<article class="match-card" data-state="${match.state}" data-search="${normalizeSearch(`${match.home} ${match.away} ${match.homeShort} ${match.awayShort} ${match.competition}`)}">
      <div class="match-card-top"><span class="competition-label">${match.competition}</span><span class="${statusClass}">${match.label}</span></div>
      <div class="teams-row">${teamMarkup(match.home, match.homeShort, match.homeColor)}<span class="${scoreClass}">${match.score}</span>${teamMarkup(match.away, match.awayShort, match.awayColor)}</div>
      <div class="match-card-bottom"><span>${match.time}</span><button class="analyze-button" type="button" data-match-id="${match.id}">Analyser le match ↗</button></div>
    </article>`;
  }).join("");
  applyMatchFilters();
}

function applyMatchFilters() {
  const cards = [...matchGrid.querySelectorAll(".match-card")];
  const historyRows = [...document.querySelectorAll(".history-row")];
  let visibleCount = 0;

  cards.forEach((card) => {
    const stateMatches = currentFilter === "all" || card.dataset.state === currentFilter;
    const queryMatches = card.dataset.search.includes(currentQuery);
    const visible = stateMatches && queryMatches;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  historyRows.forEach((row) => {
    const visible = currentFilter === "all" &&
      (!currentQuery || row.dataset.search.includes(currentQuery));
    row.hidden = !visible;
    if (visible && currentQuery) visibleCount += 1;
  });

  emptyMatches.hidden = visibleCount > 0;
}

function formMarkup(form) {
  return `<span class="form-dots">${[...form].map((result) => {
    const label = result === "W" ? "V" : result === "D" ? "N" : "D";
    const cssClass = result === "W" ? "win" : result === "D" ? "draw" : "loss";
    return `<span class="form-pill ${cssClass}" aria-label="${label}">${label}</span>`;
  }).join("")}</span>`;
}

function renderHistory() {
  document.getElementById("historyList").innerHTML = recentResults.map((result) => `
    <article class="history-row" data-search="${normalizeSearch(`${result.home} ${result.away} ${result.homeShort} ${result.awayShort} ${result.competition}`)}">
      <span class="history-date">${result.date}</span>
      <span class="history-competition">${result.competition}</span>
      <span class="history-teams">${teamMarkup(result.home, result.homeShort, result.homeColor)}<span>·</span>${teamMarkup(result.away, result.awayShort, result.awayColor)}</span>
      <strong class="history-score">${result.score}</strong>
      ${formMarkup(result.form)}
    </article>`).join("");
}

function renderStandings(league) {
  const rows = leagueTables[league];
  document.getElementById("standingsBody").innerHTML = rows.map((team, index) => `
    <tr>
      <td class="rank">${String(index + 1).padStart(2, "0")}</td>
      <td><span class="team-crest" style="--crest-bg:${team[9]}">${team[1]}</span>${team[0]}</td>
      <td>${team[2]}</td><td>${team[3]}</td><td>${team[4]}</td><td>${team[5]}</td><td>${team[6]}</td><td>${team[7]}</td><td>${formMarkup(team[8])}</td>
    </tr>`).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

async function showAnalysis(matchId) {
  const match = matches.find((item) => item.id === matchId);
  if (!match) return;

  const dialog = document.getElementById("analysisDialog");
  const content = document.getElementById("dialogContent");
  const safeHome = escapeHtml(match.home);
  const safeAway = escapeHtml(match.away);
  document.getElementById("dialogTitle").textContent = `${match.home} · ${match.away}`;
  content.textContent = "Calcul de l'analyse…";
  dialog.showModal();

  try {
    const response = await fetch("/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(match)
    });
    const result = await response.json();

    if (!response.ok) {
      content.textContent = result.error || "L'analyse de ce match a échoué.";
      return;
    }

    const metrics = result.metrics;
    const statRows = [
      ["Possession", `${metrics.possession[0]}%`, `${metrics.possession[1]}%`, metrics.possession[0]],
      ["Tirs", `${metrics.tirs[0]}`, `${metrics.tirs[1]}`, metrics.tirs[0] + metrics.tirs[1]
        ? Math.round(metrics.tirs[0] / (metrics.tirs[0] + metrics.tirs[1]) * 100)
        : 50],
      ["Tirs cadrés · précision", `${metrics.cadres[0]} · ${metrics.precisionTirs[0]}%`, `${metrics.cadres[1]} · ${metrics.precisionTirs[1]}%`, metrics.precisionTirs[0]],
      ["Buts attendus (xG)", metrics.xg[0].toFixed(2), metrics.xg[1].toFixed(2), metrics.xg[0] + metrics.xg[1]
        ? Math.round(metrics.xg[0] / (metrics.xg[0] + metrics.xg[1]) * 100)
        : 50],
      ["xG par tir", metrics.xgParTir[0] === null ? "—" : metrics.xgParTir[0].toFixed(3), metrics.xgParTir[1] === null ? "—" : metrics.xgParTir[1].toFixed(3), metrics.xgParTir[0] === null || metrics.xgParTir[1] === null
        || metrics.xgParTir[0] + metrics.xgParTir[1] === 0
        ? 50
        : Math.round(metrics.xgParTir[0] / (metrics.xgParTir[0] + metrics.xgParTir[1]) * 100)]
    ];

    content.innerHTML = `
    <div class="dialog-score">
      <span class="dialog-team"><span class="team-crest" style="--crest-bg:${match.homeColor}">${escapeHtml(match.homeShort)}</span>${safeHome}</span>
      <strong class="dialog-score-value">${match.score}</strong>
      <span class="dialog-team"><span class="team-crest" style="--crest-bg:${match.awayColor}">${escapeHtml(match.awayShort)}</span>${safeAway}</span>
    </div>
    <div class="dialog-stats">${statRows.map(([label, homeValue, awayValue, share]) => `
      <div class="dialog-stat">
        <div class="dialog-stat-label"><strong>${homeValue}</strong><span>${label}</span><strong>${awayValue}</strong></div>
        <div class="dialog-stat-track"><span style="width:${share}%"></span></div>
      </div>`).join("")}</div>
    <div class="dialog-insight"><strong>Lecture des données</strong><br>${escapeHtml(result.insight)}</div>
    <p class="demo-note">${escapeHtml(result.note)}</p>`;
  } catch (error) {
    console.error("Erreur pendant la demande d'analyse :", error);
    content.textContent = "Impossible de joindre le service d'analyse. Vérifiez que le serveur est démarré avec Python disponible.";
  }
}

renderMatches();
renderHistory();
renderStandings("premier");
document.getElementById("currentYear").textContent = new Date().getFullYear();

fetch("/api/auth/me")
  .then(async (response) => {
    if (!response.ok) {
      window.location.replace("/maquette/maquette.html");
      return;
    }
    const result = await response.json();
    document.getElementById("accountName").textContent = result.user.nom;
  })
  .catch((error) => {
    console.error("Impossible de vérifier la session :", error);
    window.location.replace("/maquette/maquette.html");
  });

document.getElementById("logoutButton").addEventListener("click", async (event) => {
  event.currentTarget.disabled = true;
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      throw new Error("Le serveur n'a pas pu fermer la session.");
    }
    window.location.assign("/maquette/maquette.html");
  } catch (error) {
    console.error("Erreur pendant la déconnexion :", error);
    event.currentTarget.disabled = false;
  }
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-button.active")?.classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    applyMatchFilters();
  });
});

document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  currentQuery = normalizeSearch(searchInput.value.trim());
  applyMatchFilters();
  document.getElementById("direct").scrollIntoView({ behavior: "smooth" });
  if (matchGrid.querySelectorAll(".match-card:not([hidden])").length === 0 &&
      document.querySelectorAll(`.history-row:not([hidden])`).length > 0) {
    document.getElementById("historique").scrollIntoView({ behavior: "smooth" });
  }
  document.getElementById("searchHint").textContent = currentQuery
    ? `${matchGrid.querySelectorAll(".match-card:not([hidden])").length + document.querySelectorAll(".history-row:not([hidden])").length} résultat(s) trouvé(s).`
    : "Essayez « Arsenal », « PSG » ou « Ligue 1 »";
});

searchInput.addEventListener("input", () => {
  currentQuery = normalizeSearch(searchInput.value.trim());
  applyMatchFilters();
});

matchGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-match-id]");
  if (button) showAnalysis(button.dataset.matchId);
});

document.getElementById("leagueSelect").addEventListener("change", (event) => {
  renderStandings(event.target.value);
});

const analysisDialog = document.getElementById("analysisDialog");
document.getElementById("closeDialog").addEventListener("click", () => analysisDialog.close());
analysisDialog.addEventListener("click", (event) => {
  if (event.target === analysisDialog) analysisDialog.close();
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
  mainNav.classList.toggle("open", !isExpanded);
});
mainNav.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (link) {
    if (link.dataset.filter) {
      document.querySelector(".filter-button.active")?.classList.remove("active");
      const filterButton = document.querySelector(`.filter-button[data-filter="${link.dataset.filter}"]`);
      filterButton?.classList.add("active");
      currentFilter = link.dataset.filter;
      applyMatchFilters();
    }
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }
});

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();
  const status = document.getElementById("contactStatus");

  if (!email || !message) {
    status.textContent = "Renseignez votre e-mail et votre message.";
    return;
  }

  try {
    const savedMessages = JSON.parse(localStorage.getItem("foot-ai-contact-messages") || "[]");
    savedMessages.push({ email, message, createdAt: new Date().toISOString() });
    localStorage.setItem("foot-ai-contact-messages", JSON.stringify(savedMessages));
    event.currentTarget.reset();
    status.textContent = "Message enregistré sur cet appareil. Aucun e-mail n'a été envoyé.";
  } catch (error) {
    console.error("Impossible d'enregistrer le message de contact :", error);
    status.textContent = "Enregistrement impossible dans ce navigateur. Réessayez.";
  }
});

const observedSections = [...document.querySelectorAll("main section[id], #a-venir")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visibleEntry = entries.filter((entry) => entry.isIntersecting)
    .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
  if (!visibleEntry) return;

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${visibleEntry.target.id}`);
  });
}, { rootMargin: "-20% 0px -65% 0px", threshold: [0, .15, .4] });

observedSections.forEach((section) => sectionObserver.observe(section));