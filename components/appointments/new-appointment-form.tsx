"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, User, FileText } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { format, addDays } from "date-fns"

interface Patient {
  id: string
  patient_id: string
  first_name: string
  last_name: string
  phone?: string
}

interface NewAppointmentFormProps {
  patients: Patient[]
}

export function NewAppointmentForm({ patients }: NewAppointmentFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")

  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
    duration: "30",
    reason: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(time)
      }
    }
    return slots
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || !formData.appointment_date || !formData.appointment_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Combine date and time
      const appointmentDateTime = new Date(`${formData.appointment_date}T${formData.appointment_time}:00`)

      // Check if appointment time is in the past
      if (appointmentDateTime < new Date()) {
        toast({
          title: "Error",
          description: "Cannot schedule appointments in the past",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Check for conflicting appointments
      const { data: existingAppointments } = await supabase
        .from("appointments")
        .select("id")
        .eq("doctor_id", user.id)
        .eq("appointment_date", appointmentDateTime.toISOString())
        .eq("status", "scheduled")

      if (existingAppointments && existingAppointments.length > 0) {
        toast({
          title: "Error",
          description: "You already have an appointment scheduled at this time",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create appointment record
      const { error } = await supabase.from("appointments").insert({
        patient_id: selectedPatient,
        doctor_id: user.id,
        appointment_date: appointmentDateTime.toISOString(),
        duration: Number.parseInt(formData.duration),
        status: "scheduled",
        reason: formData.reason,
        notes: formData.notes,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Appointment scheduled successfully!",
      })
      router.push("/appointments")
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedPatientInfo = patients.find((p) => p.id === selectedPatient)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-medledger-navy">Schedule Appointment</h1>
          <p className="text-gray-600 mt-2">Book a new appointment with a patient</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-medledger-navy">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient">Select Patient *</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} ({patient.patient_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPatientInfo && (
                <div className="p-3 bg-medledger-light/30 rounded-lg">
                  <p className="text-sm text-medledger-navy">
                    <strong>Patient:</strong> {selectedPatientInfo.first_name} {selectedPatientInfo.last_name}
                  </p>
                  <p className="text-sm text-medledger-navy">
                    <strong>ID:</strong> {selectedPatientInfo.patient_id}
                  </p>
                  {selectedPatientInfo.phone && (
                    <p className="text-sm text-medledger-navy">
                      <strong>Phone:</strong> {selectedPatientInfo.phone}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-medledger-navy">
                <Calendar className="h-5 w-5" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointment_date">Date *</Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => handleInputChange("appointment_date", e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    max={format(addDays(new Date(), 90), "yyyy-MM-dd")}
                  />
                </div>

                <div>
                  <Label htmlFor="appointment_time">Time *</Label>
                  <Select
                    value={formData.appointment_time}
                    onValueChange={(value) => handleInputChange("appointment_time", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeSlots().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    placeholder="e.g., Routine checkup, Follow-up"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-medledger-navy">
                <FileText className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any special instructions or notes for this appointment..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appointment Summary */}
          {selectedPatient && formData.appointment_date && formData.appointment_time && (
            <Card className="border-medledger-teal/20 bg-medledger-light/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-medledger-navy">
                  <Clock className="h-5 w-5" />
                  Appointment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Patient:</strong> {selectedPatientInfo?.first_name} {selectedPatientInfo?.last_name}
                  </p>
                  <p>
                    <strong>Date:</strong> {format(new Date(formData.appointment_date), "EEEE, MMMM do, yyyy")}
                  </p>
                  <p>
                    <strong>Time:</strong> {formData.appointment_time}
                  </p>
                  <p>
                    <strong>Duration:</strong> {formData.duration} minutes
                  </p>
                  {formData.reason && (
                    <p>
                      <strong>Reason:</strong> {formData.reason}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedPatient || !formData.appointment_date || !formData.appointment_time}
              className="bg-medledger-teal hover:bg-medledger-teal/90"
            >
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
