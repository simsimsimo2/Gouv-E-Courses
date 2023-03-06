import promesseConnexion from "./connexion.js";
import { hash } from "bcrypt";

/**
 * Fonction permettant de cree un utilisateur dans la base de donnees
 * @param {Courriel de l'utilisateur} courrielUtilisateur 
 * @param {Mot de passe de l'utilisateur} motDePasse 
 * @param {Nom de l'utilisateur} nomUtilisateur 
 * @param {Prenom de l'utilisateur} prenomUtilisateur 
 */
export const addUtilisateur = async (courrielUtilisateur,motDePasse,nomUtilisateur,prenomUtilisateur) => {
    let connexion = await promesseConnexion;

    let motDePasseHash = await hash(motDePasse,10)

    await connexion.run(
        `INSERT INTO utilisateur (courriel,mot_passe,nom,prenom,id_type_utilisateur)
        VALUES (?,?,?,?,1)`,
        [courrielUtilisateur,motDePasseHash,nomUtilisateur,prenomUtilisateur]
    );
}

/**
 * Fonction permettant retourner un utilisateur avec son courriel 
 * @param {Courriel de l'utilisateur} courrielUtilisateur 
 * @returns 
 */
export const getUtilisateurByCourriel = async (courrielUtilisateur) => {
    let connexion = await promesseConnexion;

    let utilisateur = await connexion.get(
        `SELECT id_utilisateur,id_type_utilisateur,prenom,nom,mot_passe,courriel
        FROM utilisateur
        WHERE courriel = ?`,
        [courrielUtilisateur]
    );

    return utilisateur;
}