import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { NewVisitForm } from "@/components/visits/new-visit-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default async function NewVisitPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's patients for the dropdown
  const { data: patients } = await supabase
    .from("patients")
    .select("id, patient_id, first_name, last_name, phone")
    .eq("doctor_id", user.id)
    .order("first_name")

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-medledger-navy">Record New Visit</h1>
          <p className="text-gray-600 mt-2">Document patient visit details and medical information</p>
        </div>
        <NewVisitForm patients={patients || []} />
      </div>
    </DashboardLayout>
  )
}
