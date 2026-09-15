import { state, role, can } from "../core/state.js";
import { escapeHtml, formatDate } from "../utils/dom.js";
export function equipmentTable(records) {
  if (!records.length)
    return `<div class="empty">No equipment records found.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Asset</th><th>Name</th><th>Category</th><th>Status</th><th>Location</th><th></th></tr></thead><tbody>${records.map((e) => `<tr><td><b>${escapeHtml(e.asset_code)}</b></td><td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.category || "—")}</td><td><span class="status ${escapeHtml(e.status)}">${escapeHtml(e.status)}</span></td><td>${escapeHtml(e.location || "—")}</td><td>${role() === "requester" && e.status === "Available" ? `<button class="small-btn" data-action="request-equipment" data-id="${e.id}">Request</button>` : can("admin","staff") && e.status !== "Maintenance" ? `<button class="small-btn danger" data-action="maintenance" data-id="${e.id}">${role() === "staff" ? "Submit maintenance" : "Maintenance"}</button>` : ""}</td></tr>`).join("")}</tbody></table></div>`;
}
function actionButtons(r) {
  if (role() === "admin" && r.status === "Pending")
    return `<div class="action-row"><button class="small-btn approve" data-action="approve" data-id="${r.id}">Approve</button><button class="small-btn reject" data-action="reject" data-id="${r.id}">Reject</button></div>`;
  if (role() === "staff" && r.status === "Approved")
    return `<button class="small-btn release" data-action="release" data-id="${r.id}">Release</button>`;
  if (can("admin", "staff") && r.status === "Released")
    return `<button class="small-btn return" data-action="return" data-id="${r.id}">Process return</button>`;
  return "—";
}
export function requestTable(records, showActions = false) {
  if (!records.length) return `<div class="empty">No requests found.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Asset</th><th>Requester</th><th>Purpose</th><th>Due</th><th>Status</th><th>Action</th></tr></thead><tbody>${records.map((r) => `<tr><td><b>${escapeHtml(r.equipment?.asset_code || "—")}</b><br><small>${escapeHtml(r.equipment?.name || "")}</small></td><td>${escapeHtml(r.requester?.full_name || "You")}</td><td>${escapeHtml(r.purpose)}</td><td>${escapeHtml(r.due_date)}</td><td><span class="status ${escapeHtml(r.status)}">${escapeHtml(r.status)}</span></td><td>${showActions ? actionButtons(r) : ""}</td></tr>`).join("")}</tbody></table></div>`;
}
export function auditList(records) {
  if (!records.length) return `<div class="empty">No audit entries yet.</div>`;
  return records
    .map(
      (a) =>
        `<div class="audit-item"><div class="audit-action">${escapeHtml(a.action)}</div><div><b>${escapeHtml(a.module)} • #${escapeHtml(a.record_id)}</b><p>${escapeHtml(a.description)}</p><small>${escapeHtml(a.user?.full_name || "System")} · ${formatDate(a.created_at)}</small></div></div>`,
    )
    .join("");
}
