const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const registerButton = document.getElementById("submitButton");
const passwordInput = document.getElementById("password");
const confirmationInput = document.getElementById("confirmPassword");

function showRegisterMessage(text, type = "error") {
  registerMessage.textContent = text;
  registerMessage.className = `form-message ${type}`;
  registerMessage.hidden = false;
}

document.getElementById("revealPassword").addEventListener("click", (event) => {
  const reveal = passwordInput.type === "password";
  passwordInput.type = reveal ? "text" : "password";
  confirmationInput.type = reveal ? "text" : "password";
  event.currentTarget.textContent = reveal ? "Masquer" : "Afficher";
  event.currentTarget.setAttribute(
    "aria-label",
    reveal ? "Masquer le mot de passe" : "Afficher le mot de passe"
  );
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registerMessage.hidden = true;

  const nom = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const motDePasse = passwordInput.value;

  if (!nom) {
    showRegisterMessage("Veuillez saisir votre nom.");
    document.getElementById("name").focus();
    return;
  }

  if (!document.getElementById("email").validity.valid || !email) {
    showRegisterMessage("Veuillez saisir une adresse e-mail valide.");
    document.getElementById("email").focus();
    return;
  }

  if (motDePasse.length < 8 || new TextEncoder().encode(motDePasse).length > 72) {
    showRegisterMessage("Le mot de passe doit contenir au moins 8 caractères et ne pas dépasser 72 octets.");
    passwordInput.focus();
    return;
  }

  if (motDePasse !== confirmationInput.value) {
    showRegisterMessage("Les deux mots de passe ne correspondent pas.");
    confirmationInput.focus();
    return;
  }

  registerButton.disabled = true;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email, motDePasse })
    });
    const result = await response.json();

    if (!response.ok) {
      showRegisterMessage(result.error || "Impossible de créer votre compte.");
      return;
    }

    showRegisterMessage("Compte créé. Redirection vers votre espace…", "success");
    window.location.assign(result.redirect || "/page/page.html");
  } catch (error) {
    console.error("Erreur pendant l'inscription :", error);
    showRegisterMessage("Le serveur est injoignable. Démarrez-le puis réessayez.");
  } finally {
    registerButton.disabled = false;
  }
});