let form_connexion = document.getElementById("form_connexion");
let courriel_utilisateur = document.getElementById('courriel_utilisateur');
let motDePasse_utilisateur = document.getElementById('motDePasse_utilisateur');
let erreurConnexion = document.getElementById('erreur-connexion');

/**
 * Fonction pour la validation du courriel de l'utilisateur
*/
let erreurCourrielUtilisateur = document.getElementById('erreur-courriel');
const validationCourrielUtilisateur = () => {
  if(courriel_utilisateur.validity.valid){
    erreurCourrielUtilisateur.style.display = 'none';
  }
  else if(courriel_utilisateur.validity.valueMissing){
    erreurCourrielUtilisateur.innerText = 'Ce champ est requis';
    erreurCourrielUtilisateur.style.display = 'block';
  }
  else if(courriel_utilisateur.validity.validationCourrielUtilisateur){
    erreurCourrielUtilisateur.innerText = 'Le courriel est invalide!';
    erreurCourrielUtilisateur.style.display = 'block';
  }
}
/**
 * Fonction pour la validation du mot de passe de l'utilisateur
 */
let erreurMotDePasseUtilisateur = document.getElementById('erreur-motDePasse');
const validationMotDePasseUtilisateur = () => {
  if(motDePasse_utilisateur.validity.valid){
    erreurMotDePasseUtilisateur.style.display = 'none';
  }
  else if(motDePasse_utilisateur.validity.valueMissing){
    erreurMotDePasseUtilisateur.innerText = 'Ce champ est requis';
    erreurMotDePasseUtilisateur.style.display = 'block';
  }
}

//Validation au 'submit' du bouton de connexion
form_connexion.addEventListener('submit',validationCourrielUtilisateur);
form_connexion.addEventListener('submit',validationMotDePasseUtilisateur);

/**
 * Fonction pour la soumission du formulaire de connexion
 */
form_connexion.addEventListener("submit",  async (e) => {
  e.preventDefault();
  
  let data = {
    courriel: courriel_utilisateur.value,
    mot_passe: motDePasse_utilisateur.value 
  };
  let response = await fetch('/connexionUtilisateur', {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if(response.ok){
    window.location.replace('/cours');
    courriel_utilisateur.value = "",
    motDePasse_utilisateur.value = ""
    erreurConnexion.style.display = 'none';
  }
  else if(response.status == 401){
    erreurConnexion.style.display = 'block';
    erreurConnexion.innerText = 'Aucun compte trouver avec les informations donnée!';
  }
  else if(response.status == 400){
    erreurConnexion.style.display = 'block';
    erreurConnexion.innerText = 'Le courriel ou le mot de passe est invalide!';
  }
});
  