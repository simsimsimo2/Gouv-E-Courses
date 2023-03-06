import promesseConnexion from "./connexion.js";

/**
 * Fonction permettant d'aller chercher toutes les cours dans la base de donnees
 * @returns 
 */
export const getCours = async () => {
  let connexion = await promesseConnexion;
  let resultat = await connexion.all("SELECT * FROM cours");
  return resultat;
};

/**
 * Fonction permettant d'aller chercher tous les utilisateur inscris dans le cours choisie avec id
 * @param {Id attribuer au cours} id_cours 
 * @returns 
 */
export const getUtilisateurDansCours = async (id_cours) => {
  let connexion = await promesseConnexion;
  let resultat = await connexion.all(
  `SELECT id_utilisateur FROM cours_utilisateur 
   WHERE id_cours = ?`
  ,[id_cours]);
  return resultat;
};

export const getNomUtilisateurAdmin = async (id_utilisateur)=> {
  let connexion = await promesseConnexion;
  let resultat = await connexion.get(
  `SELECT nom,prenom,id_utilisateur FROM utilisateur 
   WHERE id_utilisateur = ?`
  ,[id_utilisateur]);
  return resultat;
};

/**
 * Fonction permettant de cree un cours dans la base de donnees
 * @param {Nom du cours} nom 
 * @param {Description du cours} description 
 * @param {Capacite maximal du cours} capacite 
 * @param {Date que le cours commence} date_debut 
 * @param {Nombre de seesion dans le cours} nb_cours 
 * @returns 
 */
export const addCours = async (
  nom,
  description,
  capacite,
  date_debut,
  nb_cours
) => {

  let connexion = await promesseConnexion;
  let resultat = await connexion.run(
    `INSERT INTO cours (nom,description,capacite,date_debut,nb_cours)
        VALUES (?,?,?,?,?)`,
    [nom, description, capacite, date_debut, nb_cours]
  );
  return resultat.lastID;
};

/**
 * Permet d'avoir les cours incrit a l'utilisateur
 * @param {Id de l'utilisateur} id_utilisateur 
 * @returns 
 */
export const getCoursDejaInscrit = async (id_utilisateur) => {
  try {
      let connexion = await promesseConnexion;

      let resultat=  await connexion.all(
          `SELECT 
              c.id_cours, 
              c.nom, 
              c.description, 
              c.date_debut, 
              c.nb_cours, 
              c.capacite, 
              COUNT(cu.id_cours) AS inscriptions, 
              c.id_cours IN (
                  SELECT id_cours 
                  FROM cours_utilisateur 
                  WHERE id_utilisateur = ?
              ) AS estInscrit
          FROM cours c
          LEFT JOIN cours_utilisateur cu ON c.id_cours = cu.id_cours
          GROUP BY c.id_cours`, 
          [id_utilisateur]
      );

      return resultat;
  }
  catch(e) {
      console.log(e)
  }
}

/**
 * Fonction permettant de mettre a jours le cours selectionner
 * @param {Id du cours demander} id 
 */
export const checkCours = async (id) => {
  let connexion = await promesseConnexion;
  await connexion.run(
    `UPDATE cours
        WHERE id_cours = ?`,
    [id]
  );
};

/**
 * Fonction permettant de supprimer un cours dans la base de donnees
 * @param {Id du cours a supprimer} id 
 */
export const deleteCours = async (id) => {
  let connexion = await promesseConnexion;

  await connexion.run(`DELETE FROM cours WHERE id_cours = ?`, [id]);
};

/**
 * Fonction permettant d'inscrire un utilisateur a un cours sur le serveur
 * @param {Id du cours} id 
 * @param {Id de l'utilisateur} id_utilisateur 
 * @returns 
 */
export const coursInscritServer = async (id,id_utilisateur) => {
  let connexion = await promesseConnexion;
  let resultat = await connexion.run(
    `INSERT INTO cours_utilisateur(id_cours, id_utilisateur)
        VALUES (?, ?)`,
    [id, id_utilisateur]
  );
  return resultat.lastID;
};

/**
 * Fonction permettant d'aller chercher tout les cours que l'utilisateur choisis s'est inscrit
 * @param {Id de l'utilisateur} id_utilisateur 
 * @returns 
 */
export const getCoursInscris = async (id_utilisateur) => {
  let connexion = await promesseConnexion;
  let resultat = await connexion.all(
    `
  SELECT utilisateur.id_utilisateur, cours.id_cours, cours.nom, cours.description, cours.capacite, cours.date_debut, cours.nb_cours
  FROM utilisateur
  JOIN cours_utilisateur
  ON utilisateur.id_utilisateur = cours_utilisateur.id_utilisateur 
  JOIN cours
  ON cours.id_cours = cours_utilisateur.id_cours WHERE utilisateur.id_utilisateur = ? `,
    [id_utilisateur]
  );
  return resultat;
};

/**
 * Fonction permettant a l'utilisateur de se desinscrire a un cours
 * @param {Id du cours} id 
 * @param {Id de l'utilisateur} id_utilisateur 
 */
export const desinscrire = async (id,id_utilisateur) => {
  let connexion = await promesseConnexion;
  await connexion.all(
    `DELETE FROM cours_utilisateur WHERE id_cours= ? AND id_utilisateur= ?`,
    [id, id_utilisateur]
  );
};
