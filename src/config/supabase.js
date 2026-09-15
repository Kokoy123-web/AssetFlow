const SUPABASE_URL = "https://jdmojvavjjnlhjsahkgf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ba3C-BFemRTICRKuYLNt_A_r2CInSSt";
export const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
);
