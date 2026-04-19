"use client";

import { getSupabase } from "@/lib/supabase/supabaseClient";

interface EnsureProfileParams {
  id: string;
  email?: string | null;
  fullName?: string | null;
}

export async function ensureProfile({
  id,
  email,
  fullName,
}: EnsureProfileParams) {
  const supabase = getSupabase();

  if (!supabase) {
    return {
      error: new Error("Supabase client ni na voljo."),
    };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id,
      email: email ?? null,
      full_name: fullName ?? null,
      role: "user",
    },
    {
      onConflict: "id",
    },
  );

  return { error };
}
