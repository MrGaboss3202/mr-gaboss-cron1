import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 365 días = 1 año
const DAYS = Number(process.env.INACTIVE_DAYS ?? 365);
const LIMIT = Number(process.env.INACTIVE_LIMIT ?? 1000);

// Seguridad: por defecto NO borra; solo simula
const DRY_RUN = String(process.env.DRY_RUN ?? "true").toLowerCase() !== "false";

if (!SUPABASE_URL) throw new Error("SUPABASE_URL is required.");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const { data, error } = await supabase.rpc("purge_inactive_customers", {
    p_days: DAYS,
    p_limit: LIMIT,
    p_dry_run: DRY_RUN,
  });

  if (error) throw error;

  const deleted = Array.isArray(data) ? data[0]?.deleted_count : data?.deleted_count;
  console.log(
    `OK: ${DRY_RUN ? "would delete" : "deleted"} = ${deleted ?? 0} customers (days=${DAYS}, limit=${LIMIT})`
  );
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
