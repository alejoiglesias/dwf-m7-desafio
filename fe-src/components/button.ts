class CustomButton extends HTMLElement {
  private observer: MutationObserver;
  private buttonEl: HTMLButtonElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <button class="button"></button>
      <style>
        .button {
          display: block;
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 4px;
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          line-height: 19px;
          font-family: "Roboto";
          text-align: center;
          cursor: pointer;
          filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.25));
        }
  
        .button--blue {
          background-color: #5a8fec;
        }
  
        .button--green {
          background-color: #00a884;
        }
  
        .button--red {
          background-color: #eb6372;
        }
  
        .button--black {
          background-color: #4a5553;
        }
      </style>
    `;
    return template;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(CustomButton.template.content.cloneNode(true));

    this.buttonEl = this.shadowRoot.querySelector(".button");
    this.shadowRoot.addEventListener("click", this.handleClick.bind(this));

    this.observer = new MutationObserver(this.updateTextContent.bind(this));
  }

  connectedCallback() {
    this.observer.observe(this, { childList: true, subtree: true });

    this.render();
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  updateTextContent(mutationsList: MutationRecord[]) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (this.buttonEl) {
          this.buttonEl.textContent = this.textContent.trim();
        }
      }
    }
  }

  render() {
    const buttonColor = this.getAttribute("color") || "blue";
    this.buttonEl.classList.add(`button--${buttonColor}`);

    this.buttonEl.textContent = this.textContent.trim();
  }

  handleClick() {
    const buttonType = this.getAttribute("type");

    if (buttonType === "submit") {
      const formEl = this.closest("form");

      if (formEl) {
        const fakeSubmit = document.createElement("button");
        fakeSubmit.type = "submit";
        fakeSubmit.style.display = "none";

        formEl.appendChild(fakeSubmit);

        fakeSubmit.click();
        fakeSubmit.remove();
      }
    }
  }
}

customElements.define("custom-button", CustomButton);
