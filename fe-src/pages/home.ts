import { Router } from "@vaadin/router";

import { state } from "../state";

class HomePage extends HTMLElement {
  private buttonEl: HTMLButtonElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="home">
        <img class="home__img" src="${require("url:../assets/images/home.svg")}" />
        <custom-text class="home__title" type="title">Pet Finder App</custom-text>
        <custom-text class="home__subtitle" type="info">Encontrá y reportá mascotas perdidas cerca de tu ubicación</custom-text>
        <custom-button class="home__button" type="submit">Dar mi ubicación actual</custom-button>
      </div>
      <style>
        .home {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .home__img {
          width: 215.42px;
          height: 235px;
          margin-top: 50px;
          margin-bottom: 50px;
        }
        
        .home__title {
          margin-bottom: 25px;
          color: #eb6372;
        }
        
        .home__subtitle {
          width: 266px;
          height: 105px;
          margin-bottom: 34px;
        }
        
        .home__button {
          width: 270px;
          height: 50px;
          margin-bottom: 80px;
        }
      </style>
    `;
    return template;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(HomePage.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.buttonEl = this.shadowRoot.querySelector(".home__button");
    this.buttonEl.addEventListener("click", this.handleClick);
  }

  handleClick() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.setLngLat({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });

        Router.go("/pets");
      },
      () => {
        Router.go("/pets");
      },
    );
  }
}

customElements.define("home-page", HomePage);
