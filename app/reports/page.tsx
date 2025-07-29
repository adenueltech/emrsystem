import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReportsContent } from "@/components/reports/reports-content"

export default async function ReportsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch data for reports
  const { data: patients } = await supabase.from("patients").select("*").eq("doctor_id", user.id)
  const { data: visits } = await supabase.from("visits").select("*").eq("doctor_id", user.id)
  const { data: appointments } = await supabase.from("appointments").select("*").eq("doctor_id", user.id)

  return <ReportsContent patients={patients || []} visits={visits || []} appointments={appointments || []} />
}
