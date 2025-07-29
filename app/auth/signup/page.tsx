import { SignupForm } from "@/components/auth/signup-form"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medledger-light via-white to-medledger-light/50 p-4">
      <SignupForm />
    </div>
  )
}
