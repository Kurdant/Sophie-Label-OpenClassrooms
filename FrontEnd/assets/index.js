window.addEventListener("load", async () => {

  // SO fetching gallery code
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

  /*
  * display categories dynamically as HTML buttons inside `#Filtres` element
    add event listener to the `Tous` button which calls `showAllImages` function
    add event listeners on other buttons that call another function, which takes the category id as a parameter
  * */

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

});


