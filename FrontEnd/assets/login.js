  function isAuthenticated() {
    const jwtToken = localStorage.getItem("jwtToken");
    return jwtToken !== null;
  }

window.addEventListener("load", async () => {
  if (isAuthenticated()) {
    window.location.href = "http://127.0.0.1:5501/FrontEnd/index.html";
  }

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
            return response.json();
          } else {
            throw new Error("Authentication failed");
          }
        })
        .then((data) => {
          const jwtToken = data.token;
          localStorage.setItem("jwtToken", jwtToken);
          window.location.href = "http://127.0.0.1:5501/FrontEnd/index.html";
        })
        .catch((error) => {
          console.error(error);
          errorForm.classList.add("visible");
        });
    }

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  });
});
