import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createServerClient()

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        // Successful verification - redirect to confirmed page
        return NextResponse.redirect(`${origin}/auth/confirmed`)
      } else {
        console.error("Email verification error:", error)
        // Verification failed - redirect to login with error
        return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`)
      }
    } catch (error) {
      console.error("Unexpected error during verification:", error)
      return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`)
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}
