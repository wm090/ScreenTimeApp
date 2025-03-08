import { createClient } from "@supabase/supabase-js";

// Provide default values for development
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2NDExNDMyLCJleHAiOjE5MzE5ODc0MzJ9.dummy-key";

// Create a mock Supabase client if URL is not provided
const createMockClient = () => {
  return {
    auth: {
      signInAnonymously: async () => ({
        data: { user: { id: "mock-user-id" } },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: (table) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      insert: async () => ({ data: null, error: null }),
      upsert: async () => ({ data: null, error: null }),
    }),
  };
};

// Use mock client if URL is the default
export const supabase =
  supabaseUrl === "https://your-project.supabase.co"
    ? (createMockClient() as any)
    : createClient(supabaseUrl, supabaseAnonKey);

// Log to help with debugging
console.log("Supabase client initialized", {
  usingMock: supabaseUrl === "https://your-project.supabase.co",
  url: supabaseUrl.substring(0, 15) + "...",
});
