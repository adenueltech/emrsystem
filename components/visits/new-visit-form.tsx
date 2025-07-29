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
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, User, Activity, FileText, Stethoscope } from "lucide-react"
import { format } from "date-fns"
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

interface NewVisitFormProps {
  patients: Patient[]
}

export function NewVisitForm({ patients }: NewVisitFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [visitType, setVisitType] = useState<string>("")
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [followUpDate, setFollowUpDate] = useState<Date>()

  // Vital Signs
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [pulse, setPulse] = useState("")
  const [temperature, setTemperature] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")

  // SOAP Notes
  const [subjective, setSubjective] = useState("")
  const [objective, setObjective] = useState("")
  const [assessment, setAssessment] = useState("")
  const [plan, setPlan] = useState("")

  // Diagnoses
  const [diagnoses, setDiagnoses] = useState<string[]>([])
  const [newDiagnosis, setNewDiagnosis] = useState("")

  // Additional Notes
  const [notes, setNotes] = useState("")

  const calculateBMI = () => {
    if (weight && height) {
      const weightKg = Number.parseFloat(weight)
      const heightM = Number.parseFloat(height) / 100
      const bmi = weightKg / (heightM * heightM)
      return bmi.toFixed(1)
    }
    return ""
  }

  const addDiagnosis = () => {
    if (newDiagnosis.trim() && !diagnoses.includes(newDiagnosis.trim())) {
      setDiagnoses([...diagnoses, newDiagnosis.trim()])
      setNewDiagnosis("")
    }
  }

  const removeDiagnosis = (diagnosis: string) => {
    setDiagnoses(diagnoses.filter((d) => d !== diagnosis))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || !visitType || !chiefComplaint) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("You must be logged in to create a visit")
        return
      }

      const vitalSigns = {
        blood_pressure: systolic && diastolic ? `${systolic}/${diastolic}` : null,
        pulse: pulse ? Number.parseInt(pulse) : null,
        temperature: temperature ? Number.parseFloat(temperature) : null,
        weight: weight ? Number.parseFloat(weight) : null,
        height: height ? Number.parseFloat(height) : null,
        bmi: calculateBMI() ? Number.parseFloat(calculateBMI()) : null,
      }

      const { error } = await supabase.from("visits").insert({
        patient_id: selectedPatient,
        doctor_id: user.id,
        visit_type: visitType,
        chief_complaint: chiefComplaint,
        vital_signs: vitalSigns,
        subjective: subjective || null,
        objective: objective || null,
        assessment: assessment || null,
        plan: plan || null,
        diagnoses: diagnoses.length > 0 ? diagnoses : null,
        follow_up_date: followUpDate ? followUpDate.toISOString().split("T")[0] : null,
        notes: notes || null,
        visit_date: new Date().toISOString(),
      })

      if (error) {
        console.error("Error creating visit:", error)
        toast.error("Failed to create visit. Please try again.")
        return
      }

      toast.success("Visit recorded successfully!")
      router.push("/visits")
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

      {/* Visit Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-medledger-teal" />
            Visit Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitType">Visit Type *</Label>
              <Select value={visitType} onValueChange={setVisitType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
            <Textarea
              id="chiefComplaint"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Patient's main concern or reason for visit"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-medledger-teal" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="systolic">Systolic BP</Label>
              <Input
                id="systolic"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="120"
              />
            </div>
            <div>
              <Label htmlFor="diastolic">Diastolic BP</Label>
              <Input
                id="diastolic"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="80"
              />
            </div>
            <div>
              <Label htmlFor="pulse">Pulse (bpm)</Label>
              <Input
                id="pulse"
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="72"
              />
            </div>
            <div>
              <Label htmlFor="temperature">Temp (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="36.5"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
              />
            </div>
          </div>

          {calculateBMI() && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>BMI:</strong> {calculateBMI()} kg/m²
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SOAP Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-medledger-teal" />
            SOAP Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subjective">Subjective</Label>
            <Textarea
              id="subjective"
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="Patient's description of symptoms, history, concerns..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="objective">Objective</Label>
            <Textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Physical examination findings, test results..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="Clinical impression, diagnosis..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="plan">Plan</Label>
            <Textarea
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Treatment plan, medications, follow-up instructions..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Diagnoses */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnoses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDiagnosis}
              onChange={(e) => setNewDiagnosis(e.target.value)}
              placeholder="Add a diagnosis"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDiagnosis())}
            />
            <Button type="button" onClick={addDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {diagnoses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {diagnoses.map((diagnosis, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {diagnosis}
                  <button type="button" onClick={() => removeDiagnosis(diagnosis)} className="ml-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Follow-up and Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Follow-up Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !followUpDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {followUpDate ? format(followUpDate, "PPP") : "Select follow-up date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={followUpDate}
                  onSelect={setFollowUpDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or observations..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="bg-medledger-teal hover:bg-medledger-teal/90">
          {loading ? "Recording Visit..." : "Record Visit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/visits")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
