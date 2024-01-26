import { state } from "../state";

class CustomReport extends HTMLElement {
  private reportEl: HTMLElement;
  private closeEl: HTMLElement;
  private titleEl: CustomText;
  private formEl: HTMLFormElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="report">
        <div class="report__container">
          <img class="report__close" src="${require("url:../assets/icons/close.svg")}"/>
          <custom-text class="report__title" type="title"></custom-text>
          <form class="report__form">
            <label class="report__label" for="name">NOMBRE</label>
            <input class="report__input" type="text" id="name" name="name" autocomplete="name" required>
            <label class="report__label" for="phone">TELÉFONO</label>
            <input class="report__input" type="tel" id="phone" name="phone" autocomplete="tel" required>
            <label class="report__label" for="message">¿DÓNDE LO VISTE?</label>
            <textarea class="report__input report__input--text" id="message" name="message" required></textarea>
            <custom-button class="report__button" color="green" type="submit">Enviar información</custom-button>
          </form>
        </div>
      </div>
      <style>
        .report {
          display: none;
          z-index: 10;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(2.5px);
          background: rgba(230, 244, 241, 0.05);
        }
  
        .report__container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 314px;
          height: 631px;
          border-radius: 10px;
          background-color: #26302e;
        }
  
        .report__close {
          margin-top: 14px;
          margin-right: 14px;
          margin-left: 284px;
          cursor: pointer;
        }
  
        .report__title {
          width: 273px;
          margin-bottom: 7px;
          color: #fff;
        }
  
        .report__form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
  
        .report__label {
          width: 275px;
          color: #fff;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
        
        .report__input {
          box-sizing: border-box;
          width: 275px;
          height: 50px;
          margin-bottom: 25px;
          padding: 5px;
          border: none;
          border-radius: 4px;
          background: #4a5553;
          box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
          color: #fff;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .report__input--text {
          width: 277px;
          height: 155px;
        }
  
        .report__button {
          width: 276px;
          margin-bottom: 28px;
        }
      </style>`;
    return template;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(CustomReport.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.initElements();
    this.addEventListener();
    state.subscribe(this.updateTitle.bind(this));
  }

  initElements() {
    this.reportEl = this.shadowRoot.querySelector(".report");
    this.closeEl = this.shadowRoot.querySelector(".report__close");
    this.titleEl = this.shadowRoot.querySelector(".report__title");
    this.formEl = this.shadowRoot.querySelector(".report__form");
  }

  addEventListener() {
    this.closeEl.addEventListener("click", () => this.closeMenu());
    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
  }

  closeMenu() {
    this.reportEl.style.display = "none";
  }

  updateTitle() {
    const currentState = state.getState();
    if (currentState.pet && currentState.pet.name) {
      this.titleEl.updateContent(`Reportar info de ${currentState.pet.name}`);
    }
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const currentState = state.getState();
    const userId = currentState.pet.userId;

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    try {
      await state.sendReport({
        name,
        phone,
        message,
        userId,
      });

      this.closeMenu();
    } catch (error) {}
  }
}

customElements.define("custom-report", CustomReport);
