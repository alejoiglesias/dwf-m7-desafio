import { Router } from "@vaadin/router";

import { state } from "../state";

class ReportsPage extends HTMLElement {
  private buttonEl: HTMLButtonElement;
  private listEl: HTMLElement;

  static get pets() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="reports">
        <custom-text class="reports__title" type="title">Mascotas reportadas</custom-text>
        <div class="reports__list"></div>
      </div>
      <style>
        .reports {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .reports__title {
          width: 301px;
          margin-top: 50px;
        }
        
        .reports__list {
          display: flex;
          flex-direction: column;
          row-gap: 25px;
          margin-top: 50px;
          margin-bottom: 64px;
        }
      </style>
    `;
    return template;
  }

  static get empty() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="reports">
        <custom-text class="reports__title" type="title">Mascotas reportadas</custom-text>
        <custom-text class="reports__info" type="text">Aún no reportaste mascotas perdidas</custom-text>
        <img class="reports__img" src="${require("url:../assets/images/empty.svg")}" />
        <custom-button class="reports__button">Publicar reporte</custom-button>
      </div>
      <style>
        .reports {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .reports__title {
          width: 301px;
          margin-top: 50px;
        }
        
        .reports__info {
          width: 266px;
          height: 45px;
          margin-top: 17px;
          margin-bottom: 80px;
        }
        
        .reports__img {
          width: 305px;
          height: 231px;
          margin-bottom: 104px;
        }
        
        .reports__button {
          width: 335px;
          margin-bottom: 80px;
        }
      </style>
    `;
    return template;
  }

  onBeforeEnter() {
    const token = localStorage.getItem("token");

    if (!token) {
      Router.go("/auth");
    }
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  async hasLostPets() {
    return await state.getUserPets();
  }

  async connectedCallback() {
    const data = await this.hasLostPets();

    if (data.length > 0) {
      this.shadowRoot.appendChild(ReportsPage.pets.content.cloneNode(true));

      this.listEl = this.shadowRoot.querySelector(".reports__list");

      this.render(data);
    } else {
      this.shadowRoot.appendChild(ReportsPage.empty.content.cloneNode(true));

      this.buttonEl = this.shadowRoot.querySelector(".reports__button");
      this.buttonEl.addEventListener("click", () => Router.go("/new-report"));
    }
  }

  async render(data: any) {
    for (const pet of data) {
      const longitude = pet.last_location_lng;
      const latitude = pet.last_location_lat;

      const locationName = await this.getLocation({ latitude, longitude });

      const cardEl = document.createElement("custom-card");
      const nameEl = cardEl.shadowRoot.querySelector(".card__name");
      const locationEl = cardEl.shadowRoot.querySelector(".card__location");
      const imgEl = cardEl.shadowRoot.querySelector(".card__img");
      const buttonEl = cardEl.shadowRoot.querySelector(
        ".card__button--edit",
      ) as HTMLButtonElement;

      nameEl.textContent = pet.name;
      locationEl.textContent = locationName;
      imgEl.setAttribute("src", pet.photo_url);
      buttonEl.style.display = "flex";

      buttonEl.addEventListener("click", () => {
        const currentState = state.getState();
        currentState.pet = pet;
        state.setState(currentState);

        Router.go(`/edit-report`);
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

customElements.define("reports-page", ReportsPage);
