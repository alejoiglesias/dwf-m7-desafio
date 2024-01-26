import { Router } from "@vaadin/router";

import { showError } from "..";
import { state } from "../state";

class SignUpPage extends HTMLElement {
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private linkEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="signup">
        <custom-text class="signup__title" type="title">Registrarse</custom-text>
        <custom-text class="signup__info" type="text">Ingresá los siguientes datos para realizar el registro</custom-text>
        <custom-text class="signup__error" type="text"></custom-text>
        <form class="signup__form">
          <label class="signup__label" for="email">
            EMAIL
            <input class="signup__input" id="email" type="email" name="email" autocomplete="email" required />
          </label>
          <label class="signup__label" for="password">
            CONTRASEÑA
            <input class="signup__input" id="password" type="password" name="password" minlength="8" autocomplete="new-password" required />
          </label>
          <label class="signup__label" for="confirmPassword">
            CONFIRMAR CONTRASEÑA
            <input class="signup__input" id="confirmPassword" type="password" name="confirmPassword" minlength="8" autocomplete="new-password" required />
          </label>
          <div class="signup__container">
            <custom-text type="text">Ya tenés una cuenta?</custom-text>
            <custom-text class="signup__link" type="text">Iniciar sesión.</custom-text>
          </div>
          <custom-button class="signup__button" type="submit">Enviar</custom-button>
        </form>
      </div>
      <style>
        .signup {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
  
        .signup__title {
          width: 301px;
          height: 48px;
          margin-top: 50px;
          margin-bottom: 25px;
        }
  
        .signup__info {
          width: 266px;
          height: 45px;
          margin-bottom: 82px;
        }
  
        .signup__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
  
        .signup__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
  
        .signup__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .signup__input {
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
  
        .signup__container {
          display: flex;
          column-gap: 5px;
          justify-content: center;
          margin-bottom: 30px;
        }
  
        .signup__link {
          margin-bottom: 30px;
          color: #5a8fec;
          cursor: pointer;
        }
  
        .signup__button {
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
    this.shadowRoot.appendChild(SignUpPage.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.initElements();
    this.addEventListeners();
  }

  initElements() {
    this.formEl = this.shadowRoot.querySelector(".signup__form");
    this.errorEl = this.shadowRoot.querySelector(".signup__error");
    this.linkEl = this.shadowRoot.querySelector(".signup__link");
  }

  addEventListeners() {
    this.formEl.addEventListener("submit", async (event) => {
      event.preventDefault();

      this.errorEl.style.display = "none";

      const formData = new FormData(event.target as HTMLFormElement);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        showError(this.errorEl, "Las contraseñas no coinciden.");
        return;
      }

      try {
        const data = await state.signUp({ email, password });

        if (data.message) {
          showError(this.errorEl, data.message);
        } else {
          Router.go("/profile");
        }
      } catch (error) {
        showError(this.errorEl, error.message);
      }
    });

    this.linkEl.addEventListener("click", () => {
      Router.go("/sign-in");
    });
  }
}

customElements.define("signup-page", SignUpPage);
