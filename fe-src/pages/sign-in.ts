import { Router } from "@vaadin/router";

import { showError } from "..";
import { state } from "../state";

class SignInPage extends HTMLElement {
  private inputEl: HTMLInputElement;
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private linkEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="signin">
        <custom-text class="signin__title" type="title">Iniciar Sesión</custom-text>
        <custom-text class="signin__info" type="text">Ingresá los siguientes datos para iniciar sesión</custom-text>
        <custom-text class="signin__error" type="text"></custom-text>
        <form class="signin__form">
          <label class="signin__label" for="email">
            EMAIL
            <input class="signin__input" id="email" type="email" name="email" autocomplete="email" required />
          </label>
          <label class="signin__label" for="password">
            CONTRASEÑA
            <input class="signin__input" id="password" type="password" name="password" minlength="8" autocomplete="new-password" required />
          </label>
          <custom-text class="signin__link" type="text">Olvidé mi contraseña</custom-text>
          <custom-button class="signin__button" type="submit">Acceder</custom-button>
        </form>
      </div>
      <style>
        .signin {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .signin__title {
          width: 301px;
          height: 48px;
          margin-top: 50px;
          margin-bottom: 25px;
        }
        
        .signin__info {
          width: 266px;
          height: 45px;
          margin-bottom: 116px;
        }
        
        .signin__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
        
        .signin__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .signin__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
    
        .signin__input {
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
        
        .signin__link {
          margin-bottom: 120px;
          color: #5a8fec;
          cursor: pointer;
        }
        
        .signin__button {
          width: 335px;
          margin-bottom: 80px;
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
    this.shadowRoot.appendChild(SignInPage.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.initElements();
    this.render();
    this.addEventListeners();
  }

  initElements() {
    this.inputEl = this.shadowRoot.querySelector("input[name='email']");
    this.formEl = this.shadowRoot.querySelector(".signin__form");
    this.errorEl = this.shadowRoot.querySelector(".signin__error");
    this.linkEl = this.shadowRoot.querySelector(".signin__link");
  }

  render() {
    const currentState = state.getState();
    const email = currentState.email;
    this.inputEl.value = email || "";
  }

  addEventListeners() {
    this.formEl.addEventListener("submit", async (event) => {
      event.preventDefault();

      this.errorEl.style.display = "none";

      const formData = new FormData(event.target as HTMLFormElement);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        await state.signIn({ email, password });

        Router.go("/reports");
      } catch (error) {
        showError(this.errorEl, error.message);
      }
    });

    this.linkEl.addEventListener("click", () => {
      Router.go("/forgot-password");
    });
  }
}

customElements.define("signin-page", SignInPage);
