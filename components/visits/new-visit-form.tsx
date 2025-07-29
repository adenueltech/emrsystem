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
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, User, Activity, FileText, Stethoscope } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import type { Patient } from "@/lib/types"

export function NewVisitForm() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [visitType, setVisitType] = useState<string>("")
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [subjective, setSubjective] = useState("")
  const [objective, setObjective] = useState("")
  const [assessment, setAssessment] = useState("")
  const [plan, setPlan] = useState("")
  const [notes, setNotes] = useState("")
  const [followUpDate, setFollowUpDate] = useState<Date>()
  const [diagnoses, setDiagnoses] = useState<string[]>([])
  const [newDiagnosis, setNewDiagnosis] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  // Vital signs
  const [bloodPressure, setBloodPressure] = useState("")
  const [pulse, setPulse] = useState("")
  const [temperature, setTemperature] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [bmi, setBmi] = useState("")

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    // Calculate BMI when weight and height change
    if (weight && height) {
      const weightKg = Number.parseFloat(weight)
      const heightM = Number.parseFloat(height) / 100 // Convert cm to m
      if (weightKg > 0 && heightM > 0) {
        const bmiValue = (weightKg / (heightM * heightM)).toFixed(1)
        setBmi(bmiValue)
      }
    } else {
      setBmi("")
    }
  }, [weight, height])

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
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const vitalSigns = {
        blood_pressure: bloodPressure,
        pulse: pulse,
        temperature: temperature,
        weight: weight,
        height: height,
        bmi: bmi,
      }

      const { error } = await supabase.from("visits").insert({
        patient_id: selectedPatient,
        doctor_id: user.id,
        visit_type: visitType,
        chief_complaint: chiefComplaint,
        subjective: subjective,
        objective: objective,
        assessment: assessment,
        plan: plan,
        vital_signs: vitalSigns,
        diagnoses: diagnoses,
        notes: notes,
        follow_up_date: followUpDate?.toISOString(),
        visit_date: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Visit recorded successfully",
      })

      router.push("/visits")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record visit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const visitTypes = [
    "Consultation",
    "Follow-up",
    "Emergency",
    "Routine Check-up",
    "Specialist Referral",
    "Vaccination",
    "Procedure",
    "Other",
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
                    {patient.first_name} {patient.last_name} - {patient.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitType">Visit Type *</Label>
              <Select value={visitType} onValueChange={setVisitType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  {visitTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
              <Input
                id="chiefComplaint"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Main reason for visit"
                required
              />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120/80"
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
              <Label htmlFor="temperature">Temperature (°C)</Label>
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
          {bmi && (
            <div className="mt-4">
              <Label>BMI</Label>
              <div className="text-lg font-semibold text-medledger-teal">{bmi}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SOAP Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-medledger-teal" />
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
              placeholder="Patient's description of symptoms, history..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="objective">Objective</Label>
            <Textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Physical examination findings, test results..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="Clinical impression, diagnosis..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="plan">Plan</Label>
            <Textarea
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Treatment plan, medications, follow-up..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Diagnoses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-medledger-teal" />
            Diagnoses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDiagnosis}
              onChange={(e) => setNewDiagnosis(e.target.value)}
              placeholder="Add diagnosis"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDiagnosis())}
            />
            <Button type="button" onClick={addDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {diagnoses.map((diagnosis) => (
              <Badge key={diagnosis} variant="secondary" className="flex items-center gap-1">
                {diagnosis}
                <button type="button" onClick={() => removeDiagnosis(diagnosis)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or observations..."
              rows={3}
            />
          </div>
          <div>
            <Label>Follow-up Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
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
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" className="bg-medledger-teal hover:bg-medledger-teal/90" disabled={isLoading}>
          {isLoading ? "Recording Visit..." : "Record Visit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/visits")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
