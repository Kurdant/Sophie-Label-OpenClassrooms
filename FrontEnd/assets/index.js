function isAuthenticated() {
  const jwtToken = localStorage.getItem("jwtToken");
  return jwtToken !== null;
}


const showAllImages = (gallery, works) => {
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const id = work.id;

    const container = document.createElement("div");
    const imageElement = document.createElement("img");
    const titleElement = document.createElement("figcaption");

    imageElement.src = work.imageUrl;
    container.id = `gallery_${id}`;
    titleElement.innerText = work.title;

    container.appendChild(imageElement);
    container.appendChild(titleElement);
    gallery.appendChild(container);
  }
};

const showAllImagesModal = (modalGallery, works) => {
  modalGallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const id = work.id;
    const jwtToken = localStorage.getItem("jwtToken");

    const container = document.createElement("div");
    const imageElement = document.createElement("img");
    const iconElement = document.createElement("i");
    const editElement = document.createElement("p");

    imageElement.src = work.imageUrl;
    container.id = `modal_${id}`;
    iconElement.classList.add("fa-solid", "fa-trash-can");
    iconElement.setAttribute("aria-hidden", "true");
    editElement.classList.add("edit-text");
    editElement.innerText = "éditer";

    container.appendChild(imageElement);
    container.appendChild(editElement);
    container.appendChild(iconElement);
    modalGallery.appendChild(container);



    iconElement.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        if (response.status === 204) {
          // delete work inside modal dynamically
          document.getElementById(`modal_${id}`).remove();
          // delete work in main display dynamically
          document.getElementById(`gallery_${id}`).remove();
        } else {
          console.error(`La suppression a échoué avec un statut ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
    });
    

  }
};

const showImagesByCategory = (categoryId) => {
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const image = works[i];

    if (image.categoryId === categoryId) {
      const container = document.createElement("div");

      const imageElement = document.createElement("img");
      imageElement.src = image.imageUrl;
      const titleElement = document.createElement("figcaption");
      titleElement.innerText = image.title;

      container.appendChild(imageElement);
      container.appendChild(titleElement);

      gallery.appendChild(container);
    }
  }
};

// ! using functions
window.addEventListener("load", async () => {

  // on page load, we get all the data that we need from the API
  const worksAPICall = await fetch('http://localhost:5678/api/works');
  let works = await worksAPICall.json();
  const categoriesAPICall = await fetch('http://localhost:5678/api/categories');
  const categories = await categoriesAPICall.json();

  const jwtToken = localStorage.getItem("jwtToken");

  // we retrieve HTML elements
  const select = document.getElementById('categoriesSelect');
  const gallery = document.querySelector(".gallery");
  const filters = document.querySelector("#Filtres");
  const logout = document.querySelector("#logout");
  const popup = document.querySelector(".popup");
  const banner = document.querySelector("#edit_banner");
  const hideFilter = document.querySelector("#Filtres");
  const login = document.querySelector("#login");
  const modal = document.querySelector("#modal");
  const openModal = document.querySelector("#openModal");
  const closemodal = document.querySelector(".closemodal");
  const modalGallery = document.querySelector("#modalGallery");
  const modalGalleryWrapper = document.querySelector("#modalGalleryWrapper");
  const addWorkModal = document.querySelector("#addWorkModal");
  const addPictureBtn = document.querySelector("#addpicture");
  const addWorkModalExitBtn = document.querySelector("#addWorkModalExitBtn");
  const title = document.getElementById("title");
  const form = document.getElementById("form");
  const fileInput = document.getElementById("file");
  const closeAddWorkModal = document.querySelector(".closeAddWorkModal");

  // we start updating the DOM here by showing my images
  showAllImages(gallery, works);

  // we update the DOM with the categories buttons on the main page
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const button = document.createElement("button");
    button.innerText = category.name;
    filters.appendChild(button);
    button.addEventListener("click", () => showImagesByCategory(category.id));
  }
  const buttonForAllCategories = document.createElement("button");
  buttonForAllCategories.innerText = "Tous";
  filters.appendChild(buttonForAllCategories);

  // we update the DOM with the categories buttons inside the modal select
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.text = category.name;
    select.appendChild(option);
  });

  // managing visibility of elements
  logout.classList.add("hide");
  popup.classList.add("hide");
  if (isAuthenticated()) {
    banner.classList.add("available");
    hideFilter.classList.add("hide");
    popup.classList.remove("hide");
    login.classList.add("hide");
    logout.classList.add("available");
  }

  // event listeners
  buttonForAllCategories.addEventListener("click", e => {
    showAllImages(gallery, works);
  });

  logout.addEventListener("click", () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "./login.html";
  });

  openModal.addEventListener("click", () => {
    modal.classList.add("show-modal");
    showAllImagesModal(modalGallery, works);
  });

  closemodal.addEventListener("click", () => {
    modal.classList.remove("show-modal");
  });

  addPictureBtn.addEventListener("click", () => {
    modal.classList.add("more_height");
    modalGalleryWrapper.classList.remove("showmodal");
    modalGalleryWrapper.classList.add("hidemodal");
    addWorkModal.classList.remove("hidemodal");
    addWorkModal.classList.add("showmodal");
  });

  addWorkModalExitBtn.addEventListener("click", () => {
    modal.classList.remove("more_height");
    modalGalleryWrapper.classList.remove("hidemodal");
    modalGalleryWrapper.classList.add("showmodal");
    addWorkModal.classList.remove("showmodal");
    addWorkModal.classList.add("hidemodal");
  });

  closeAddWorkModal.addEventListener("click", () => {
    modal.classList.remove("show-modal");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const image = fileInput.files[0];
    formData.append('image', image);

    formData.append('title', title.value);

    const categoriesSelect = document.getElementById('categoriesSelect');
    formData.append('category', categoriesSelect.value);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        },
        body: formData,
      })
      if (reponse.status === 201){
        const newWork = await reponse.json();
        const newWorkId = newWork.id;

        // add new work inside gallery dynamically
        const newWorkGalleryContainer = document.createElement("div");
        const newWorkImageGalleryElement = document.createElement("img");
        const newWorkGalleryTitleElement = document.createElement("figcaption");
        newWorkImageGalleryElement.src = newWork.imageUrl;
        newWorkGalleryContainer.id = `gallery_${newWorkId}`;
        newWorkGalleryTitleElement.innerText = newWork.title;
        newWorkGalleryContainer.appendChild(newWorkImageGalleryElement);
        newWorkGalleryContainer.appendChild(newWorkGalleryTitleElement);
        gallery.appendChild(newWorkGalleryContainer);

        // add new work inside modal dynamically
        const jwtToken = localStorage.getItem("jwtToken");
        const newWorkModalContainer = document.createElement("div");
        const newWorkImageModalElement = document.createElement("img");
        const iconElement = document.createElement("i");
        const editElement = document.createElement("p");
        newWorkImageModalElement.src = newWork.imageUrl;
        newWorkModalContainer.id = `modal_${newWorkId}`;
        iconElement.classList.add("fa-solid", "fa-trash-can");
        iconElement.setAttribute("aria-hidden", "true");
        editElement.classList.add("edit-text");
        editElement.innerText = "éditer";
        newWorkModalContainer.appendChild(newWorkImageModalElement);
        newWorkModalContainer.appendChild(editElement);
        newWorkModalContainer.appendChild(iconElement);
        modalGallery.appendChild(newWorkModalContainer);
        iconElement.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            const response = await fetch(`http://localhost:5678/api/works/${newWorkId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${jwtToken}`
              }
            });
            if (response.status === 204) {
              // delete work inside modal dynamically
              document.getElementById(`modal_${newWorkId}`).remove();
              // delete work in main display dynamically
              document.getElementById(`gallery_${newWorkId}`).remove();
            } else {
              console.error(`La suppression a échoué avec un statut ${response.status}`);
            }
          } catch (error) {
            console.error(error);
          }
        });

      }
    } catch (error) {
      console.error(error);
    }
  });

});
