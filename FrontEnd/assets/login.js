window.addEventListener("load", async () => {
    // SO form code
    let formulaire = document.getElementById("Formulaire");
    formulaire.addEventListener("submit", (e) => {
      e.preventDefault();
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
    
      if (email === "" || password === "") {
        alert("Veuillez remplir le formulaire.");
      } else {
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        })
            .then((response) => {
                if(response.ok && response.status === 200) {
                    alert("Bien joué");
                } else {
                    alert("Une erreur s'est produite lors de la soumission du formulaire.");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Une erreur s'est produite lors de la soumission du formulaire.");
            });
      }
    
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    });  
});
  
  
  