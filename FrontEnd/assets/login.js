window.addEventListener("load", async () => {
    let formulaire = document.getElementById("Formulaire");
    formulaire.addEventListener("submit", (e) => {
      e.preventDefault();
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      const errorForm = document.getElementById("error_form");
  
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
            password: password,
          }),
        })
          .then((response) => {
            if (response.ok && response.status === 200) {
                window.location.href = "http://127.0.0.1:5500/FrontEnd/index.html";
            } else {
                errorForm.classList.add("visible");
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
  