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

  if (isAuthenticated()) {
    const bannière = document.querySelector("#edit_banner");
    bannière.classList.add("available");

    const hideFilter = document.querySelector("#Filtres");
    hideFilter.classList.add("hide");

    const popup = document.querySelector("#popup");
    popup.classList.add("available");

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
  const modalbtn = document.querySelector("#openmodal");
  const closemodal = document.querySelector("#closemodal");


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
        const imageId = iconElement.getAttribute("data-image-id");
        console.log(image.id)
        const parentContainer = iconElement.parentElement;
        parentContainer.remove();

      })


  
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
});
