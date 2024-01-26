import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Router } from "@vaadin/router";
import mapboxgl from "mapbox-gl";

import { showError } from "..";
import { state } from "../state";

class NewReportPage extends HTMLElement {
  private geocoderCoordinates: number[] = [];
  private inputFileEl: HTMLInputElement;
  private thumbnailEl: HTMLImageElement;
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private geocoderInputEl: HTMLInputElement;
  private buttonEl: HTMLButtonElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="new-report">
        <custom-text type="title" class="new-report__title">Reportar mascota</custom-text>
        <custom-text type="text" class="new-report__info">Ingresá la siguiente información para realizar el reporte de la mascota</custom-text>
        <custom-text class="new-report__error" type="text"></custom-text>
        <form class="new-report__form">
          <label class="new-report__label" for="name">
            NOMBRE
            <input class="new-report__input" id="name" name="name" autocomplete="name" required />
          </label>
          <img class="new-report__thumbnail" src="${require("url:../assets/images/thumbnail.svg")}"/>
          <label class="new-report__add" for="thumbnail">
            Agregar foto
            <input class="new-report__file" type="file" id="thumbnail" name="thumbnail" accept="image/*" required />
          </label>
          <div id="map" class="new-report__map"></div>
          <custom-text class="new-report__text" type="text">Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.</custom-text>
          <p class="new-report__location">UBICACIÓN</p>
          <div id="geocoder" class="new-report__geocoder"></div>
          <custom-button class="new-report__button new-report__button--report" color="green" type="submit">Reportar mascota</custom-button>
        </form>
        <custom-button class="new-report__button new-report__button--cancel" color="black">Cancelar</custom-button>
      </div>
      <style>
        @import url("https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css");
        @import url("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css");
        
        .new-report {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
        
        .new-report__title {
          width: 301px;
          height: 90px;
          margin-top: 50px;
          margin-bottom: 22px;
        }
        
        .new-report__info {
          width: 266px;
          height: 45px;
          margin-bottom: 97px;
        }
        
        .new-report__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
        
        .new-report__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .new-report__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
    
        .new-report__input {
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
        
        .new-report__thumbnail {
          width: 335px;
          height: 180px;
          margin: 25px 0px;
          border-radius: 10px;
        }
        
        .new-report__add {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 335px;
          height: 50px;
          margin-bottom: 50.99px;
          border: none;
          border-radius: 4px;
          background-color: #5a8fec;
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          line-height: 19px;
          font-family: "Roboto";
          text-transform: unset;
          cursor: pointer;
          filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.25));
        }
    
        .new-report__file {
          position: absolute;
          width: 335px;
          height: 50px;
          opacity: 0;
        }
        
        .new-report__button {
          width: 335px;
        }
        
        .new-report__button--photo {
          margin-bottom: 51px;
        }
        
        .new-report__button--report {
          margin-bottom: 25px;
        }
        
        .new-report__button--cancel {
          margin-bottom: 79px;
        }
        
        .new-report__map {
          width: 334.965px;
          height: 253px;
          margin-bottom: 25px;
          border-radius: 10px;
        }
        
        .new-report__text {
          width: 285px;
          margin: 0 auto;
        }
        
        .new-report__location {
          width: 335px;
          margin-top: 25px;
          margin-bottom: 0px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
        
        .new-report__geocoder {
          width: 335px;
          height: 50px;
          margin-bottom: 50px;
        }

        .mapboxgl-ctrl-geocoder--input {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
        
        .mapboxgl-ctrl-geocoder--input:focus {
          outline: auto !important;
        }
        
        .mapboxgl-ctrl-geocoder--input::placeholder {
          color: transparent !important;
        }
        
        @media screen and (min-width: 640px) {
          .mapboxgl-ctrl-geocoder.mapboxgl-ctrl-geocoder--collapsed {
            width: 50px !important;
            min-width: 50px !important;
          }
        
          .mapboxgl-ctrl-geocoder {
            width: 100% !important;
            max-width: unset !important;
            font-size: 18px !important;
            line-height: 24px !important;
          }
        
          .mapboxgl-ctrl-geocoder .suggestions {
            font-size: 15px !important;
          }
        
          .mapboxgl-ctrl-geocoder--icon-close {
            width: 20px !important;
            height: 20px !important;
            margin-top: 8px !important;
            margin-right: 3px !important;
          }
        
          .mapboxgl-ctrl-geocoder--icon-geolocate {
            width: 22px !important;
            height: 22px !important;
            margin-top: 6px !important;
            margin-right: 3px !important;
          }
        
          .mapboxgl-ctrl-geocoder--icon-search {
            position: absolute !important;
            top: 13px !important;
            left: 12px !important;
            width: 23px !important;
            height: 23px !important;
          }
        
          .mapboxgl-ctrl-geocoder--input {
            height: 50px !important;
            padding: 6px 45px !important;
          }
        
          .mapboxgl-ctrl-geocoder--icon-loading {
            width: 26px !important;
            height: 26px !important;
            margin-top: 5px !important;
            margin-right: 0px !important;
          }
        
          .mapbox-gl-geocoder--error {
            padding: unset !important;
            color: unset !important;
            font-size: unset !important;
            text-align: unset !important;
          }
        
          .mapboxgl-ctrl-geocoder--powered-by {
            font-size: 13px !important;
          }
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
    this.shadowRoot.appendChild(NewReportPage.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.setupMapbox();
    this.initElements();
    this.render();
    this.addEventListeners();
  }

  setupMapbox() {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: this.shadowRoot.getElementById("map"),
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 9,
      attributionControl: false,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    geocoder.on("result", (event) => {
      this.geocoderCoordinates = event.result.geometry.coordinates;
    });

    this.shadowRoot.getElementById("geocoder").appendChild(geocoder.onAdd(map));
  }

  initElements() {
    this.inputFileEl = this.shadowRoot.querySelector(".new-report__file");
    this.thumbnailEl = this.shadowRoot.querySelector(".new-report__thumbnail");
    this.formEl = this.shadowRoot.querySelector(".new-report__form");
    this.errorEl = this.shadowRoot.querySelector(".new-report__error");
    this.geocoderInputEl = this.shadowRoot.querySelector(
      ".mapboxgl-ctrl-geocoder--input",
    );
    this.buttonEl = this.shadowRoot.querySelector(
      ".new-report__button--cancel",
    );
  }

  render() {
    this.geocoderInputEl.setAttribute("required", "required");
  }

  addEventListeners() {
    this.inputFileEl.addEventListener("change", this.setThumbnail.bind(this));
    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
    this.buttonEl.addEventListener("click", () => Router.go("/reports"));
  }

  setThumbnail(event: { target: { files: string | any[] } }) {
    if (event.target.files.length > 0) {
      const thumbnail = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        this.thumbnailEl.src = event.target.result.toString();
      };

      reader.readAsDataURL(thumbnail);
    }
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    this.errorEl.style.display = "none";

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const location = this.geocoderInputEl.value;
    const longitude = this.geocoderCoordinates[0];
    const latitude = this.geocoderCoordinates[1];
    const dataURL = this.thumbnailEl.src;

    try {
      await state.newLostPet({
        name,
        dataURL,
        location,
        longitude,
        latitude,
      });

      Router.go("/reports");
    } catch (error) {
      showError(this.errorEl, error.message);
    }
  }
}

customElements.define("new-report-page", NewReportPage);
