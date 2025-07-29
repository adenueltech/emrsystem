import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch dashboard stats
  const { data: patients } = await supabase.from("patients").select("id").eq("doctor_id", user.id)

  const { data: todayAppointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", user.id)
    .gte("appointment_date", new Date().toISOString().split("T")[0])
    .lt("appointment_date", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])

  const { data: recentVisits } = await supabase
    .from("visits")
    .select(`
      *,
      patient:patients(first_name, last_name, patient_id)
    `)
    .eq("doctor_id", user.id)
    .order("visit_date", { ascending: false })
    .limit(5)

  return (
    <DashboardContent
      profile={profile}
      stats={{
        totalPatients: patients?.length || 0,
        todayAppointments: todayAppointments?.length || 0,
        recentVisits: recentVisits || [],
      }}
    />
  )
}
