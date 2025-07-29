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
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { CalendarDays, User, Stethoscope, FileText, Activity, Plus, X } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface Patient {
  id: string
  patient_id: string
  first_name: string
  last_name: string
}

interface NewVisitFormProps {
  patients: Patient[]
}

export function NewVisitForm({ patients }: NewVisitFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [diagnosis, setDiagnosis] = useState<string[]>([])
  const [newDiagnosis, setNewDiagnosis] = useState("")

  const [formData, setFormData] = useState({
    visit_type: "",
    chief_complaint: "",
    // Vital Signs
    bp_systolic: "",
    bp_diastolic: "",
    pulse: "",
    temperature: "",
    weight: "",
    height: "",
    // SOAP Notes
    soap_subjective: "",
    soap_objective: "",
    soap_assessment: "",
    soap_plan: "",
    follow_up_date: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addDiagnosis = () => {
    if (newDiagnosis.trim() && !diagnosis.includes(newDiagnosis.trim())) {
      setDiagnosis([...diagnosis, newDiagnosis.trim()])
      setNewDiagnosis("")
    }
  }

  const removeDiagnosis = (index: number) => {
    setDiagnosis(diagnosis.filter((_, i) => i !== index))
  }

  const calculateBMI = () => {
    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height)
    if (weight && height) {
      const heightInMeters = height / 100
      return (weight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) {
      toast.error("Please select a patient")
      return
    }

    setLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error("No session")

      // Prepare vital signs
      const vitalSigns = {
        bp_systolic: formData.bp_systolic ? Number.parseInt(formData.bp_systolic) : null,
        bp_diastolic: formData.bp_diastolic ? Number.parseInt(formData.bp_diastolic) : null,
        pulse: formData.pulse ? Number.parseInt(formData.pulse) : null,
        temperature: formData.temperature ? Number.parseFloat(formData.temperature) : null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        height: formData.height ? Number.parseFloat(formData.height) : null,
        bmi: calculateBMI() ? Number.parseFloat(calculateBMI()) : null,
      }

      // Create visit record
      const { data: visit, error } = await supabase
        .from("visits")
        .insert({
          patient_id: selectedPatient,
          doctor_id: session.user.id,
          visit_date: new Date().toISOString(),
          visit_type: formData.visit_type,
          chief_complaint: formData.chief_complaint,
          vital_signs: vitalSigns,
          soap_subjective: formData.soap_subjective,
          soap_objective: formData.soap_objective,
          soap_assessment: formData.soap_assessment,
          soap_plan: formData.soap_plan,
          diagnosis: diagnosis,
          follow_up_date: formData.follow_up_date || null,
          notes: formData.notes,
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Visit recorded successfully!")
      router.push("/visits")
    } catch (error) {
      console.error("Error creating visit:", error)
      toast.error("Failed to record visit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visit_type">Visit Type *</Label>
                <Select value={formData.visit_type} onValueChange={(value) => handleInputChange("visit_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                    <SelectItem value="specialist-referral">Specialist Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="chief_complaint">Chief Complaint</Label>
                <Input
                  id="chief_complaint"
                  value={formData.chief_complaint}
                  onChange={(e) => handleInputChange("chief_complaint", e.target.value)}
                  placeholder="Patient's main concern"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-medledger-navy">
              <Activity className="h-5 w-5" />
              Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="bp_systolic">BP Systolic</Label>
                <Input
                  id="bp_systolic"
                  type="number"
                  value={formData.bp_systolic}
                  onChange={(e) => handleInputChange("bp_systolic", e.target.value)}
                  placeholder="120"
                />
              </div>
              <div>
                <Label htmlFor="bp_diastolic">BP Diastolic</Label>
                <Input
                  id="bp_diastolic"
                  type="number"
                  value={formData.bp_diastolic}
                  onChange={(e) => handleInputChange("bp_diastolic", e.target.value)}
                  placeholder="80"
                />
              </div>
              <div>
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  value={formData.pulse}
                  onChange={(e) => handleInputChange("pulse", e.target.value)}
                  placeholder="72"
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temp (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                  placeholder="36.5"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="70"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="170"
                />
              </div>
            </div>
            {calculateBMI() && (
              <div className="mt-4 p-3 bg-medledger-light/30 rounded-lg">
                <p className="text-sm text-medledger-navy">
                  <strong>Calculated BMI:</strong> {calculateBMI()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SOAP Notes */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-medledger-navy">
              <FileText className="h-5 w-5" />
              SOAP Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="soap_subjective">Subjective</Label>
              <Textarea
                id="soap_subjective"
                value={formData.soap_subjective}
                onChange={(e) => handleInputChange("soap_subjective", e.target.value)}
                placeholder="Patient's description of symptoms, history..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="soap_objective">Objective</Label>
              <Textarea
                id="soap_objective"
                value={formData.soap_objective}
                onChange={(e) => handleInputChange("soap_objective", e.target.value)}
                placeholder="Physical examination findings, test results..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="soap_assessment">Assessment</Label>
              <Textarea
                id="soap_assessment"
                value={formData.soap_assessment}
                onChange={(e) => handleInputChange("soap_assessment", e.target.value)}
                placeholder="Clinical impression, diagnosis..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="soap_plan">Plan</Label>
              <Textarea
                id="soap_plan"
                value={formData.soap_plan}
                onChange={(e) => handleInputChange("soap_plan", e.target.value)}
                placeholder="Treatment plan, medications, follow-up..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-medledger-navy">
              <Stethoscope className="h-5 w-5" />
              Diagnosis
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
            {diagnosis.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {diagnosis.map((item, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <button type="button" onClick={() => removeDiagnosis(index)} className="ml-1 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-medledger-navy">
              <CalendarDays className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="follow_up_date">Follow-up Date</Label>
              <Input
                id="follow_up_date"
                type="date"
                value={formData.follow_up_date}
                onChange={(e) => handleInputChange("follow_up_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes or observations..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

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
            disabled={loading || !selectedPatient || !formData.visit_type}
            className="bg-medledger-teal hover:bg-medledger-teal/90"
          >
            {loading ? "Recording..." : "Record Visit"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
