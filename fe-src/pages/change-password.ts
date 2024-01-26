import { Router } from "@vaadin/router";

import { showError, showNotification } from "..";
import { state } from "../state";

class ChangePasswordPage extends HTMLElement {
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private notifyEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="change-password">
        <custom-text class="change-password__title" type="title">Contraseña</custom-text>
        <custom-text class="change-password__error" type="text"></custom-text>
        <custom-text class="change-password__notify" type="text"></custom-text>
        <form class="change-password__form">
          <label class="change-password__label" for="password">
            NUEVA CONTRASEÑA
            <input class="change-password__input" id="password" type="password" name="password" minlength="8" autocomplete="new-password" required />
          </label>
          <label class="change-password__label" for="confirmPassword">
            CONFIRMAR CONTRASEÑA
            <input class="change-password__input" id="confirmPassword" type="password" name="confirmPassword" minlength="8" autocomplete="new-password" required />
          </label>
          <custom-button class="change-password__button" type="submit">Guardar</custom-button>
        </form>
      </div>
      <style>
        .change-password {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
  
        .change-password__title {
          width: 301px;
          height: 50px;
          margin-top: 50px;
          margin-bottom: 159px;
        }
  
        .change-password__notify {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: green;
        }
  
        .change-password__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
  
        .change-password__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
  
        .change-password__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .change-password__input {
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
  
        .change-password__button {
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

    if (!token) {
      Router.go("/auth");
    }
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      ChangePasswordPage.template.content.cloneNode(true),
    );
  }

  connectedCallback() {
    this.initElements();
    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
  }

  initElements() {
    this.formEl = this.shadowRoot.querySelector(".change-password__form");
    this.errorEl = this.shadowRoot.querySelector(".change-password__error");
    this.notifyEl = this.shadowRoot.querySelector(".change-password__notify");
  }

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
      const data = await state.changePassword(password);
      showNotification(this.notifyEl, data.message);
    } catch (error) {
      showError(this.errorEl, error.message);
    }
  }
}

customElements.define("change-password-page", ChangePasswordPage);
