import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewAppointmentForm } from "@/components/appointments/new-appointment-form"

export default async function NewAppointmentPage() {
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

  return <NewAppointmentForm patients={patients || []} />
}
