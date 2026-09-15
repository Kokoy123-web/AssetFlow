import { state } from "../core/state.js";
import { escapeHtml } from "../utils/dom.js";
export function borrowingRequestForm() {
  const available = state.data.equipment.filter(
    (e) => e.status === "Available",
  );
  return `<form id="requestForm" class="form-grid"><label>Equipment<select id="requestEquipment" required>${available.map((e) => `<option value="${e.id}">${escapeHtml(e.asset_code)} — ${escapeHtml(e.name)}</option>`).join("")}</select></label><label>Purpose<input id="purpose" required placeholder="Class / laboratory activity"></label><label>Return date<input id="dueDate" type="date" required></label><label class="wide">Notes<textarea id="notes" rows="2" placeholder="Optional details"></textarea></label><div class="wide"><button class="primary" type="submit">Submit for approval ↗</button></div></form>`;
}
