import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      await supabase.auth.exchangeCodeForSession(code)
      // Redirect to the confirmed page instead of dashboard
      return NextResponse.redirect(`${requestUrl.origin}/auth/confirmed`)
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Redirect to login with error message
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=verification_failed`)
    }
  }

  // If no code, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
