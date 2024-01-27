import "dotenv/config";

export const state = {
  data: {
    email: "",
    fullname: "",
    location: "",
    longitude: 0,
    latitude: 0,
    pet: {},
  },
  listeners: [],

  loadState() {
    const state = localStorage.getItem("state");
    return state ? JSON.parse(state) : { ...this.data };
  },

  saveState(state: any) {
    localStorage.setItem("state", JSON.stringify(state));
  },

  getState() {
    return this.loadState();
  },

  setState(newState: any) {
    this.data = { ...newState };
    this.saveState(newState);

    for (const cb of this.listeners) {
      cb();
    }
  },

  subscribe(callback: () => any) {
    this.listeners.push(callback);
  },

  dispatchTokenChangeEvent() {
    const event = new CustomEvent("token-change");
    document.dispatchEvent(event);
  },

  async setLngLat({ longitude, latitude }) {
    const currentState = this.getState();
    currentState.longitude = longitude;
    currentState.latitude = latitude;
    this.setState(currentState);
  },

  async signUp({ email, password }) {
    const response = await fetch(`${process.env.BASE_URL}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    if (data.token) {
      const currentState = this.getState();
      currentState.email = email;
      this.setState(currentState);

      const { token } = data;
      localStorage.setItem("token", token);

      this.dispatchTokenChangeEvent();
    }

    return data;
  },

  async signIn({ email, password }) {
    const response = await fetch(`${process.env.BASE_URL}/api/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    const currentState = this.getState();
    currentState.email = email;
    this.setState(currentState);

    const { token } = data;
    localStorage.setItem("token", token);

    this.dispatchTokenChangeEvent();
  },

  async sendRecoveryPasswordEmail(email: string) {
    const response = await fetch(`${process.env.BASE_URL}/api/auth/recovery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  },

  async resetPassword(password: string) {
    const response = await fetch(
      `${process.env.BASE_URL}/api/auth/password/${window.location.search}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  },

  async getProfile() {
    const response = await fetch(`${process.env.BASE_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  },

  async updateProfile({ fullname, location }) {
    const response = await fetch(`${process.env.BASE_URL}/api/users/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ fullname, location }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    const currentState = this.getState();
    currentState.fullname = fullname;
    currentState.location = location;
    this.setState(currentState);

    return data;
  },

  async changePassword(password: string) {
    const response = await fetch(
      `${process.env.BASE_URL}/api/users/me/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ password }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  },

  async getLostPets() {
    const response = await fetch(`${process.env.BASE_URL}/api/pets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  },

  async getLostPetsAroundMe({ latitude, longitude }) {
    const response = await fetch(
      `${process.env.BASE_URL}/api/pets/around?lat=${latitude}&lng=${longitude}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  },

  async getUserPets() {
    const response = await fetch(`${process.env.BASE_URL}/api/users/me/pets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  },

  async newLostPet({ name, location, longitude, latitude, dataURL }) {
    const response = await fetch(`${process.env.BASE_URL}/api/users/me/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name,
        dataURL,
        location,
        longitude,
        latitude,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
  },

  async updateLostPet({ name, location, longitude, latitude, dataURL, petId }) {
    const response = await fetch(
      `${process.env.BASE_URL}/api/users/me/pets/${petId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name,
          dataURL,
          location,
          longitude,
          latitude,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
  },

  async updatePetStatus({ status, petId }) {
    const response = await fetch(
      `${process.env.BASE_URL}/api/users/me/pets/${petId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ status }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
  },

  async deletePet(petId: number) {
    const response = await fetch(
      `${process.env.BASE_URL}/api/users/me/pets/${petId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
  },

  async sendReport({ name, phone, message, petName, userId }) {
    const response = await fetch(`${process.env.BASE_URL}/api/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, message, petName, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
  },
};
