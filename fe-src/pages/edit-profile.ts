import { Router } from "@vaadin/router";

import { showError, showNotification } from "..";
import { state } from "../state";

class EditProfilePage extends HTMLElement {
  private fullnameEl: HTMLInputElement;
  private locationEl: HTMLInputElement;
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private notifyEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="edit-profile">
        <custom-text class="edit-profile__title" type="title">Datos personales</custom-text>
        <custom-text class="edit-profile__error" type="text"></custom-text>
        <custom-text class="edit-profile__notify" type="text"></custom-text>
        <form class="edit-profile__form">
          <label class="edit-profile__label" for="fullname">
            NOMBRE
            <input class="edit-profile__input" id="fullname" name="fullname" autocomplete="name" required />
          </label>
          <label class="edit-profile__label" for="location">
            LOCALIDAD
            <input class="edit-profile__input" id="location" name="location" autocomplete="street-address" required />
          </label>
          <custom-button class="edit-profile__button" type="submit">Guardar</custom-button>
        </form>
      </div>
      <style>
        .edit-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
  
        .edit-profile__title {
          width: 301px;
          height: 99px;
          margin-top: 50px;
          margin-bottom: 110px;
        }
  
        .edit-profile__notify {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: green;
        }
  
        .edit-profile__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
  
        .edit-profile__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
  
        .edit-profile__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .edit-profile__input {
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
  
        .edit-profile__button {
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
      EditProfilePage.template.content.cloneNode(true),
    );
  }

  connectedCallback() {
    this.initElements();
    this.render();

    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
  }

  initElements() {
    this.fullnameEl = this.shadowRoot.querySelector("input[name='fullname']");
    this.locationEl = this.shadowRoot.querySelector("input[name='location']");
    this.formEl = this.shadowRoot.querySelector(".edit-profile__form");
    this.errorEl = this.shadowRoot.querySelector(".edit-profile__error");
    this.notifyEl = this.shadowRoot.querySelector(".edit-profile__notify");
  }

  async render() {
    const currentState = state.getState();
    const { fullname, location } = currentState;

    if (fullname === "" || location === "") {
      const data = await state.getProfile();

      this.fullnameEl.value = data.fullname;
      this.locationEl.value = data.location;
    } else {
      this.fullnameEl.value = fullname;
      this.locationEl.value = location;
    }
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    this.errorEl.style.display = "none";
    this.notifyEl.style.display = "none";

    const formData = new FormData(event.target as HTMLFormElement);
    const fullname = formData.get("fullname") as string;
    const location = formData.get("location") as string;

    try {
      const data = await state.updateProfile({ fullname, location });
      showNotification(this.notifyEl, data.message);
    } catch (error) {
      showError(this.errorEl, error.message);
    }
  }
}

customElements.define("edit-profile-page", EditProfilePage);
