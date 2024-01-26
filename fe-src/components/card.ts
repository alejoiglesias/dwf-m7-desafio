class CustomCard extends HTMLElement {
  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 335px;
          height: 234px;
          border-radius: 10px;
          background: #26302e;
          box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
        }

        .card__img {
          width: 320px;
          height: 136px;
          border-radius: 3px;
          background: lightgray 50% / cover no-repeat;
        }

        .card__container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
        }

        .card__info {
          display: flex;
          row-gap: 10px;
          flex-direction: column;
        }

        .card__name {
          display: flex;
          width: 162px;
          height: 49px;
          overflow: hidden;
          color: #fff;
          white-space: nowrap;
        }

        .card__location {
          width: 151px;
          height: 25px;
          overflow: hidden;
          color: #fff;
          white-space: nowrap;
        }

        .card__button {
          display: flex;
          column-gap: 5px;
          align-items: center;
          justify-content: center;
          height: 40px;
          border: none;
          border-radius: 4px;
          color: #ffffff;
          font-weight: 400;
          font-size: 16px;
          font-family: "Roboto";
          cursor: pointer;
          filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.25));
        }

        .card__button--edit {
          display: none;
          width: 100px;
          background-color: #5a8fec;
        }

        .card__button--report {
          display: none;
          width: 120px;
          background-color: #eb6372;
        }

        .card__edit {
          width: 20.333px;
          height: 19.52px;
        }

        .card__siren {
          width: 24px;
          height: 20px;
        }
      </style>
      <div class="card">
        <img class="card__img" />
        <div class="card__container">
          <div class="card__info">
            <custom-text class="card__name" type="title"></custom-text>
            <custom-text class="card__location" type="location"></custom-text>
          </div>
          <button class="card__button card__button--edit">Editar <img class="card__edit" src="${require("url:../assets/icons/edit.svg")}" /></button>
          <button class="card__button card__button--report">Reportar <img class="card__siren" src="${require("url:../assets/icons/siren.svg")}" /></button>
        </div>
      </div>
    `;
    return template;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(CustomCard.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {}

  addEventListeners() {}
}

customElements.define("custom-card", CustomCard);
