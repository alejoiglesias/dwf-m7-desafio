import { Router } from "@vaadin/router";

import { state } from "../state";

class ProfilePage extends HTMLElement {
  private emailEl: HTMLElement;
  private logoutEl: HTMLElement;
  private editProfileEl: HTMLElement;
  private changePasswordEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="profile">
        <custom-text class="profile__title" type="title">Mis Datos</custom-text>
        <custom-button class="profile__button profile__button--data">Modificar datos personales</custom-button>
        <custom-button class="profile__button profile__button--password">Modificar contraseña</custom-button>
        <div class="profile__footer">
          <custom-text class="profile__email" type="uppercase"></custom-text>
          <custom-text class="profile__logout" type="link">CERRAR SESIÓN</custom-text>
        </div>
      </div>
      <style>
        .profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .profile__title {
          margin-top: 50px;
          margin-bottom: 175px;
        }
        
        .profile__subtitle {
          width: 266px;
          height: 105px;
          margin-bottom: 34px;
        }
        
        .profile__button {
          width: 335px;
          height: 50px;
        }
        
        .profile__button--data {
          margin-bottom: 25px;
        }
        
        .profile__button--password {
          margin-bottom: 199px;
        }
        
        .profile__footer {
          display: flex;
          row-gap: 17px;
          flex-direction: column;
          align-items: center;
        }
        
        .profile__email {
          width: 334px;
          height: 25px;
        }
        
        .profile__logout {
          width: 120px;
          height: 33px;
          margin-bottom: 80px;
          cursor: pointer;
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
    this.shadowRoot.appendChild(ProfilePage.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.initElements();
    this.render();
    this.addEventListeners();
  }

  initElements() {
    this.emailEl = this.shadowRoot.querySelector(".profile__email");
    this.logoutEl = this.shadowRoot.querySelector(".profile__logout");
    this.editProfileEl = this.shadowRoot.querySelector(
      ".profile__button--data",
    );
    this.changePasswordEl = this.shadowRoot.querySelector(
      ".profile__button--password",
    );
  }

  render() {
    const currentState = state.getState();
    const email = currentState.email;
    this.emailEl.textContent = email;
  }

  addEventListeners() {
    this.logoutEl.addEventListener("click", () => {
      const currentState = state.getState();
      currentState.email = "";
      state.setState(currentState);

      localStorage.setItem("token", "");

      state.dispatchTokenChangeEvent();

      Router.go("/");
    });

    this.editProfileEl.addEventListener("click", () => {
      Router.go("/edit-profile");
    });

    this.changePasswordEl.addEventListener("click", () => {
      Router.go("/change-password");
    });
  }
}

customElements.define("profile-page", ProfilePage);
