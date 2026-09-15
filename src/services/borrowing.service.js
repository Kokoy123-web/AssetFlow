import { supabaseClient } from "../config/supabase.js";
export const listBorrowingRequests = () =>
  supabaseClient
    .from("borrowing_requests")
    .select(
      "*,equipment:equipment_id(name,asset_code),requester:requester_id(full_name)",
    )
    .order("created_at", { ascending: false });
export const createBorrowingRequest = (payload) =>
  supabaseClient.from("borrowing_requests").insert(payload);
export const processBorrowingAction = (requestId, action) =>
  supabaseClient.rpc("process_borrowing_action", {
    p_request_id: requestId,
    p_action: action,
  });
