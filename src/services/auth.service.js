import { supabaseClient } from "../config/supabase.js";
import { state } from "../core/state.js";
export const getSession = () => supabaseClient.auth.getSession();
export const signIn = (email, password) =>
  supabaseClient.auth.signInWithPassword({ email, password });
export const signUp = (email, password, fullName) =>
  supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
export async function loadCurrentProfile(userId) {
  const result = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (!result.error) state.profile = result.data;
  return result;
}
export const signOut = () => supabaseClient.auth.signOut();
