/* On recupere les formulaires des cours en generales generes par le database  */
let formulaire = document.querySelectorAll("#form_cours");
//on les parcours
const deleteCoursAdmin = (e) => {
  let form = document.getElementById('form_cours');
  e.preventDefault();
  const obj = { ...e.currentTarget.dataset };
  //data a envoyer
  let data = {
    id: obj.id,
  };
  //methode delete
  fetch("/administrateur", {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
}

for (let i = 0; i < formulaire.length; i++) {
  formulaire[i].addEventListener("submit", deleteCoursAdmin);
}
/* POUR SEND LE FORMU D'INSCRIPTION DES COURS */
let form_inscription = document.getElementById("form_inscription");
let nom = document.getElementById("nom_cours");
let description_cours = document.getElementById("description_cours");
let capacite_cours = document.getElementById("capacite_cours");
let date_debut = document.getElementById("date_debut");
let nb_cours = document.getElementById("nb_cours");

let section = document.querySelector('.cours-content');

/**
 * Affichage en temp reel
 * @param {Id du cours} id_cours 
 * @param {Nom du cours} nom 
 * @param {Description du cours} description 
 * @param {capacite du cours} capacite 
 * @param {Date de debut du cours} date_debut 
 * @param {Nombre de session dans le cours} nb_cours 
 */
const addCoursClient = (id_cours, nom, description, capacite, date_debut, nb_cours) => {
  //Section pour les elements de chaque cours
  let form = document.createElement('form');
  form.dataset.id = id_cours;
  form.id = 'form_cours';

  let div_coursBox = document.createElement('div');
  div_coursBox.classList.add('cours-box');

  let div_coursImg = document.createElement('div');
  div_coursImg.classList.add('cours-img-compte');

  let label_coursTitre = document.createElement('label');
  label_coursTitre.classList.add('cours-titre');

  let label_descript = document.createElement('label');
  label_descript.classList.add('cours-descript');

  let label_capacite = document.createElement('label');
  label_capacite.classList.add('cours-descript');
  label_capacite.innerText = 'Capacite total: ';

  let label_nbCours = document.createElement('label');
  label_nbCours.classList.add('cours-descript');
  label_nbCours.innerText = 'Nombre de cours: ';

  let label_dateDebut = document.createElement('label');
  label_dateDebut.classList.add('cours-descript');
  label_dateDebut.innerText = 'Date de debut: ';

  let label_participant = document.createElement('label');
  label_participant.classList.add('cours-descript');
  label_participant.innerText = 'Participant: ';

  let div_btn = document.createElement('div');
  div_btn.classList.add('btn');

  let submit = document.createElement('button')
  submit.classList.add('btn_delete');


  //Permet de programmer le bouton d'inscription aux cours
  submit.setAttribute("type", "submit");
  submit.innerText = "Supprimer";

  //Attribution des donnees au label
  label_coursTitre.innerText = nom;
  label_descript.innerText = description;
  label_capacite.innerText += capacite;
  label_dateDebut.innerText += new Date(date_debut).toLocaleDateString();
  label_nbCours.innerText += nb_cours;

  //Positionnement des elements dans le formulaire
  div_btn.append(submit);
  form.append(div_coursBox);
  form.addEventListener('submit',deleteCoursAdmin);
  div_coursBox.append(
    div_coursImg,
    label_coursTitre,
    label_descript,
    label_capacite,
    label_nbCours,
    label_dateDebut,
    label_participant,
    div_btn);
    section.append(form);
  }
  
  
  /**
   * Permet d'envoyer le nouveau cours dans le stream 
  */
let source = new EventSource('/stream');
source.addEventListener('add-cours', (event) => {
  let data = JSON.parse(event.data);
  addCoursClient(
    data.id_cours,
    data.nom,
    data.description,
    data.capacite,
    data.date_debut,
    data.nb_cours);
});

source.addEventListener('delete-cours', (event) => {
  let data = JSON.parse(event.data);
  let cours = document.querySelector(`form[data-id = "${data.id_cours}"]`);
  cours.remove();
});

source.addEventListener('update-cours', (event) => {
  let data = JSON.parse(event.data);
  let nom_utilisateur = data.nom_utilisateur;
  let prenom_utilisateur = data.prenom_utilisateur;
  console.log(nom_utilisateur);

});

/**
 * Validation du nom du cours
 */
let erreurNomCours = document.getElementById('erreur-nom-cours');
const validationNomCours = () => {
  if (nom.validity.valid) {
    erreurNomCours.style.display = 'none';
  }
  else if (nom.validity.valueMissing) {
    erreurNomCours.innerText = 'Ce champ est requis';
    erreurNomCours.style.display = 'block';
  }
}

/**
 * Validation du description du cours
 */
let erreurDescription = document.getElementById('erreur-description');
const validationDescription = () => {
  if (description_cours.validity.valid) {
    erreurDescription.style.display = 'none';
  }
  else if (description_cours.validity.valueMissing) {
    erreurDescription.innerText = 'Ce champ est requis';
    erreurDescription.style.display = 'block';
  }
  else if (description_cours.validity.tooLong) {
    erreurDescription.innerText = 'La description doit etre inferieur a 200 charactere';
    erreurDescription.style.display = 'block';
  }
  else if (description_cours.validity.tooShort) {
    erreurDescription.innerText = 'La description doit etre superieur a 1 charactere';
    erreurDescription.style.display = 'block';
  }
}

/**
 * Validation du capacite du cours
 */
let erreurCapacite = document.getElementById('erreur-capacite');
const validationCapacite = () => {
  if (capacite_cours.validity.valid) {
    erreurCapacite.style.display = 'none';
  }
  else if (capacite_cours.validity.rangeOverflow) {
    erreurCapacite.innerText = 'La valeur doit etre inferieur a 100';
    erreurCapacite.style.display = 'block';
  }
  else if (capacite_cours.validity.rangeUnderflow) {
    erreurCapacite.innerText = 'La valeur doit etre superieur a 1';
    erreurCapacite.style.display = 'block';
  }
  else if (capacite_cours.validity.valueMissing) {
    erreurCapacite.innerText = 'Ce champ est requis';
    erreurCapacite.style.display = 'block';
  }
}

/**
 * Validation du date du cours
 */
let erreurDate = document.getElementById('erreur-date');
const validationDate = () => {
  if (date_debut.validity.valid) {
    erreurDate.style.display = 'none';
  }
  else if (date_debut.validity.valueMissing) {
    erreurDate.innerText = 'Ce champ est requis';
    erreurDate.style.display = 'block';
  }
}
/**
 * Validation du nombre de cours
 */
let erreurNbCours = document.getElementById('erreur-nbCours');
const validationNbCours = () => {
  if (nb_cours.validity.valid) {
    erreurNbCours.style.display = 'none';
  }
  else if (nb_cours.validity.valueMissing) {
    erreurNbCours.innerText = 'Ce champ est requis';
    erreurNbCours.style.display = 'block';
  }
}

//Validation du formulaire lorsqu'on appuie sur le bouton de soummission
form_inscription.addEventListener('submit', validationNomCours);
form_inscription.addEventListener('submit', validationDescription);
form_inscription.addEventListener('submit', validationCapacite);
form_inscription.addEventListener('submit', validationDate);
form_inscription.addEventListener('submit', validationNbCours);

/**
 * Permet d'ajouter un cours avec les veleurs donnees
 * @param {erreur} e 
 */
form_inscription.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form_inscription.checkValidity()) {
    return;
  }

  let data = {
    nom: nom.value,
    description: description_cours.value,
    capacite: parseInt(capacite_cours.value),
    date_debut: new Date(date_debut.value).getTime(),
    nb_cours: parseInt(nb_cours.value),
  };
  let response = await fetch('/administrateur', {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    // window.location.reload();
    nom.value = "",
      description_cours.value = "",
      capacite_cours.value = "",
      date_debut.value = "",
      nb_cours.value = ""
  }
});
