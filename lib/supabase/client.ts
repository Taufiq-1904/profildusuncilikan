import { createBrowserClient } from "@supabase/ssr";

// Dipakai di Client Component (browser). Env di-set di .env.local dan di
// Vercel > Settings > Environment Variables.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
