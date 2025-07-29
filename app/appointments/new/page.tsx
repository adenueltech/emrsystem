import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NewAppointmentForm } from "@/components/appointments/new-appointment-form"

export default async function NewAppointmentPage() {
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
    .select("id, patient_id, first_name, last_name, phone")
    .eq("doctor_id", session.user.id)
    .order("first_name")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medledger-navy">Schedule Appointment</h1>
          <p className="text-gray-600 mt-2">Book a new appointment with a patient</p>
        </div>
        <NewAppointmentForm patients={patients || []} />
      </div>
    </div>
  )
}
