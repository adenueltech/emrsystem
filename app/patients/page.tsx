import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PatientsContent } from "@/components/patients/patients-content"

export default async function PatientsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch patients
  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .eq("doctor_id", user.id)
    .order("created_at", { ascending: false })

  return <PatientsContent patients={patients || []} />
}
