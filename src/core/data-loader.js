import { state, can } from "./state.js";
import { listEquipment } from "../services/equipment.service.js";
import { listBorrowingRequests } from "../services/borrowing.service.js";
import { listAuditLogs, listProfiles } from "../services/admin.service.js";
export async function loadPageData() {
  const [eq, rq] = await Promise.all([
    listEquipment(),
    listBorrowingRequests(),
  ]);
  state.data.equipment = eq.data || [];
  state.data.requests = rq.data || [];
  if (can("admin")) {
    const [a, u] = await Promise.all([listAuditLogs(), listProfiles()]);
    state.data.audit = a.data || [];
    state.data.users = u.data || [];
  } else {
    state.data.audit = [];
    state.data.users = [];
  }
  return { equipmentError: eq.error, requestError: rq.error };
}
