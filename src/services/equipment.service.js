import { supabaseClient } from "../config/supabase.js";
export const listEquipment = () =>
  supabaseClient
    .from("equipment")
    .select("*")
    .order("created_at", { ascending: false });
export const addEquipment = (payload) =>
  supabaseClient.from("equipment").insert(payload);
export const setMaintenance = (equipmentId) =>
  supabaseClient.rpc("set_equipment_maintenance", {
    p_equipment_id: equipmentId,
  });
