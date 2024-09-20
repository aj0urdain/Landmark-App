import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAdminKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZGZkd3Z2d21ubmxudHBucmVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjM1OTg5NSwiZXhwIjoyMDQxOTM1ODk1fQ.dt5iMPl211WwBgMHRAWu5xSeCOjUrkJ7WdWbdjVcRmg" ||
  "";

export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey);
