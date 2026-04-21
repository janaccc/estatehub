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

  const basePayload = {
    id,
    email: email ?? null,
    role: "user",
  };

  const tryUpsert = async (payload: Record<string, unknown>) => {
    return supabase.from("profiles").upsert(payload, { onConflict: "id" });
  };

  // Some databases don't have `profiles.full_name`. Try with it first (if provided),
  // then fall back to an upsert without it.
  if (fullName) {
    const { error } = await tryUpsert({
      ...basePayload,
      full_name: fullName,
    });

    if (!error) return { error: null };

    const message = (error as { message?: string } | null)?.message ?? "";
    if (message.includes("'full_name'") || message.includes("full_name")) {
      const { error: fallbackError } = await tryUpsert(basePayload);
      return { error: fallbackError };
    }

    return { error };
  }

  const { error } = await tryUpsert(basePayload);

  return { error };
}
