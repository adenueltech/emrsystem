"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, User } from "lucide-react"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

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
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [appointmentDate, setAppointmentDate] = useState<Date>()
  const [appointmentTime, setAppointmentTime] = useState<string>("")
  const [duration, setDuration] = useState<string>("30")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  // Generate time slots from 8 AM to 6 PM
  const timeSlots = []
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      timeSlots.push(time)
    }
  }

  const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || !appointmentDate || !appointmentTime || !reason) {
      toast.error("Please fill in all required fields")
      return
    }

    // Check if appointment is in the past
    const appointmentDateTime = new Date(appointmentDate)
    const [hours, minutes] = appointmentTime.split(":").map(Number)
    appointmentDateTime.setHours(hours, minutes, 0, 0)

    if (isBefore(appointmentDateTime, new Date())) {
      toast.error("Cannot schedule appointments in the past")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("You must be logged in to schedule an appointment")
        return
      }

      // Check for conflicting appointments
      const appointmentDateStr = format(appointmentDate, "yyyy-MM-dd")
      const { data: existingAppointments } = await supabase
        .from("appointments")
        .select("appointment_time, duration")
        .eq("doctor_id", user.id)
        .eq("appointment_date", appointmentDateStr)
        .eq("status", "scheduled")

      // Check for time conflicts
      const newAppointmentStart = new Date(`${appointmentDateStr}T${appointmentTime}:00`)
      const newAppointmentEnd = new Date(newAppointmentStart.getTime() + Number.parseInt(duration) * 60000)

      const hasConflict = existingAppointments?.some((apt) => {
        const existingStart = new Date(`${appointmentDateStr}T${apt.appointment_time}:00`)
        const existingEnd = new Date(existingStart.getTime() + apt.duration * 60000)

        return newAppointmentStart < existingEnd && newAppointmentEnd > existingStart
      })

      if (hasConflict) {
        toast.error("This time slot conflicts with an existing appointment")
        return
      }

      const { error } = await supabase.from("appointments").insert({
        patient_id: selectedPatient,
        doctor_id: user.id,
        appointment_date: appointmentDateStr,
        appointment_time: appointmentTime,
        duration: Number.parseInt(duration),
        reason: reason,
        notes: notes || null,
        status: "scheduled",
      })

      if (error) {
        console.error("Error creating appointment:", error)
        toast.error("Failed to schedule appointment. Please try again.")
        return
      }

      toast.success("Appointment scheduled successfully!")
      router.push("/appointments")
    } catch (error) {
      console.error("Error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const selectedPatientData = patients.find((p) => p.id === selectedPatient)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-medledger-teal" />
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

          {selectedPatientData && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Patient ID:</strong> {selectedPatientData.patient_id}
              </p>
              {selectedPatientData.phone && (
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {selectedPatientData.phone}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-medledger-teal" />
            Schedule Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !appointmentDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appointmentDate ? format(appointmentDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    disabled={(date) =>
                      isBefore(startOfDay(date), startOfDay(new Date())) || date > addDays(new Date(), 90)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Appointment Time *</Label>
              <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Regular checkup, Follow-up, Consultation"
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or notes for this appointment..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointment Summary */}
      {selectedPatientData && appointmentDate && appointmentTime && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Patient:</strong> {selectedPatientData.first_name} {selectedPatientData.last_name}
              </p>
              <p>
                <strong>Date:</strong> {format(appointmentDate, "EEEE, MMMM d, yyyy")}
              </p>
              <p>
                <strong>Time:</strong> {appointmentTime}
              </p>
              <p>
                <strong>Duration:</strong> {durationOptions.find((d) => d.value === duration)?.label}
              </p>
              <p>
                <strong>Reason:</strong> {reason}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="bg-medledger-teal hover:bg-medledger-teal/90">
          {loading ? "Scheduling..." : "Schedule Appointment"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/appointments")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
