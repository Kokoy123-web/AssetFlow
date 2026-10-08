const SUPABASE_URL = "https://wlpcfxhrhkcavkmnwlqq.supabase.co";
const SUPABASE_KEY = "sb_publishable_y8i6yJm1jbd5kJKupXo4zg_nZ234zcV";
export const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
);
