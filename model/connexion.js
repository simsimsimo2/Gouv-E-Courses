import { existsSync } from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

/**
 * Constante indiquant si la base de données existe au démarrage du serveur
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE);

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
  let connexion = await connectionPromise;

  await connexion.exec(
    `CREATE TABLE IF NOT EXISTS type_utilisateur(
            id_type_utilisateur INTEGER PRIMARY KEY,
            type TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS utilisateur(
            id_utilisateur INTEGER PRIMARY KEY,
            id_type_utilisateur INTEGER NOT NULL,
            courriel TEXT NOT NULL UNIQUE,
            mot_passe TEXT NOT NULL,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS cours(
            id_cours INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            description TEXT NOT NULL,
            capacite INTEGER NOT NULL,
            date_debut INTEGER NOT NULL,
            nb_cours INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS cours_utilisateur(
            id_cours INTEGER,
            id_utilisateur INTEGER,
            PRIMARY KEY (id_cours, id_utilisateur),
            CONSTRAINT fk_cours_utilisateur 
                FOREIGN KEY (id_cours)
                REFERENCES cours(id_cours) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            CONSTRAINT fk_utilisateur_cours 
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );

        
        INSERT INTO type_utilisateur (type) VALUES 
            ('regulier'),
            ('administrateur');

        INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom) VALUES 
            (2, 'admin@admin.com', 'admin', 'Admin', 'Admin'),
            (1, 'john_doe@gmail.com', 'passw0rd', 'John', 'Doe'),
            (1, 'sera@gmail.com', 'passw0rd', 'Seraphina', 'Lopez'),
            (1, 'arlo_shield@gmail.com', 'passw0rd', 'Arlo', 'Shield'),
            (1, 'blyke_ray@gmail.com', 'passw0rd', 'Blyke', 'Leclerc'),
            (1, 'remi_fast@gmail.com', 'passw0rd', 'Remi', 'Smith'),
            (1, 'isen_radar@gmail.com', 'passw0rd', 'Isen', 'Turner'),
            (1, 'elaine_doc@gmail.com', 'passw0rd', 'Elaine', 'Nelson'),
            (1, 'zeke_the_form@gmail.com', 'passw0rd', 'Zeke', 'Anderson');
            
        INSERT INTO cours (nom, date_debut, nb_cours, capacite, description) VALUES 
            ('Français langue seconde 1', 1662508800000, 30, 12, 'Cours de français de langue seconde pour les personnes de niveau débutant qui souhaitent apprendre le français.'),
            ('Français langue seconde 2', 1662681600000, 30, 24, 'Cours de français de langue seconde pour les personnes de niveau intermédiaire qui souhaitent avoir une mention de bilinguisme.'),
            ('Les préjugés inconscients', 1661522400000, 20, 20, 'Sensibiliser les employé(e)s sur les préjugés qui existent de façon inconsciente et leur influence dans le mileu du travail.'),
            ('Découvrir la cybersécurité', 1662418800000, 15, 10, 'Être informé et alerte pour pouvoir se protéger des cybermenaces'),
            ('L''inclusion sur le lieu de travail', 1662465600000, 15, 25, 'Sensibiliser et informer les employé(e)s sur l''inclusion au travail.'),
            ('Comment construire de meilleures présentations', 1662588000000, 5, 15, 'Améliorer l''efficacité des présentations pour mieux passer son message.'),
            ('Balancer sa vie privée et professionnelle', 1667257200000, 1, 200, 'Techniques et outils pour atteindre un équilibre entre le travail et la maison.');
        
        INSERT INTO cours_utilisateur (id_cours, id_utilisateur) VALUES 
            (1, 5),
            (1, 6),
            (1, 7),
            (2, 2),
            (2, 3),
            (3, 9),
            (6, 4),
            (6, 5),
            (6, 6),
            (6, 7),
            (6, 8),
            (7, 2),
            (7, 3),
            (7, 4),
            (7, 5),
            (7, 6),
            (7, 7),
            (7, 8);`
  );

  return connexion;
};

// Base de données dans un fichier
let promesseConnexion = open({
  filename: process.env.DB_FILE,
  driver: sqlite3.Database,
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
  promesseConnexion = createDatabase(promesseConnexion);
}

export default promesseConnexion;
