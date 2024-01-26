import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Router } from "@vaadin/router";
import mapboxgl from "mapbox-gl";

import { showError } from "..";
import { state } from "../state";

class EditReportPage extends HTMLElement {
  private geocoderCoordinates: number[] = [];
  private petId: number;
  private petStatus: string;
  private thumbnailEl: HTMLImageElement;
  private inputEl: HTMLInputElement;
  private inputFileEl: HTMLInputElement;
  private formEl: HTMLFormElement;
  private errorEl: HTMLElement;
  private geocoderInputEl: HTMLInputElement;
  private buttonStatusEl: HTMLButtonElement;
  private buttonDeleteEl: HTMLButtonElement;

  static get template() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="edit-report">
        <custom-text type="title" class="edit-report__title">Editar reporte de mascota</custom-text>
        <custom-text class="edit-report__error" type="text"></custom-text>
        <form class="edit-report__form">
          <label class="edit-report__label" for="name">
            NOMBRE
            <input class="edit-report__input" id="name" name="name" autocomplete="name" required />
          </label>
          <img class="edit-report__thumbnail"/>
          <label class="edit-report__edit" for="thumbnail">
            Modificar foto
            <input class="edit-report__file" type="file" id="thumbnail" name="thumbnail" accept="image/*" />
          </label>
          <div id="map" class="edit-report__map"></div>
          <custom-text class="edit-report__text" type="text">Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.</custom-text>
          <p class="edit-report__location">UBICACIÓN</p>
          <div id="geocoder" class="edit-report__geocoder"></div>
          <custom-button class="edit-report__button" type="submit">Guardar</custom-button>
        </form>
        <custom-button class="edit-report__button edit-report__button--status" color="green">Reportar como encontrado</custom-button>
        <custom-button class="edit-report__button edit-report__button--delete" color="red">Eliminar reporte</custom-button>
      </div>
  
      <style>
        @import url("https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css");
        @import url("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css");
  
        .edit-report {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          overflow-y: auto;
          background: linear-gradient(191.08deg, #ffffff 8.17%, #def4f0 62.61%);
        }
  
        .edit-report__title {
          width: 301px;
          height: 90px;
          margin-top: 50px;
          margin-bottom: 88px;
        }
  
        .edit-report__error {
          display: none;
          width: 335px;
          margin-bottom: 30px;
          color: #eb6372;
        }
  
        .edit-report__form {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
  
        .edit-report__label {
          width: 335px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .edit-report__input {
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
  
        .edit-report__thumbnail {
          width: 335px;
          height: 180px;
          margin: 25px 0px;
          border-radius: 10px;
        }
  
        .edit-report__edit {
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
  
        .edit-report__file {
          position: absolute;
          width: 335px;
          height: 50px;
          opacity: 0;
        }
  
        .edit-report__thumbnail {
          width: 335px;
          height: 180px;
          margin-bottom: 25px;
          border-radius: 10px;
        }
  
        .edit-report__button {
          width: 335px;
          margin-bottom: 25px;
        }
  
        .edit-report__button--delete {
          margin-bottom: 80px;
        }
  
        .edit-report__map {
          width: 334.965px;
          height: 253px;
          margin-bottom: 25px;
          border-radius: 10px;
        }
  
        .edit-report__text {
          width: 285px;
          margin: 0 auto;
        }
  
        .edit-report__location {
          width: 335px;
          margin-top: 25px;
          margin-bottom: 0px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-family: "Poppins";
          text-transform: uppercase;
        }
  
        .edit-report__geocoder {
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
    const currentState = state.getState();

    if (!currentState.pet.id) {
      Router.go("/reports");
    }
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      EditReportPage.template.content.cloneNode(true),
    );
  }

  connectedCallback() {
    this.setupMapbox();
    this.initElements();
    this.render();
    this.addEventListeners();
  }

  setupMapbox() {
    const currentState = state.getState();
    const { last_location_lng, last_location_lat } = currentState.pet;

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: this.shadowRoot.getElementById("map"),
      style: "mapbox://styles/mapbox/streets-v12",
      center: [last_location_lng, last_location_lat],
      zoom: 9,
      attributionControl: false,
    });

    new mapboxgl.Marker()
      .setLngLat([last_location_lng, last_location_lat])
      .addTo(map);

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
    this.thumbnailEl = this.shadowRoot.querySelector(".edit-report__thumbnail");
    this.inputEl = this.shadowRoot.querySelector(".edit-report__input");
    this.inputFileEl = this.shadowRoot.querySelector(".edit-report__file");
    this.formEl = this.shadowRoot.querySelector(".edit-report__form");
    this.errorEl = this.shadowRoot.querySelector(".edit-report__error");
    this.geocoderInputEl = this.shadowRoot.querySelector(
      ".mapboxgl-ctrl-geocoder--input",
    );
    this.buttonStatusEl = this.shadowRoot.querySelector(
      ".edit-report__button--status",
    );
    this.buttonDeleteEl = this.shadowRoot.querySelector(
      ".edit-report__button--delete",
    );
  }

  async render() {
    const currentState = state.getState();
    const { id, name, photo_url, last_location, status } = currentState.pet;

    this.geocoderInputEl.setAttribute("required", "required");

    if (status === "found") {
      this.buttonStatusEl.textContent = "Reportar como perdido";
    }

    this.petId = id;
    this.petStatus = status;
    this.geocoderInputEl.value = last_location;
    this.inputEl.value = name;
    this.thumbnailEl.src = photo_url;
  }

  addEventListeners() {
    this.inputFileEl.addEventListener("change", this.setThumbnail.bind(this));
    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
    this.buttonStatusEl.addEventListener("click", () => this.updatePetStatus());
    this.buttonDeleteEl.addEventListener("click", () => this.deletePet());
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

  handlePetUpdate() {
    const currentState = state.getState();
    currentState.pet = {};
    state.setState(currentState);

    Router.go("/reports");
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
      await state.updateLostPet({
        name,
        dataURL,
        location,
        longitude,
        latitude,
        petId: this.petId,
      });

      this.handlePetUpdate();
    } catch (error) {
      showError(this.errorEl, error.message);
    }
  }

  async updatePetStatus() {
    if (this.petStatus === "lost") {
      await state.updatePetStatus({ status: "found", petId: this.petId });
      this.handlePetUpdate();
    } else {
      await state.updatePetStatus({ status: "lost", petId: this.petId });
      this.handlePetUpdate();
    }
  }

  async deletePet() {
    await state.deletePet(this.petId);
    this.handlePetUpdate();
  }
}

customElements.define("edit-report-page", EditReportPage);
