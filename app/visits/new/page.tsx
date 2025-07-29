import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewVisitForm } from "@/components/visits/new-visit-form"

export default async function NewVisitPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's patients for the dropdown
  const { data: patients } = await supabase
    .from("patients")
    .select("id, patient_id, first_name, last_name, phone")
    .eq("doctor_id", user.id)
    .order("first_name")

  return <NewVisitForm patients={patients || []} />
}
