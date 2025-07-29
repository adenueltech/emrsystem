import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewAppointmentForm } from "@/components/appointments/new-appointment-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default async function NewAppointmentPage() {
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
          <h1 className="text-3xl font-bold text-medledger-navy">Schedule New Appointment</h1>
          <p className="text-gray-600 mt-2">Book an appointment with your patient</p>
        </div>
        <NewAppointmentForm />
      </div>
    </DashboardLayout>
  )
}
