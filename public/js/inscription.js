//Recuperation des classes
let form_inscription= document.getElementById("form_inscription");
let nom_utilisateur = document.getElementById('nom_utilisateur');
let prenom_utilisateur = document.getElementById('prenom_utilisateur');
let courriel_utilisateur = document.getElementById('courriel_utilisateur');
let motDePasse_utilisateur = document.getElementById('motDePasse_utilisateur');
let confirmerMotDePasse_utilisateur = document.getElementById('confirmerMotDePasse_utilisateur');
let erreurInscription = document.getElementById('erreur-inscription');

/**
 * Validation du nom de l'utilisateur
 */
let erreurNomUtilisateur = document.getElementById('erreur-nom');
const validationNomUtilisateur = () => {
  if(nom_utilisateur.validity.valid){
    erreurNomUtilisateur.style.display = 'none';
  }
  else if(nom_utilisateur.validity.valueMissing){
    erreurNomUtilisateur.innerText = 'Ce champ est requis';
    erreurNomUtilisateur.style.display = 'block';
  }
}

/**
 * Validation du prenom de l'utilisateur
 */
let erreurPrenomUtilisateur = document.getElementById('erreur-prenom');
const validationPrenomUtilisateur = () => {
  if(prenom_utilisateur.validity.valid){
    erreurPrenomUtilisateur.style.display = 'none';
  }
  else if(prenom_utilisateur.validity.valueMissing){
    erreurPrenomUtilisateur.innerText = 'Ce champ est requis';
    erreurPrenomUtilisateur.style.display = 'block';
  }
}

/**
 * Validation du courriel de l'utilisateur
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
}

/**
 * Validation du mot de passe de l'utilisateur
 */
let erreurMotDePasseUtilisateur = document.getElementById('erreur-motDePasseUtilisateur');
const validationMotDePasseUtilisateur = () => {
  if(motDePasse_utilisateur.validity.valid){
    erreurMotDePasseUtilisateur.style.display = 'none';
  }
  else if(motDePasse_utilisateur.validity.valueMissing){
    erreurMotDePasseUtilisateur.innerText = 'Ce champ est requis';
    erreurMotDePasseUtilisateur.style.display = 'block';
  }
}

/**
 * Validation de la confirmation du mot de passe de l'utilisateur
 */
let erreurConfirmerMotDePasseUtilisateur = document.getElementById('erreur-ConfirmerMotDePasseUtilisateur');
const validationConfirmerMotDePasseUtilisateur = () => {
  if(motDePasse_utilisateur.value != confirmerMotDePasse_utilisateur.value){
    confirmerMotDePasse_utilisateur.setCustomValidity('Password does not match the other one!');
  }
  else {
    confirmerMotDePasse_utilisateur.setCustomValidity('');
  }
  
  if(confirmerMotDePasse_utilisateur.validity.valid){
    erreurConfirmerMotDePasseUtilisateur.style.display = 'none';
  }
  else if(confirmerMotDePasse_utilisateur.validity.customError){
    erreurConfirmerMotDePasseUtilisateur.innerText = 'Password does not match the other one!';
    erreurConfirmerMotDePasseUtilisateur.style.display = 'block';
  }
  else if(confirmerMotDePasse_utilisateur.validity.valueMissing){
    erreurConfirmerMotDePasseUtilisateur.innerText = 'Ce champ est requis';
    erreurConfirmerMotDePasseUtilisateur.style.display = 'block';
  }
}

//Validation du formulaire lorsqu'on appuie sur le bouton de soummission
form_inscription.addEventListener('submit',validationNomUtilisateur);
form_inscription.addEventListener('submit',validationPrenomUtilisateur);
form_inscription.addEventListener('submit',validationCourrielUtilisateur);
form_inscription.addEventListener('submit',validationMotDePasseUtilisateur);
form_inscription.addEventListener('submit',validationConfirmerMotDePasseUtilisateur);


/**
 * Permet d'ajouter un cours avec les veleurs donnees
 */
form_inscription.addEventListener("submit",  async (e) => {
    e.preventDefault();
    if(!form_inscription.checkValidity()){
      return;
    }
    let data = {
        nom: nom_utilisateur.value,
        prenom: prenom_utilisateur.value,
        courriel: courriel_utilisateur.value,
        mot_passe:motDePasse_utilisateur.value 
    };
    let response = await fetch('/inscription', {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if(response.ok){
      window.location.replace('/cours');
      nom_utilisateur.value = "",
      prenom_utilisateur.value = "",
      courriel_utilisateur.value = "",
      motDePasse_utilisateur.value = "",
      confirmPassword_utilisateur.value = ""
      erreurInscription.style.display = 'none';
    }
    else if(response.status == 409){
      erreurInscription.style.display = 'block';
      erreurInscription.innerText = "Un compte existe déjà avec c'est information!";
    }
  });