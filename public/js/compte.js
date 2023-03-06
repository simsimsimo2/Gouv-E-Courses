/* On recupere les formulaires */
let formulaire = document.querySelectorAll(".form_cours");

/*-------------PATCH COURS------------- */
//on parcoure les formulaires pour mettre le event sur chaque formulaire specifique et prendre son id;
for (let i = 0; i < formulaire.length; i++) {
  formulaire[i].addEventListener("submit", (e) => {
    e.preventDefault();
    // on cree un object avec
    const obj = { ...e.currentTarget.dataset };
    //data a envoyer pour le patch
    let data = {
      id: obj.id,
    };
    fetch("/cours", {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    //On enleve dessus l'interface le cours inscris.
    formulaire[i].parentNode.removeChild(formulaire[i]);
  });
}
/*--------------FIN PATCH COURS------------------*/
