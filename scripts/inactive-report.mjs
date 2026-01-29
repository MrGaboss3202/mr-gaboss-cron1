import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DAYS = Number(process.env.INACTIVE_DAYS ?? 365);   // <-- aquí pones 90 / 120 / 180 etc
const LIMIT = Number(process.env.INACTIVE_LIMIT ?? 1000);

if (!SUPABASE_URL) throw new Error("SUPABASE_URL is required.");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const { data, error } = await supabase.rpc("deactivate_inactive_customers", {
    p_days: DAYS,
    p_limit: LIMIT,
  });

  if (error) throw error;

  const updated = Array.isArray(data) ? data[0]?.updated_count : data?.updated_count;
  console.log(`OK: marked inactive = ${updated ?? 0} (days=${DAYS}, limit=${LIMIT})`);
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
