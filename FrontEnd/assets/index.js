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
  
      iconElement.addEventListener("click", (e) => {
        e.preventDefault();
        const id = image.id; 
        const jwtToken = localStorage.getItem("jwtToken");
        fetch(`http://localhost:5678/api/works/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        })  
        .catch(error => {
          console.error(error);
        });
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
    modal.classList.add("more_height");
    modal1.classList.remove("showmodal");
    modal1.classList.add("hidemodal");
    modal2.classList.remove("hidemodal");
    modal2.classList.add("showmodal");
  });

  const retourAjoutPhoto = document.querySelector("#retourAjoutPhoto")
  retourAjoutPhoto.addEventListener("click", () => {
    modal.classList.remove("more_height");
    modal1.classList.remove("hidemodal");
    modal1.classList.add("showmodal");
    modal2.classList.remove("showmodal");
    modal2.classList.add("hidemodal");
  });   


  function getCategories() {
    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById('category');
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
  const file = document.getElementById("file");
  const closemodal2 = document.querySelector(".closemodal2");


  
  closemodal2.addEventListener("click", () => {
    modal.classList.remove("show-modal");
  });

  const jwtToken = localStorage.getItem("jwtToken");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById("file");
    const image = fileInput.files[0];
    formData.append('image', image);

    const title = document.getElementById('title');
    formData.append('title', title.value);
    
    const category = document.getElementById('category');
    formData.append('category', category.value);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${jwtToken}` },
        body: formData,
      })
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
});

});

