import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  const isPlaceholder =
    !supabaseUrl ||
    supabaseUrl.includes("your-project-ref") ||
    !supabaseAnonKey;

  if (isPlaceholder) {
    throw new Error(
      "Missing or placeholder Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (use your real project URL from Supabase dashboard). Restart the dev server after changing .env.local."
    );
  }

  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

export const supabaseClient = new Proxy(
  {} as SupabaseClient,
  {
    get(_, prop) {
      return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[prop];
    },
  }
) as SupabaseClient;
