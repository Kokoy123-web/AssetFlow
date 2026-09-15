import { state } from "./state.js";
import { $ } from "../utils/dom.js";
import { showToast } from "../utils/toast.js";
import {
  signIn,
  signUp,
  signOut,
  getSession,
  loadCurrentProfile,
} from "../services/auth.service.js";
import { addEquipment, setMaintenance } from "../services/equipment.service.js";
import {
  createBorrowingRequest,
  processBorrowingAction,
} from "../services/borrowing.service.js";
import { updateUserRole } from "../services/admin.service.js";
import { renderPage } from "./router.js";
import {
  renderNavigation,
  renderUserChrome,
  showAppShell,
  showAuthShell,
  setAuthMode,
} from "../components/layout.js";
async function safeRender() {
  try {
    await renderPage();
  } catch (error) {
    console.error(error);
    showToast(error.message || "Unable to load data.", true);
  }
}
async function boot() {
  const {
    data: { session },
  } = await getSession();
  if (!session) {
    showAuthShell();
    return;
  }
  state.user = session.user;
  const profile = await loadCurrentProfile(session.user.id);
  if (profile.error) {
    showToast("Profile not found. Run the SQL setup first.", true);
    return;
  }
  showAppShell();
  renderUserChrome();
  renderNavigation();
  await safeRender();
}
async function submitAuth(event) {
  event.preventDefault();
  const mode = $("#authForm").dataset.mode || "login",
    email = $("#email").value.trim(),
    password = $("#password").value,
    fullName = $("#fullName").value.trim();
  const result =
    mode === "signup"
      ? await signUp(email, password, fullName)
      : await signIn(email, password);
  if (result.error) {
    showToast(result.error.message, true);
    return;
  }
  if (mode === "signup") {
    if (result.data?.session) await boot();
    else showToast("Account created. Disable email confirmation in Supabase Auth settings.");
  } else await boot();
}
async function handleAction(action, id) {
  if (action === "goto") {
    state.page = id;
    await safeRender();
    return;
  }
  if (action === "new-equipment") {
    $("#equipmentModal").classList.remove("hidden");
    $("#equipmentName").focus();
    return;
  }
  if (action === "request-equipment") {
    state.page = "requests";
    await safeRender();
    const select = $("#requestEquipment");
    if (select) {
      select.value = id;
      $("#purpose")?.focus();
    }
    return;
  }
  if (action === "maintenance") {
    const { error } = await setMaintenance(id);
    if (error) showToast(error.message, true);
    else {
      showToast(state.profile?.role === "staff" ? "Maintenance request submitted." : "Equipment moved to Maintenance.");
      await safeRender();
    }
    return;
  }
  if (!["approve", "reject", "release", "return"].includes(action)) return;
  const { data, error } = await processBorrowingAction(id, action);
  if (error) showToast(error.message, true);
  else {
    showToast(data?.message || "Action completed.");
    await safeRender();
  }
}
function bindEvents() {
  $("#authForm").addEventListener("submit", submitAuth);
  $("#equipmentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const { error } = await addEquipment({
      name: $("#equipmentName").value.trim(),
      asset_code: $("#equipmentCode").value.trim(),
      category: $("#equipmentCategory").value.trim() || null,
      location: $("#equipmentLocation").value.trim() || null,
      status: "Available",
    });
    if (error) {
      showToast(error.message, true);
      return;
    }
    $("#equipmentForm").reset();
    $("#equipmentModal").classList.add("hidden");
    showToast("Equipment added.");
    await safeRender();
  });
  const closeEquipmentModal = () => {
    $("#equipmentForm").reset();
    $("#equipmentModal").classList.add("hidden");
  };
  $("#closeEquipmentModal").addEventListener("click", closeEquipmentModal);
  $("#cancelEquipmentModal").addEventListener("click", closeEquipmentModal);
  $("#equipmentModal").addEventListener("click", (event) => {
    if (event.target.id === "equipmentModal") closeEquipmentModal();
  });
  document.addEventListener("click", async (event) => {
    const nav = event.target.closest(".nav-btn");
    if (nav) {
      state.page = nav.dataset.page;
      await safeRender();
      return;
    }
    const tab = event.target.closest("[data-auth]");
    if (tab) {
      setAuthMode(tab.dataset.auth);
      return;
    }
    if (event.target.id === "logoutBtn") {
      const { error } = await signOut();
      if (error) {
        showToast(error.message, true);
        return;
      }
      state.user = null;
      state.profile = null;
      state.page = "dashboard";
      showAuthShell();
      $("#authForm").reset();
      setAuthMode("login");
      return;
    }
    if (event.target.id === "refreshBtn") {
      await safeRender();
      return;
    }
    const action = event.target.closest("[data-action]");
    if (action) await handleAction(action.dataset.action, action.dataset.id);
  });
  $("#content").addEventListener("submit", async (event) => {
    if (event.target.id !== "requestForm") return;
    event.preventDefault();
    const { error } = await createBorrowingRequest({
      equipment_id: $("#requestEquipment").value,
      purpose: $("#purpose").value.trim(),
      due_date: $("#dueDate").value,
      notes: $("#notes").value.trim(),
      requester_id: state.user.id,
    });
    if (error) showToast(error.message, true);
    else {
      showToast("Request submitted as Pending.");
      await safeRender();
    }
  });
  $("#content").addEventListener("change", async (event) => {
    const select = event.target.closest("[data-role-user]");
    if (!select) return;
    const { error } = await updateUserRole(
      select.dataset.roleUser,
      select.value,
    );
    if (error) showToast(error.message, true);
    else {
      showToast("Role updated.");
      await safeRender();
    }
  });
}
bindEvents();
boot();
