function isAuthenticated() {
  const jwtToken = localStorage.getItem("jwtToken");
  return jwtToken !== null;
}

window.addEventListener("load", async () => {

  const response = await fetch('http://localhost:5678/api/works');
  const images = await response.json();
  console.log(images);

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
  console.log(categories);

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


  if (isAuthenticated()) {
    const bannière = document.querySelector("#edit_banner");
    bannière.classList.add("avaible");
    const projects_connected = document.querySelector("#projects_connected");
    projects_connected.classList.add("avaible");
    const Filtres = document.querySelector("#Filtres");
    Filtres.classList.add("avaible");
    const portfolio = document.querySelector("#portfolio");
    portfolio.classList.add("avaible");
  }
});


