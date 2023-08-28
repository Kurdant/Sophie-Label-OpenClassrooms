function isAuthenticated() {
  const jwtToken = localStorage.getItem("jwtToken");
  return jwtToken !== null;
}

window.addEventListener("load", async () => {
  const response = await fetch('http://localhost:5678/api/works');
  let images = await response.json();

  const sectionFiches = document.querySelector(".gallery");
  const filtresElement = document.querySelector("#Filtres");

  const showAllImages = () => {
    sectionFiches.innerHTML = ""; 

    for (let i = 0; i < images.length; i++) {
      const gallery = images[i];
      const container = document.createElement("div");
      const imageElement = document.createElement("img");
      imageElement.src = gallery.imageUrl;
      const titleElement = document.createElement("figcaption");
      titleElement.innerText = gallery.title;

      container.appendChild(imageElement);
      container.appendChild(titleElement);

      sectionFiches.appendChild(container);
    }
  };

  const showImagesByCategory = (categoryId) => {
    sectionFiches.innerHTML = "";

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (image.categoryId === categoryId) {
        const container = document.createElement("div");

        const imageElement = document.createElement("img");
        imageElement.src = image.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = image.title;

        container.appendChild(imageElement);
        container.appendChild(titleElement);

        sectionFiches.appendChild(container);
      }
    }
  };

  showAllImages();

  const secondResponse = await fetch('http://localhost:5678/api/categories');
  const categories = await secondResponse.json();

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const button = document.createElement("button");
    button.innerText = category.name;
    button.addEventListener("click", () => showImagesByCategory(category.id));
    filtresElement.appendChild(button);
  }

  const tousButton = document.createElement("button");
  tousButton.innerText = "Tous";
  tousButton.addEventListener("click", showAllImages);
  filtresElement.appendChild(tousButton);
  

  const logout = document.querySelector("#logout");
  logout.classList.add("hide");

  const popup = document.querySelector(".popup");
  popup.classList.add("hide");

  /* WHEN AUTHENTICATED */

  if (isAuthenticated()) {
    const bannière = document.querySelector("#edit_banner");
    bannière.classList.add("available");

    const hideFilter = document.querySelector("#Filtres");
    hideFilter.classList.add("hide");

    const popup = document.querySelector(".popup");
    popup.classList.remove("hide");

    const login = document.querySelector("#login");
    login.classList.add("hide");

    const logout = document.querySelector("#logout");
    logout.classList.add("available");

    logout.addEventListener("click", () => {
      localStorage.removeItem("jwtToken");
      window.location.href = "./login.html";
    });
  }

  /* Code Modal */
  const modal = document.querySelector("#modal");
  const modalbtn = document.querySelector(".openmodal");
  const closemodal = document.querySelector(".closemodal");

  
  const showAllImagesModal = () => {
    const secondgallery = document.querySelector("#secondgallery");
    secondgallery.innerHTML = "";
  
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const container = document.createElement("div");
  
      const imageElement = document.createElement("img");
      imageElement.src = image.imageUrl;
  
      const iconElement = document.createElement("i");
      iconElement.classList.add("fas", "fa-trash-can"); 
      iconElement.setAttribute("aria-hidden", "true"); 
  
      iconElement.addEventListener("click", () => {
        const imageUrlToDelete = image.imageUrl;
        fetch('http://localhost:5678/api/works/1', {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: imageUrlToDelete })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            container.remove();
            alert('Image supprimée avec succès');
          } else {
            alert('Une erreur est survenue lors de la suppression de l\'image');
          }
        })
        .catch(error => {
          console.error('Erreur lors de la requête :', error);
        });
      });
  
      const editElement = document.createElement("p");
      editElement.classList.add("edit-text");
      editElement.innerText = "Éditer";
  
      container.appendChild(imageElement);
      container.appendChild(editElement);
      container.appendChild(iconElement);
      secondgallery.appendChild(container);
    }
  };
  

  modalbtn.addEventListener("click", async () => {
    modal.classList.add("show-modal");
    const response = await fetch('http://localhost:5678/api/works');
    images = await response.json();
    showAllImagesModal();
  });

  closemodal.addEventListener("click", () => {
    modal.classList.remove("show-modal");
  });

  const modal1 = document.querySelector("#modal1");
  const modal2 = document.querySelector("#modal2");

  const addPicture = document.querySelector("#addpicture");
  addPicture.addEventListener("click", () => {
    modal1.classList.remove("showmodal");
    modal1.classList.add("hidemodal");
    modal2.classList.remove("hidemodal");
    modal2.classList.add("showmodal");
  });

  const retourAjoutPhoto = document.querySelector("#retourAjoutPhoto")
  retourAjoutPhoto.addEventListener("click", () => {
    modal1.classList.remove("hidemodal");
    modal1.classList.add("showmodal");
    modal2.classList.remove("showmodal");
    modal2.classList.add("hidemodal");
  });   

  /* ajout photo */

  const fileInput = document.getElementById("file");
  const addButton = document.getElementById("validation");
  
  addButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (!file) {
      console.log("Aucun fichier sélectionné");
      return;
    }
    const allowedFormats = ["image/jpeg", "image/png"];
    const maxFileSize = 4 * 1024 * 1024; // 4 Mo
    if (!allowedFormats.includes(file.type)) {
      console.log("Le format du fichier n'est pas pris en charge !");
      return;
    }
    if (file.size > maxFileSize) {
      console.log("Le fichier est trop volumineux (max 4 Mo) !");
      return;
    }
    console.log("Fichier image sélectionné :", file.name);
  });
  
});




