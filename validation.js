//--------------Cours----------------//
//Validation du nom du cours
const validationNom = (nom) => {
    return typeof nom === 'string' && !!nom;
}

//Validation de la description du cours
const validationDescription = (description) => {
    return typeof description === 'string' && !!description;
}

//Validation de la capacite maximal du cours
const validationCapacite = (capacite) => {
        return typeof capacite === 'number' && capacite > 0 && capacite <= 100;
}

//Validation de la date de debut des cours
const validationDate = (date) => {
    return typeof date === 'number' && !!date;
}

//Validation du nombre de session pour le cours 
const validationNbCours = (nbCours) => {
        return typeof nbCours === 'number' && nbCours > 0 && nbCours <= 100;
}

//--------------Utilisateur----------------//
//Validation du nom de l'utilisateur 
const validationNomUtilisateur = (nom_utilisateur) => {
    return typeof nom_utilisateur === 'string' && !!nom_utilisateur;
}

//Validation du prenom de l'utilisateur
const validationPrenomUtilisateur = (prenom_utilisateur) => {
    return typeof prenom_utilisateur === 'string' && !!prenom_utilisateur;
}

//Validation du courriel de l'utilisateur
export const validationCourrielUtilisateur = (courriel_utilisateur) => {
    return typeof courriel_utilisateur === 'string' &&
    !!courriel_utilisateur &&
    courriel_utilisateur.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

//Validation du mot de passe de l'utilisateur
export const validationMotDePasseUtilisateur = (motDePasse_utilisateur) => {
    return typeof motDePasse_utilisateur === 'string' && !!motDePasse_utilisateur;
}

//Validation de la confirmation du mot de passe de l'utilisateur
const validationConfirmerMotDePasseUtilisateur = (confirmerMotDePasse_utilisateur) => {
    return typeof confirmerMotDePasse_utilisateur === 'string' && !!confirmerMotDePasse_utilisateur;
}

//Validation de l'id de l'utilisateur
export const validationId= (id) => {
    return typeof id === 'number' && !!id;
}

//--------------Validation complet----------------//
//Validation d'ajout de cours
export const validationAddCours = (body) => {
        return validationNom(body.nom) && 
        validationDescription(body.description) && 
        validationCapacite(body.capacite) && 
        validationDate(body.date_debut) && 
        validationNbCours(body.nb_cours);
}

//Validation d'ajout d'utilisateur
export const validationInscription = (body) => {
    return validationNomUtilisateur(body.nom)&&
    validationPrenomUtilisateur(body.prenom)&&
    validationCourrielUtilisateur(body.courriel)&&
    validationMotDePasseUtilisateur(body.mot_passe)
}