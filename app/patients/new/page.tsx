import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewPatientForm } from "@/components/patients/new-patient-form"

export default async function NewPatientPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <NewPatientForm />
}
