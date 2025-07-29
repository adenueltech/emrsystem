import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NewVisitForm } from "@/components/visits/new-visit-form"

export default async function NewVisitPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user's patients for the dropdown
  const { data: patients } = await supabase
    .from("patients")
    .select("id, patient_id, first_name, last_name")
    .eq("doctor_id", session.user.id)
    .order("first_name")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medledger-navy">New Patient Visit</h1>
          <p className="text-gray-600 mt-2">Record a new patient consultation</p>
        </div>
        <NewVisitForm patients={patients || []} />
      </div>
    </div>
  )
}
