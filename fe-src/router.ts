import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/pets", component: "pets-page" },
  { path: "/auth", component: "auth-page" },
  { path: "/sign-up", component: "signup-page" },
  { path: "/sign-in", component: "signin-page" },
  { path: "/forgot-password", component: "forgot-password-page" },
  { path: "/reset-password", component: "reset-password-page" },
  { path: "/profile", component: "profile-page" },
  { path: "/edit-profile", component: "edit-profile-page" },
  { path: "/change-password", component: "change-password-page" },
  { path: "/reports", component: "reports-page" },
  { path: "/new-report", component: "new-report-page" },
  { path: "/edit-report", component: "edit-report-page" },
  { path: "(.*)", component: "home-page" },
]);
