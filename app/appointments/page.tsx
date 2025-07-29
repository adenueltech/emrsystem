import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppointmentsContent } from "@/components/appointments/appointments-content"

export default async function AppointmentsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch appointments with patient information
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients(first_name, last_name, patient_id, phone)
    `)
    .eq("doctor_id", user.id)
    .order("appointment_date", { ascending: true })

  return <AppointmentsContent appointments={appointments || []} />
}
