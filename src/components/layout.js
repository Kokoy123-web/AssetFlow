import { state, role, can } from "../core/state.js";
import { $, $$ } from "../utils/dom.js";
const pageTitles = {
  dashboard: "Dashboard",
  equipment: "Equipment",
  requests: "Borrowing Requests",
  history: "My History",
  users: "Users",
  audit: "Audit Trail",
  reports: "Reports",
  maintenance: "Maintenance",
};
export function renderNavigation() {
  const items = can("admin")
    ? [
        ["dashboard", "Overview"],
        ["equipment", "Equipment"],
        ["requests", "Requests"],
        ["maintenance", "Maintenance"],
        ["reports", "Reports"],
        ["users", "Users"],
        ["audit", "Audit Log"],
      ]
    : can("staff")
      ? [
          ["dashboard", "Overview"],
          ["equipment", "Equipment"],
          ["requests", "Requests"],
          ["maintenance", "Maintenance"],
          ["history", "My History"],
        ]
      : [
          ["dashboard", "Overview"],
          ["equipment", "Available Equipment"],
          ["requests", "My Requests"],
          ["history", "My History"],
        ];
  $("#nav").innerHTML = items
    .map(
      ([id, label]) =>
        `<button class="nav-btn ${state.page === id ? "active" : ""}" data-page="${id}">${label}</button>`,
    )
    .join("");
  $("#pageKicker").textContent = `${role().toUpperCase()} WORKSPACE`;
  $("#pageTitle").textContent = pageTitles[state.page] || "Workspace";
}
export function renderUserChrome() {
  const fullName = state.profile?.full_name || "User";
  $("#userName").textContent = fullName;
  $("#userEmail").textContent = state.user?.email || "";
  $("#avatar").textContent = fullName.charAt(0).toUpperCase();
  $("#roleBadge").textContent = role().toUpperCase();
}
export function showAppShell() {
  $("#authView").classList.add("hidden");
  $("#appView").classList.remove("hidden");
}
export function showAuthShell() {
  $("#authView").classList.remove("hidden");
  $("#appView").classList.add("hidden");
}
export function setAuthMode(mode) {
  const signup = mode === "signup";
  $$(".auth-tabs button").forEach((b) => b.classList.remove("active"));
  $(`.auth-tabs button[data-auth="${mode}"]`).classList.add("active");
  $("#nameWrap").classList.toggle("hidden", !signup);
  $("#authSubmit").textContent = signup
    ? "Create account ↗"
    : "Enter workspace ↗";
  $("#authForm").dataset.mode = mode;
}
