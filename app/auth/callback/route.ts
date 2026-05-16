import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles email-link landings from Supabase Auth:
 * - email confirmation  (?code=...&type=signup)
 * - password recovery   (?code=...&type=recovery → redirect to /reset-password)
 * - magic link          (?code=...&type=magiclink)
 *
 * Supabase appends `?code=<pkce>` to the redirect URL configured on the email template.
 * We exchange the code for a session, then redirect appropriately.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?flash=confirmFail", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?flash=confirmFail`, url.origin)
    );
  }

  // Password recovery → send to reset page (user now has a temporary session)
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", url.origin));
  }

  // Email confirmation / magic link → app
  if (type === "signup") {
    return NextResponse.redirect(new URL("/dashboard?flash=emailConfirmed", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
