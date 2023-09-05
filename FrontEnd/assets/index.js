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
  const modalbtn2 = document.querySelector("#openmodal2");
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
      iconElement.classList.add("fa-solid", "fa-trash-can"); 
      iconElement.setAttribute("aria-hidden", "true"); 
  
      iconElement.addEventListener("click", () => {
        console.log(image.id)
        const id = [0]; 
      
        fetch(`http://localhost:5678/api/works/{id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer Token`
          }
        })  
      });
      const editElement = document.createElement("p");
      editElement.classList.add("edit-text");
      editElement.innerText = "éditer";
  
      container.appendChild(imageElement);
      container.appendChild(editElement);
      container.appendChild(iconElement);
      secondgallery.appendChild(container);
    }
  };
  

  modalbtn2.addEventListener("click", async () => {
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


  function getCategories() {
    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById('categories-select');
        data.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id; 
          option.text = category.name; 
          select.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories :', error);
      });
  }

  getCategories();
  

  /* ajout photo */

  const addButton = document.getElementById("validation");
  const title = document.getElementById("title")

  const form = document.getElementById("form");
  const inputFile = document.getElementById("file");
  const closemodal2 = document.querySelector(".closemodal2");

  closemodal2.addEventListener("click", () => {
    modal.classList.remove("show-modal");
  });

  form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("file");

  if (fileInput.files.length <= 0) {
    console.log("Aucun fichier sélectionné");
    return;
  }

  // const formData = new FormData();
  const formData = new FormData(document.getElementById("form"));
  console.log("NEW WAY OF GETTING FORM DATA", formData.values()); debugger

  const file = fileInput.files[0];
  const allowedFormats = ["image/jpeg", "image/png"];
  const maxFileSize = 4 * 1024 * 1024;
  if (!allowedFormats.includes(file.type)) {
    console.log("Le format du fichier n'est pas pris en charge !");
    return;
  }
  if (file.size > maxFileSize) {
    console.log("Le fichier est trop volumineux (max 4 Mo) !");
    return;
  }

  console.log(file); debugger
  console.log("BEFORE APPENDING", formData.values()); debugger
  formData.append("image", file);
  console.log("AFTER APPENDING", formData.values()); debugger
  
  const select = document.getElementById('categories-select');
  const selectedCategoryId = select.value;

  const titleInput = document.getElementById("title");
  const titleValue = titleInput.value;

  console.log("Fichier image sélectionné :", file.name);
  console.log("Valeur du champ 'title' : ", titleValue);
  console.log("Catégorie sélectionnée (ID) : ", selectedCategoryId);


    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { 
        // 'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MzkyODI4MywiZXhwIjoxNjk0MDE0NjgzfQ.rN95axl97xTaZfrCVab6s1zrvgBrxoYOuwNUf4BRLEM` },
      body: formData,
  })
  .then(response => {
    if (response.status === 200) {
      console.log("Requête réussie !");
    } else {
      console.log("Échec de la requête.");
    }
  })
  .catch(error => {
    console.error("Erreur lors de la requête :", error);
  });
});
  
    
  });





