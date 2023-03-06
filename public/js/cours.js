//Recuperation des classes
let btn_inscrire = document.getElementsByClassName("btn_inscrire");
let basket = [];

//On recupere tous les formulaires
let formu = document.getElementsByClassName("form_cours");

/**
 * L'envoie du cours au serveur apres avoir appuyer sur le bouton: S'inscrire
 */
for (let i = 0; i < formu.length; i++) {
  formu[i].addEventListener("submit", (e) => {
    e.preventDefault();

    //on cree un object avec le current target
    const obj = { ...e.currentTarget.dataset };

    //data a envoyer au server qui est le id de chaque forme de maniere individuelle
    let data = {
      id: obj.id,
    };
    fetch("/cours", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    
      window.location.reload();
  });
}
