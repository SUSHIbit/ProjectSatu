import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
