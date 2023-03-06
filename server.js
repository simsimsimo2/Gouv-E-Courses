import "dotenv/config";
import helmet from "helmet";
import https from 'https';
import { readFile } from "fs/promises";
import cors from "cors";
import compression from "compression";
import express, { json, request, response } from "express";
import session from 'express-session';
import memorystore from 'memorystore';
import passport from "passport";
import middlewareSse from './middleware-sse.js';
import { addUtilisateur } from "./model/utilisateur.js";
import { engine } from "express-handlebars";
import {
  getCours,
  getUtilisateurDansCours,
  getCoursInscris,
  getCoursDejaInscrit,
  getNomUtilisateurAdmin,
  coursInscritServer,
  deleteCours,
  addCours,
  desinscrire,
} from "./model/cours.js";
import { 
  validationAddCours,
  validationInscription,
  validationCourrielUtilisateur,
  validationMotDePasseUtilisateur 
} from "./validation.js";
import './authentification.js';

//Creation du serveur
let app = express();
// Creation du constructeur de la base de donnees de session
const MemoryStore = memorystore(session);

//Section des "helpers" dans le programme
app.engine(
  "handlebars",
  engine({
    helpers: {
      
      //Permet d'afficher la date de la bonne facon
      afficheDate: (timestamp) => new Date(timestamp).toLocaleDateString(),

    },
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

//Ajout de middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());
app.use(express.static("public"));

//Les routes avec leurs fonctions appropries
//------------GET---------------//
//Route pour la page principale d'inscription au cours
app.get("/", async (request, response) => {
  if(request.user){
    response.redirect('/cours');
  }
  else if(!request.user){
    response.render("connexionUtilisateur", {
      titre: "Connexion",
      style: ["/css/style.css"],
      user: request.user,
      isAdmin: request?.user?.id_type_utilisateur >= 2,
      accept: request.session.accept,
      scripts: ["/js/connexionUtilisateur.js"],
    });
  }
});

//Route pour la page de cours/page principale
app.get("/cours", async (request, response) => {
  if(request.user){
    response.render("cours", {
    titre: "Cours",
    style: ["/css/style.css"],
    user: request.user,
    isAdmin: request?.user?.id_type_utilisateur >= 2,
    accept: request.session.accept,
    scripts: ["/js/cours.js"],
    cours: await getCoursDejaInscrit(request.user.id_utilisateur),
  });
}
else{
  response.redirect('/connexionUtilisateur');
}
});

//Route pour la page du compte de l'utilisateur
app.get("/compte", async (request, response) => {
  if(request.user){
    response.render("compte", {
      titre: "Compte",
      style: ["/css/style.css"],
      user: request.user,
      isAdmin: request?.user?.id_type_utilisateur >= 2,
      accept: request.session.accept,
      scripts: ["/js/compte.js"],
      inscris: await getCoursInscris(request.user.id_utilisateur),
    });
  }
  else {
      response.redirect('/connexionUtilisateur');
  }
});

//Route pour la page de l'admin
app.get("/administrateur", async (request, response) => {
  if(request?.user?.id_type_utilisateur){
    if(request?.user?.id_type_utilisateur >= 2){
      let temp = await getCours();
      for(let i=0; i<temp.length;i++){
        temp[i].listeUtilisateur = []; 
        let temp2 = await getUtilisateurDansCours(temp[i].id_cours);
        for(let x=0; x<temp2.length;x++){
          let user = await getNomUtilisateurAdmin(temp2[x].id_utilisateur);
          temp[i].listeUtilisateur.push(user);
        }
      }
      response.render("administrateur", {
        titre: "Administrateur",
        style: ["/css/style.css"],
        accept: request.session.accept,
        user: request.user,
        isAdmin: request?.user?.id_type_utilisateur >= 2,
        scripts: ["/js/administrateur.js"],
        cours: temp,
      });
    }
    else {
      response.redirect('/connexionUtilisateur');
    }
  }
  else {
    response.redirect('/connexionUtilisateur');
  }
});

//Route pour la page de creation d'un compte
app.get("/inscription", async (request, response) => {
  if(request.user){
    response.redirect('/cours');
  }
  else if(!request.user){
    response.render("inscription", {
      titre: "Inscription",
      style: ["/css/style.css"],
      user: request.user,
      isAdmin: request?.user?.id_type_utilisateur >= 2,
      accept: request.session.accept,
      scripts: ["/js/inscription.js"],
    });
  }
});

//Route pour la page de connexion de l'utilisateur
app.get("/connexionUtilisateur", async (request, response) => {
  if(request.user){
    response.redirect('/cours');
  }
  else if(!request.user){
    response.render("connexionUtilisateur", {
      titre: "Connexion",
      style: ["/css/style.css"],
      user: request.user,
      isAdmin: request?.user?.id_type_utilisateur >= 2,
      accept: request.session.accept,
      scripts: ["/js/connexionUtilisateur.js"],
    });
  }
});

//Route pour le stream du programme
app.get('/stream', (request, response) =>{
  if(request?.user?.id_type_utilisateur){
    if(request?.user?.id_type_utilisateur >= 2){
        response.initStream();
    }
    else {
        response.status(401).end();
    }
  }
  else {
    response.redirect('/connexionUtilisateur');
  }
});

//------------DELETE---------------//
//Requete pour effacer un cours
app.delete("/administrateur", async (request, response) => {
  if(!request.user){
    response.redirect('/connexionUtilisateur');
  }
    if(request?.user?.id_type_utilisateur >= 2){
      await deleteCours(request.body.id);
      response.status(200).end();
      response.pushJson({
        id_cours: request.body.id,
      }, 'delete-cours');
    }
    else {
        response.redirect('/connexionUtilisateur');
    }
});

//------------POST---------------//
//Requete pour cree un cours
app.post("/administrateur", async (request, response) => {
  if(!request.user){
    response.redirect('/connexionUtilisateur');
  }
  if(request?.user?.id_type_utilisateur){
      if (validationAddCours(request.body)){
      let id = await addCours(
        request.body.nom,
        request.body.description,
        request.body.capacite,
        request.body.date_debut,
        request.body.nb_cours
      );
      response.status(201).json({ id: id });
      response.pushJson({
        id_cours: id,
        nom: request.body.nom,
        description: request.body.description,
        capacite: request.body.capacite,
        date_debut: request.body.date_debut,
        nb_cours: request.body.nb_cours
      }, 'add-cours');
      }
      else {
        response.status(400).end();
      }
    }
    else {
        response.redirect('/connexionUtilisateur');
    }
});

//Requete pour accepter les cookies
app.post('/cookies', (request, response) => {
  request.session.accept = true;
  response.status(200).end();
});

//Requete pour inscrire un utilisateur a un cour sur le serveur
app.post("/cours", async (request, response) => {
  if(request.user){
    let id = await coursInscritServer(request.body.id,request.user.id_utilisateur);
    response.status(201).json({ id: id });
    response.pushJson({
      id_cours: request.body.id,
      id_utilisateur: request.user.id_utilisateur,
      nom_utilisateur: request.user.nom,
      prenom_utilisateur: request.user.prenom,
    }, 'update-cours');
  }
  else {
      response.redirect('/connexionUtilisateur');
  }
});

//Requete pour ajouter un utilisateur sur la base de donnee
app.post('/inscription', async (request,response,next) => {
  //valider les donnees recu du client
  if(validationInscription(request.body)) {
    try{
      await addUtilisateur(request.body.courriel, request.body.mot_passe,request.body.nom, request.body.prenom )
      response.status(201).end();
      passport.authenticate('local',(error, utilisateur, info) => {
        if(error){
          next(error);
        }
        else if(!utilisateur){
          response.status(401).json(info);
        }
        else{
          request.logIn(utilisateur, (error) => {
            if(error){
              next(error);
            }
            else{
              response.status(200).end();
            }
          })
        }
      });
    }
    catch(error){
      if(error.code === 'SQLITE_CONSTRAINT'){
        response.status(409).end();
      }
      else{
        next(error);
      }
    }
  }
  else{
    response.status(400).end();
  }
});

//Requete pour connecter l'utiisateur a son comptey
app.post('/connexionUtilisateur', (request,response,next) => {
   //valider les donnees recu du client

  if(validationCourrielUtilisateur(request.body.courriel) && validationMotDePasseUtilisateur(request.body.mot_passe)) {
    passport.authenticate('local',(error, utilisateur, info) => {
      if(error){
        next(error);
      }
      else if(!utilisateur){
        response.status(401).json(info);
      }
      else{
        request.logIn(utilisateur, (error) => {
          if(error){
            next(error);
          }
          else{
            response.status(200).end();
          }
        })
      }
    })(request,response,next)
  }
  else{
    response.status(400).end();
  }
});

//Requete pour deconnecter l'utilisateur
app.post('/deconnexion', (request,response,next) => {
  request.logOut((erreur) => {
    if(erreur) {
      next(erreur);
    }
    else {
      response.redirect('/connexionUtilisateur');
    }
  })
});

//------------PATCH---------------//
//Requete pour que l'utilisateur se desinscrit a un cours
app.patch("/cours", async (request, response) => {
  if(request.user){
    await desinscrire(request.body.id,request.user.id_utilisateur);
    response.status(200).end();
  }
  else {
      response.redirect('/connexionUtilisateur');
  }
});


// Demarrer le serveur
if(process.env.NODE_ENV === 'production') {
  app.listen(process.env.PORT);
  console.log("Serveur demarre: http://localhost:" + process.env.PORT);
}
else {
  const credentials = {
    key: await readFile('./security/localhost.key'),
    cert: await readFile('./security/localhost.cert')
  }
  https.createServer(credentials, app).listen(process.env.PORT);
  console.log("Serveur demarre: https://localhost:" + process.env.PORT);
}
