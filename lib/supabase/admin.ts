import { createClient } from "@supabase/supabase-js";

// HANYA untuk Route Handler / Server Action. Memakai service_role key yang
// melewati RLS, jadi JANGAN pernah mengimpor file ini dari Client Component
// dan JANGAN memberi awalan NEXT_PUBLIC_ pada variabelnya.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
