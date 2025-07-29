import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewVisitForm } from "@/components/visits/new-visit-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default async function NewVisitPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-medledger-navy">Record New Visit</h1>
          <p className="text-gray-600 mt-2">Document patient visit details and medical information</p>
        </div>
        <NewVisitForm />
      </div>
    </DashboardLayout>
  )
}
