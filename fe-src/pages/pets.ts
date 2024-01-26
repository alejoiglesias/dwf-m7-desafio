import { Router } from "@vaadin/router";

import { state } from "../state";

class PetsPage extends HTMLElement {
  private buttonEl: HTMLButtonElement;
  private listEl: HTMLElement;
  private reportEl: HTMLElement;

  static get pets() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="pets">
        <custom-text class="pets__title" type="title">Mascotas perdidas cerca</custom-text>
        <div class="pets__list"></div>
        <custom-report class="pets__report"></custom-report>
      </div>
      <style>
        .pets {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .pets__title {
          width: 334px;
          margin-top: 50px;
        }
        
        .pets__list {
          display: flex;
          flex-direction: column;
          row-gap: 35px;
          margin-top: 50px;
          margin-bottom: 64px;
        }

        .pets__report{
        }
      </style>
    `;
    return template;
  }

  static get empty() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="pets">
        <custom-text class="pets__title" type="title">Mascotas perdidas cerca</custom-text>
        <custom-text class="pets__info" type="text">No se han reportado mascotas cerca de tu ubicación</custom-text>
        <img class="pets__img" src="${require("url:../assets/images/empty.svg")}" />
        <custom-button class="pets__button">Publicar reporte</custom-button>
      </div>
      <style>
        .pets {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .pets__title {
          width: 301px;
          margin-top: 50px;
        }
        
        .pets__info {
          width: 266px;
          height: 45px;
          margin-top: 17px;
          margin-bottom: 80px;
        }
        
        .pets__img {
          width: 305px;
          height: 231px;
          margin-bottom: 104px;
        }
        
        .pets__button {
          width: 335px;
          margin-bottom: 80px;
        }
      </style>
    `;
    return template;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const currentState = state.getState();
    const { longitude, latitude } = currentState;

    if (longitude === 0 && latitude === 0) {
      const data = await state.getLostPets();

      if (data.length > 0) {
        this.shadowRoot.appendChild(PetsPage.pets.content.cloneNode(true));

        this.listEl = this.shadowRoot.querySelector(".pets__list");
        this.render(data);
      } else {
        this.shadowRoot.appendChild(PetsPage.empty.content.cloneNode(true));

        this.buttonEl = this.shadowRoot.querySelector(".pets__button");
        this.buttonEl.addEventListener("click", () => Router.go("/new-report"));
      }
    } else {
      const data = await state.getLostPetsAroundMe({ latitude, longitude });

      if (data.length > 0) {
        this.shadowRoot.appendChild(PetsPage.pets.content.cloneNode(true));

        this.listEl = this.shadowRoot.querySelector(".pets__list");
        this.render(data);
      } else {
        this.shadowRoot.appendChild(PetsPage.empty.content.cloneNode(true));

        this.buttonEl = this.shadowRoot.querySelector(".pets__button");
        this.buttonEl.addEventListener("click", () => Router.go("/new-report"));
      }
    }
  }

  async render(data: any) {
    for (const pet of data) {
      const longitude = pet._geoloc.lng;
      const latitude = pet._geoloc.lat;

      const locationName = await this.getLocation({ latitude, longitude });

      const cardEl = document.createElement("custom-card");
      const nameEl = cardEl.shadowRoot.querySelector(".card__name");
      const locationEl = cardEl.shadowRoot.querySelector(".card__location");
      const imgEl = cardEl.shadowRoot.querySelector(".card__img");
      const buttonEl = cardEl.shadowRoot.querySelector(
        ".card__button--report",
      ) as HTMLButtonElement;

      nameEl.textContent = pet.name;
      locationEl.textContent = locationName;
      imgEl.setAttribute("src", pet.photo_url);
      buttonEl.style.display = "flex";

      buttonEl.addEventListener("click", () => {
        const currentState = state.getState();
        currentState.pet = pet;
        state.setState(currentState);

        this.reportEl = this.shadowRoot
          .querySelector(".pets__report")
          .shadowRoot.querySelector(".report");

        this.reportEl.style.display = "flex";
      });

      this.listEl.appendChild(cardEl);
    }
  }

  async getLocation({ longitude, latitude }) {
    const reponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=region&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );

    const data = await reponse.json();
    const location = data.features[0].place_name;
    return location;
  }
}

customElements.define("pets-page", PetsPage);
