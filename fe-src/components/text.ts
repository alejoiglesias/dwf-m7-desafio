class CustomText extends HTMLElement {
  private observer: MutationObserver;
  private uppercaseEl: HTMLElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        * {
          margin: 0;
        }

        .title {
          font-weight: 700;
          font-size: 36px;
          line-height: 54px;
          font-family: "Poppins";
          text-align: center;
        }

        .subtitle {
          font-weight: 700;
          font-size: 24px;
          line-height: 36px;
          font-family: "Poppins";
          text-align: center;
        }

        .info {
          font-weight: 400;
          font-size: 24px;
          line-height: 36px;
          font-family: "Poppins";
          text-align: center;
        }

        .text {
          font-weight: 400;
          font-size: 16px;
          line-height: 19px;
          font-family: "Roboto";
          text-align: center;
        }

        .location {
          font-weight: 700;
          font-size: 16px;
          line-height: 19px;
          font-family: "Roboto";
        }

        .uppercase {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-align: center;
          text-transform: uppercase;
        }

        .link {
          color: #3b97d3;
          font-weight: 500;
          font-size: 16px;
          line-height: 19px;
          font-family: "Roboto";
          text-decoration-line: underline;
          text-transform: uppercase;
        }
      </style>
    `;
    return template;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(CustomText.template.content.cloneNode(true));

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
    this.uppercaseEl = this.shadowRoot.querySelector(".uppercase");

    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (this.uppercaseEl) {
          this.uppercaseEl.textContent = this.textContent.trim();
        }
      }
    }
  }

  updateContent(newContent: string) {
    const type = this.getAttribute("type");
    const textEl = this.shadowRoot.querySelector(`.${type}`);

    if (textEl) {
      textEl.textContent = newContent;
    }
  }

  render() {
    const options = {
      title: { tag: "h1", class: "title" },
      subtitle: { tag: "h2", class: "subtitle" },
      info: { tag: "h3", class: "info" },
      text: { tag: "p", class: "text" },
      location: { tag: "p", class: "location" },
      uppercase: { tag: "p", class: "uppercase" },
      link: { tag: "a", class: "link" },
    };

    const type = options[this.getAttribute("type")];
    const textEl = document.createElement(type.tag || "p");

    if (type.class) {
      textEl.classList.add(type.class);
    }

    if (this.hasAttribute("href")) {
      textEl.href = this.getAttribute("href");
    }

    textEl.textContent = this.textContent.trim();

    this.shadowRoot.append(textEl);
  }
}

customElements.define("custom-text", CustomText);
