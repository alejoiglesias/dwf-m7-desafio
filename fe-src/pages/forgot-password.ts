import { Router } from "@vaadin/router";

import { showError, showNotification } from "..";
import { state } from "../state";

class ForgotPasswordPage extends HTMLElement {
  private inputEl: HTMLInputElement;
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private notifyEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="forgot-password">
        <custom-text class="forgot-password__title" type="title">Recuperar contraseña</custom-text>
        <custom-text class="forgot-password__info" type="text">Ingresá tu email para continuar</custom-text>
        <custom-text class="forgot-password__error" type="text"></custom-text>
        <custom-text class="forgot-password__notify" type="text"></custom-text>
        <form class="forgot-password__form">
          <label class="forgot-password__label" for="email">
            EMAIL
            <input class="forgot-password__input" id="email" type="email" name="email" autocomplete="username" required />
          </label>
          <custom-button class="forgot-password__button" type="submit">Enviar</custom-button>
        </form>
      </div>
      <style>
        .forgot-password {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
  
        .forgot-password__title {
          width: 301px;
          margin-top: 50px;
          margin-bottom: 25px;
        }
  
        .forgot-password__info {
          width: 266px;
          height: 45px;
          margin-bottom: 30px;
        }
  
        .forgot-password__notify {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: green;
        }
  
        .forgot-password__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
  
        .forgot-password__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
  
        .forgot-password__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
    
        .forgot-password__input {
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
  
        .forgot-password__button {
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
    this.shadowRoot.appendChild(
      ForgotPasswordPage.template.content.cloneNode(true),
    );
  }

  connectedCallback() {
    this.initElements();
    this.render();

    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
  }

  initElements() {
    this.inputEl = this.shadowRoot.querySelector(".forgot-password__input");
    this.formEl = this.shadowRoot.querySelector(".forgot-password__form");
    this.errorEl = this.shadowRoot.querySelector(".forgot-password__error");
    this.notifyEl = this.shadowRoot.querySelector(".forgot-password__notify");
  }

  render() {
    const currentState = state.getState();
    const email = currentState.email;
    this.inputEl.value = email || "";
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    this.errorEl.style.display = "none";
    this.notifyEl.style.display = "none";

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;

    try {
      const data = await state.sendRecoveryPasswordEmail(email);
      showNotification(this.notifyEl, data.message);
    } catch (error) {
      showError(this.errorEl, error.message);
    }
  }
}

customElements.define("forgot-password-page", ForgotPasswordPage);
