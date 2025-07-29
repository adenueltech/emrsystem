"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, User, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import type { Patient } from "@/lib/types"

export function NewAppointmentForm() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [selectedPatientData, setSelectedPatientData] = useState<Patient | null>(null)
  const [appointmentDate, setAppointmentDate] = useState<Date>()
  const [appointmentTime, setAppointmentTime] = useState<string>("")
  const [duration, setDuration] = useState<string>("30")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      const patient = patients.find((p) => p.id === selectedPatient)
      setSelectedPatientData(patient || null)
    } else {
      setSelectedPatientData(null)
    }
  }, [selectedPatient, patients])

  const fetchPatients = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("patients").select("*").eq("doctor_id", user.id).order("first_name")

      if (error) throw error
      setPatients(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPatients(false)
    }
  }

  const checkAppointmentConflict = async (date: Date, time: string, duration: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return false

      const appointmentDateTime = new Date(date)
      const [hours, minutes] = time.split(":").map(Number)
      appointmentDateTime.setHours(hours, minutes, 0, 0)

      const endDateTime = new Date(appointmentDateTime.getTime() + duration * 60000)

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", user.id)
        .eq("status", "scheduled")
        .gte("appointment_date", appointmentDateTime.toISOString())
        .lt("appointment_date", endDateTime.toISOString())

      if (error) throw error
      return data && data.length > 0
    } catch (error) {
      console.error("Error checking appointment conflict:", error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || !appointmentDate || !appointmentTime || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if appointment is in the past
    const appointmentDateTime = new Date(appointmentDate)
    const [hours, minutes] = appointmentTime.split(":").map(Number)
    appointmentDateTime.setHours(hours, minutes, 0, 0)

    if (isBefore(appointmentDateTime, new Date())) {
      toast({
        title: "Invalid Date",
        description: "Cannot schedule appointments in the past",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Check for conflicts
      const hasConflict = await checkAppointmentConflict(appointmentDate, appointmentTime, Number.parseInt(duration))
      if (hasConflict) {
        toast({
          title: "Scheduling Conflict",
          description: "You already have an appointment at this time",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("appointments").insert({
        patient_id: selectedPatient,
        doctor_id: user.id,
        appointment_date: appointmentDateTime.toISOString(),
        duration: Number.parseInt(duration),
        reason: reason,
        notes: notes,
        status: "scheduled",
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      })

      router.push("/appointments")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate time slots (8 AM to 6 PM, 30-minute intervals)
  const timeSlots = []
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      timeSlots.push(timeString)
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
            <Select value={selectedPatient} onValueChange={setSelectedPatient} disabled={isLoadingPatients}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingPatients ? "Loading patients..." : "Choose a patient"} />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - ID: {patient.id.slice(0, 8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPatientData && (
            <div className="p-4 bg-medledger-light/20 rounded-lg">
              <h4 className="font-semibold text-medledger-navy mb-2">Patient Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Name:</strong> {selectedPatientData.first_name} {selectedPatientData.last_name}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedPatientData.phone}
                </div>
                <div>
                  <strong>Email:</strong> {selectedPatientData.email || "Not provided"}
                </div>
                <div>
                  <strong>Date of Birth:</strong>{" "}
                  {selectedPatientData.date_of_birth
                    ? format(new Date(selectedPatientData.date_of_birth), "PPP")
                    : "Not provided"}
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
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

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
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
          </div>

          {appointmentDate && appointmentTime && (
            <div className="p-4 bg-medledger-teal/10 rounded-lg">
              <h4 className="font-semibold text-medledger-navy mb-2">Appointment Summary</h4>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Date:</strong> {format(appointmentDate, "EEEE, MMMM d, yyyy")}
                </div>
                <div>
                  <strong>Time:</strong> {appointmentTime}
                </div>
                <div>
                  <strong>Duration:</strong> {durationOptions.find((d) => d.value === duration)?.label}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-medledger-teal" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Regular check-up, Follow-up, Consultation"
              required
            />
          </div>
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information or special instructions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" className="bg-medledger-teal hover:bg-medledger-teal/90" disabled={isLoading}>
          {isLoading ? "Scheduling..." : "Schedule Appointment"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/appointments")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
