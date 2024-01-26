import { Router } from "@vaadin/router";

import { state } from "../state";

class CustomHeader extends HTMLElement {
  private logoEl: HTMLImageElement;
  private burgerEl: HTMLImageElement;
  private menuEl: HTMLElement;
  private closeEl: HTMLImageElement;
  private logoutEl: HTMLElement;
  private menuSections: NodeListOf<HTMLElement>;
  private footerEl: HTMLElement;
  private emailEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <header class="header">
        <img class="header__logo" src="${require("url:../assets/images/logo.svg")}"/>
        <img class="header__burger" src="${require("url:../assets/icons/burger.svg")}"/>
        <div class="menu">
          <img class="menu__close" src="${require("url:../assets/icons/close.svg")}"/>
          <div class="menu__container">
            <custom-text class="menu__section" type="subtitle" data-route="/profile">Mis datos</custom-text>
            <custom-text class="menu__section" type="subtitle" data-route="/reports">Mis mascotas reportadas</custom-text>
            <custom-text class="menu__section" type="subtitle" data-route="/new-report">Reportar mascota</custom-text>
            <div class="menu__footer">
              <custom-text class="menu__email" type="uppercase"></custom-text>
              <custom-text class="menu__logout" type="link">CERRAR SESIÓN</custom-text>
            </div>
          </div>
        </div>
      </header>
      <style>
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0px 20px;
          border-radius: 0px 0px 10px 10px;
          background-color: #26302e;
        }
  
        .header__logo {
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
  
        .header__burger {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
  
        .menu {
          display: none;
          z-index: 10;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          min-width: 375px;
          border-radius: 0px 0px 10px 10px;
          background-color: #26302e;
        }
  
        .menu__close {
          position: absolute;
          top: 5%;
          right: 5%;
          cursor: pointer;
        }
  
        .menu__container {
          display: flex;
          row-gap: 80px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
  
        .menu__section {
          max-width: 280px;
          color: #eeeeee;
          cursor: pointer;
        }
  
        .menu__footer {
          display: none;
          row-gap: 17px;
          flex-direction: column;
          align-items: center;
        }
  
        .menu__email {
          width: 334px;
          height: 25px;
          color: #EEE;
        }
  
        .menu__logout {
          width: 120px;
          height: 33px;
          cursor: pointer;
        }
      </style>
    `;
    return template;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(CustomHeader.template.content.cloneNode(true));

    this.initElements();
    this.addEventListeners();
    this.updateEmail();
  }

  initElements() {
    this.logoEl = this.shadowRoot.querySelector(".header__logo");
    this.burgerEl = this.shadowRoot.querySelector(".header__burger");
    this.menuEl = this.shadowRoot.querySelector(".menu");
    this.closeEl = this.shadowRoot.querySelector(".menu__close");
    this.logoutEl = this.shadowRoot.querySelector(".menu__logout");
    this.menuSections = this.shadowRoot.querySelectorAll(".menu__section");
    this.footerEl = this.shadowRoot.querySelector(".menu__footer");
    this.emailEl = this.shadowRoot.querySelector(".menu__email");
  }

  addEventListeners() {
    document.addEventListener("token-change", () => this.updateEmail());

    this.logoEl.addEventListener("click", () => Router.go("/"));
    this.burgerEl.addEventListener("click", () => this.showMenu(true));
    this.closeEl.addEventListener("click", () => this.showMenu(false));
    this.logoutEl.addEventListener("click", () => this.handleLogout());

    this.menuSections.forEach((section) => {
      const route = section.getAttribute("data-route");
      section.addEventListener("click", () => this.handleRoute(route));
    });
  }

  showMenu(show: boolean) {
    this.menuEl.style.display = show ? "unset" : "none";
  }

  handleRoute(route: string) {
    const token = localStorage.getItem("token");
    if (token) {
      this.showMenu(false);
      Router.go(route);
    } else {
      this.showMenu(false);
      Router.go("/auth");
    }
  }

  handleLogout() {
    const currentState = state.getState();
    currentState.email = "";
    state.setState(currentState);

    localStorage.setItem("token", "");

    this.updateEmail();
    this.showMenu(false);

    Router.go("/");
  }

  updateEmail() {
    const currentState = state.getState();
    const email = currentState.email;

    const token = localStorage.getItem("token");

    this.footerEl.style.display = token ? "flex" : "none";
    this.emailEl.textContent = email;
  }
}

customElements.define("custom-header", CustomHeader);
