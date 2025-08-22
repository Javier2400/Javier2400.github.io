// Global constants

// Initial cards data (image + name for each place)
const cards = [
    {
        link: "https://imgs.search.brave.com/Fz3THXyIwo62j_je_N7pAlVJhpP-2EaeFDm573BKh2U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMzLm1lbWVkcm9p/ZC5jb20vaW1hZ2Vz/L1VQTE9BREVENTEx/LzY4NGM2MGEzYjc0/YmEuanBlZw",
        name: "saa"
    },
    {
        link: "https://imgs.search.brave.com/Fz3THXyIwo62j_je_N7pAlVJhpP-2EaeFDm573BKh2U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMzLm1lbWVkcm9p/ZC5jb20vaW1hZ2Vz/L1VQTE9BREVENTEx/LzY4NGM2MGEzYjc0/YmEuanBlZw",
        name: "sa"
    },
    {
        link: "https://imgs.search.brave.com/Fz3THXyIwo62j_je_N7pAlVJhpP-2EaeFDm573BKh2U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMzLm1lbWVkcm9p/ZC5jb20vaW1hZ2Vz/L1VQTE9BREVENTEx/LzY4NGM2MGEzYjc0/YmEuanBlZw",
        name: "s"
    }
];

// Profile elements
const travelerProfileName = document.querySelector(".traveler-profile__name");
const travelerProfileBio = document.querySelector(".traveler-profile__bio");
const travelerProfileAddPlaceBtn = document.querySelector(".traveler-profile__add-place-btn");
const travelerProfileEditBtn = document.querySelector(".traveler-profile__edit-btn");

// Gallery container
const placesGalleryList = document.querySelector(".places-gallery__list");

// Modals
const modalEditProfile = document.querySelector("#modal-edit-profile");
const modalNewPlace = document.querySelector("#modal-new-place");
const modalImageView = document.querySelector("#modal-image-view");

// Forms inside modals
const formEditProfile = modalEditProfile.querySelector(".modal__form");
const formNewPlace = modalNewPlace.querySelector(".modal__form");

// Profile input fields
const inputProfileName = modalEditProfile.querySelector("#profile-name");
const inputProfileDescription = modalEditProfile.querySelector("#profile-description");

// Event listeners

// This function handles profile form submission and updates profile info
formEditProfile.addEventListener("submit", (evt) => {
    evt.preventDefault();
    travelerProfileName.textContent = inputProfileName.value;
    travelerProfileBio.textContent = inputProfileDescription.value;
    modalEditProfile.classList.toggle("modal_is-opened");
});

// This function opens the edit profile modal and pre-fills the inputs
travelerProfileEditBtn.addEventListener("click", () => {
    inputProfileName.value = travelerProfileName.textContent;
    inputProfileDescription.value = travelerProfileBio.textContent;
    modalEditProfile.classList.toggle("modal_is-opened");
});

// This function opens the add new place modal
travelerProfileAddPlaceBtn.addEventListener("click", () => {
    modalNewPlace.classList.toggle("modal_is-opened");
});

// This function handles new place form submission and creates a new card
formNewPlace.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const modalInputs = Array.from(formNewPlace.querySelectorAll(".modal__input"));
    const tempCard = {};
    modalInputs.forEach((input) => {
        tempCard[input.name] = input.value;
    });

    // FIX: mapear el nombre del título del lugar del HTML (place-name) a "name" sin tocar el HTML
    if (tempCard["place-name"] && !tempCard.name) {
        tempCard.name = tempCard["place-name"];
    }

    createCard(tempCard);
    formNewPlace.reset();
    modalNewPlace.classList.remove("modal_is-opened");
});

// This function closes modals when clicking their close button
const modalsClose = Array.from(document.querySelectorAll(".modal__close"));
modalsClose.forEach((modalClose) => {
    modalClose.addEventListener("click", (evt) => {
        const modal = evt.target.closest(".modal");
        modal.classList.remove("modal_is-opened");
    });
});

document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
        if (!e.target.closest(".modal__content") && !e.target.closest(".modal__box")) {
        modal.classList.remove("modal_is-opened");
        }
    });
});


// Form validation

// FIX: antes deshabilitaba el botón cuando ALGÚN input era válido.
// Ahora devuelve true solo si TODOS son válidos.
const validarboton = (modalInputs) => {
    return modalInputs.every((inputElement) => inputElement.validity.valid);
};

const modalForms = Array.from(document.querySelectorAll(".modal__form"));
modalForms.forEach((form) => {
    const modalInputs = Array.from(form.querySelectorAll(".modal__input"));
    const modalButton = form.querySelector(".modal__button"); 

    // FIX: deshabilitar si NO todos son válidos
    modalButton.disabled = !validarboton(modalInputs);

    modalInputs.forEach((modalInput) => {
        modalInput.addEventListener("input", () => {
            // FIX: mantener la misma lógica corregida en el input
            modalButton.disabled = !validarboton(modalInputs);

            let modalError = form.querySelector("#" + modalInput.id + "-error");
            if (!modalInput.validity.valid) {
                modalError.textContent = "there is an error";
                modalError.classList.add("modal__error_visible");
            } else {
                modalError.textContent = "";
                modalError.classList.remove("modal__error_visible");
            }
        });
    });
});

// Card creation

// This function creates a new place card and appends it to the gallery
const createCard = (card) => {
    const template = document
        .querySelector("#template-place-card")
        .content.cloneNode(true);

    const placeCardImage = template.querySelector(".place-card__image");
    const placeCardTitle = template.querySelector(".place-card__title");

    // FIX: ser tolerantes al nombre desde "place-name" o "name" y al link vacío
    const title = (card.name ?? card["place-name"] ?? "").trim();
    const link = (card.link ?? "").trim();

    placeCardImage.src = link || "#";
    placeCardImage.alt = title;
    placeCardTitle.textContent = title || "";

    // Opens image modal when clicking on a card image
    placeCardImage.addEventListener("click", () => {
        // Solo abrir si hay imagen válida
        if (!link) return;
        modalImageView.classList.toggle("modal_is-opened");
        const modalImage = modalImageView.querySelector(".modal__image");
        const modalCaption = modalImageView.querySelector(".modal__caption");
        modalImage.src = link;
        modalImage.alt = title;
        modalCaption.textContent = title;
    });

    // Toggles like button state
    const placeCardLikeButton = template.querySelector(".place-card__like-button");
    placeCardLikeButton.addEventListener("click", () => {
        placeCardLikeButton.classList.toggle("place-card__like-button_is-active");
    });

    // Deletes the card
    const placeCardDeleteButton = template.querySelector(".place-card__delete-button");
    placeCardDeleteButton.addEventListener("click", (evt) => {
        evt.target.closest(".place-card").remove();
    });

    placesGalleryList.appendChild(template);
};

// Initialization

// Renders the initial cards
cards.forEach((card) => {
    createCard(card);
});

// Sets a default profile name
travelerProfileName.textContent = "quaso";
