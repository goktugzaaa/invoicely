import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/db";

const LOGO_BUCKET = "logos";

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}

export async function getProfileWithLogoUrl(userId: string) {
  const profile = await getProfile(userId);
  if (!profile) return null;
  let logoUrl: string | null = null;
  if (profile.logo_path) {
    const supabase = await createClient();
    const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(profile.logo_path);
    logoUrl = data.publicUrl;
  }
  return { profile, logoUrl };
}

export async function fetchLogoBytes(logoPath: string): Promise<Uint8Array | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(LOGO_BUCKET).download(logoPath);
  if (error || !data) return null;
  const arr = await data.arrayBuffer();
  return new Uint8Array(arr);
}

export const LOGO_BUCKET_NAME = LOGO_BUCKET;
