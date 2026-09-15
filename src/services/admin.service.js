import { supabaseClient } from "../config/supabase.js";
export const listAuditLogs = () =>
  supabaseClient
    .from("audit_logs")
    .select("*,user:user_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);
export const listProfiles = () =>
  supabaseClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
export const updateUserRole = (userId, newRole) =>
  supabaseClient.from("profiles").update({ role: newRole }).eq("id", userId);
