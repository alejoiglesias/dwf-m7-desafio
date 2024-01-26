import { Router } from "@vaadin/router";

import { showError, showNotification } from "..";
import { state } from "../state";

class ResetPasswordPage extends HTMLElement {
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private notifyEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="reset-password">
        <custom-text class="reset-password__title" type="title">Contraseña</custom-text>
        <custom-text class="reset-password__error" type="text"></custom-text>
        <custom-text class="reset-password__notify" type="text"></custom-text>
        <form class="reset-password__form">
          <label class="reset-password__label" for="password">
            NUEVA CONTRASEÑA
            <input class="reset-password__input" id="password" type="password" name="password" minlength="8" autocomplete="new-password" required />
          </label>
          <label class="reset-password__label" for="confirmPassword">
            CONFIRMAR CONTRASEÑA
            <input class="reset-password__input" type="password" name="confirmPassword" minlength="8" autocomplete="new-password" required />
          </label>
          <custom-button class="reset-password__button" type="submit">Guardar</custom-button>
        </form>
      </div>
      <style>
        .reset-password {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .reset-password__title {
          width: 301px;
          height: 50px;
          margin-top: 50px;
          margin-bottom: 159px;
        }
        
        .reset-password__notify {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: green;
        }
        
        .reset-password__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
        
        .reset-password__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .reset-password__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .reset-password__input {
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
        
        .reset-password__button {
          width: 335px;
          margin-top: 165px;
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
      ResetPasswordPage.template.content.cloneNode(true),
    );
  }

  connectedCallback() {
    this.initElements();
    this.render();

    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
  }

  initElements() {
    this.formEl = this.shadowRoot.querySelector(".reset-password__form");
    this.errorEl = this.shadowRoot.querySelector(".reset-password__error");
    this.notifyEl = this.shadowRoot.querySelector(".reset-password__notify");
  }

  render() {}

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    this.errorEl.style.display = "none";
    this.notifyEl.style.display = "none";

    const formData = new FormData(event.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      showError(this.errorEl, "Las contraseñas no coinciden.");
      return;
    }

    try {
      const data = await state.resetPassword(password);
      showNotification(this.notifyEl, data.message);
    } catch (error) {
      showError(this.errorEl, error.message);
    }
  }
}

customElements.define("reset-password-page", ResetPasswordPage);
