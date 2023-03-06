import passport from "passport";
import { Strategy } from "passport-local";
import { compare } from "bcrypt";
import { getUtilisateurByCourriel } from "./model/utilisateur.js";

/**
 * Configuration de la connection de l'utilisateur
 */
let config = {
    usernameField: 'courriel',
    passwordField: 'mot_passe'
}

/**
 * Utilisation du passport connecter les utilisateurs
 */
passport.use(new Strategy(config, async (courrielUtilisateur,motDePasse,done) => {
    try {

        //validation de l'utilisateur dans la base de donnee
        let utilisateur = await getUtilisateurByCourriel(courrielUtilisateur);
        if(!utilisateur){
            return done(null, false, {erreur: 'Aucun compte est associé a cet email'})
        }
        
        //validation du mot de passe dans la base de donnee
        let valide = await compare(motDePasse, utilisateur.mot_passe) // le mot de passe de la base de donnee et non de serveur (mot_de_passe vs motDePasse)!!!
        if(!valide) {
            return done(null, false, {erreur: 'Mot de passe invalide'})
        }
        return done(null, utilisateur);
    }
    catch(error){
        return done(error);
    }
    }));

    /**
     * Connexion de l'utilisateur
     */
    passport.serializeUser((utilisateur,done) => {
        done(null,utilisateur.courriel);
    });

    /**
     * Deconnexion de l'utilisateurS
     */
    passport.deserializeUser(async (courrielUtilisateur,done) => {
        try{
            let utilisateur = await getUtilisateurByCourriel(courrielUtilisateur);
            done(null,utilisateur);
        }
        catch(error) {
            done(error);
        }
    });
    