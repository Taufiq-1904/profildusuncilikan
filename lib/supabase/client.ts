import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Dipakai di Client Component (browser). Env di-set di .env.local dan di
// Vercel > Settings > Environment Variables.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

let browserClient: SupabaseClient | undefined;

// Satu instance untuk seluruh aplikasi di browser, supaya sesi login dan
// listener auth tidak terpecah ke beberapa klien.
export function getSupabase(): SupabaseClient {
  if (!browserClient) browserClient = createClient();
  return browserClient;
}
