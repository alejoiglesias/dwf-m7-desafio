import "./components/button";
import "./components/card";
import "./components/header";
import "./components/report";
import "./components/text";
import "./pages/auth";
import "./pages/change-password";
import "./pages/edit-profile";
import "./pages/edit-report";
import "./pages/forgot-password";
import "./pages/home";
import "./pages/new-report";
import "./pages/pets";
import "./pages/profile";
import "./pages/reports";
import "./pages/reset-password";
import "./pages/sign-in";
import "./pages/sign-up";
import "./router";
import { state } from "./state";

(function main() {
  window.addEventListener("beforeunload", () => {
    const currentState = state;
    state.saveState(currentState.getState());
  });
})();

export function showNotification(notifyEl: HTMLElement, message: string) {
  notifyEl.shadowRoot.querySelector("p").textContent = message;
  notifyEl.style.display = "unset";
}

export function showError(errorEl: HTMLElement, message: string) {
  errorEl.shadowRoot.querySelector("p").textContent = message;
  errorEl.style.display = "unset";
}
