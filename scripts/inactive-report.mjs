import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data, error } = await supabase.rpc("get_inactive_customers", {
  p_days: 365,
  p_limit: 500,
  p_offset: 0,
});

if (error) {
  console.error("RPC error:", error);
  process.exit(1);
}

console.log("Inactive customers:", data.length);
console.log(JSON.stringify(data, null, 2));
