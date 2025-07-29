import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VisitsContent } from "@/components/visits/visits-content"

export default async function VisitsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch visits with patient information
  const { data: visits } = await supabase
    .from("visits")
    .select(`
      *,
      patient:patients(first_name, last_name, patient_id, phone)
    `)
    .eq("doctor_id", user.id)
    .order("visit_date", { ascending: false })

  return <VisitsContent visits={visits || []} />
}
