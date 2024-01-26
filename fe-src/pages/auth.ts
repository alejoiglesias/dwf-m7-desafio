import { Router } from "@vaadin/router";

import { state } from "../state";

class AuthPage extends HTMLElement {
  private formEl: HTMLFormElement;
  private linkEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="auth">
        <img class="auth__img" src="${require("url:../assets/images/auth.svg")}" />
        <custom-text class="auth__title" type="title">Ingresar</custom-text>
        <custom-text class="auth__info" type="text">Ingresá tu email para continuar</custom-text>
        <form class="auth__form">
          <label class="auth__label" for="email">
            EMAIL
            <input class="auth__input" id="email" name="email" type="email" autocomplete="email" required />
          </label>
          <custom-button class="auth__button" type="submit">Siguiente</custom-button>
        </form>
        <div class="auth__container">
          <custom-text type="text">Aún no tenes cuenta?</custom-text>
          <custom-text class="auth__link" type="text">Regístrate</custom-text>
        </div>
      </div>
      <style>
        .auth {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
  
        .auth__img {
          width: 340.3px;
          height: 205px;
          margin-top: 50px;
          margin-bottom: 50px;
        }
  
        .auth__title {
          width: 301px;
          height: 48px;
          margin-bottom: 25px;
        }
  
        .auth__info {
          width: 266px;
          height: 45px;
          margin-bottom: 30px;
        }
  
        .auth__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
  
        .auth__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .auth__input {
          box-sizing: border-box;
          width: 335px;
          height: 50px;
          margin-bottom: 25px;
          padding: 5px;
          border: none;
          border-radius: 4px;
          box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .auth__button {
          width: 335px;
          margin-bottom: 25px;
        }
  
        .auth__container {
          display: flex;
          column-gap: 5px;
          margin-bottom: 80px;
        }
  
        .auth__link {
          color: #5a8fec;
          cursor: pointer;
        }
      </style>
    `;
    return template;
  }

  onBeforeEnter() {
    const token = localStorage.getItem("token");

    if (token) {
      Router.go("/profile");
    }
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(AuthPage.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.initElements();
    this.addEventListeners();
  }

  initElements() {
    this.formEl = this.shadowRoot.querySelector(".auth__form");
    this.linkEl = this.shadowRoot.querySelector(".auth__link");
  }

  addEventListeners() {
    this.formEl.addEventListener("submit", (event) => {
      this.handleSubmit(event);
    });

    this.linkEl.addEventListener("click", () => {
      Router.go("/sign-up");
    });
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;

    const currentState = state.getState();
    currentState.email = email;
    state.setState(currentState);

    Router.go("/sign-in");
  }
}

customElements.define("auth-page", AuthPage);
