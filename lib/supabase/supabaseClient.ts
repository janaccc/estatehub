import { createClient } from "@/utils/supabase/client";

export const getSupabase = () => {
  return createClient();
};