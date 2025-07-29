"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Brain, FileText, Pill, TrendingUp, Lightbulb, Sparkles, Copy, RefreshCw } from "lucide-react"
import type { SOAPTemplate, MedicationTemplate } from "@/lib/types"
import { generateSOAPNote, generatePrescriptionInstructions, analyzeSymptomsAndSuggestDiagnosis } from "@/lib/ai"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AIAssistantContentProps {
  soapTemplates: SOAPTemplate[]
  medicationTemplates: MedicationTemplate[]
}

export function AIAssistantContent({ soapTemplates, medicationTemplates }: AIAssistantContentProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [soapInput, setSoapInput] = useState({
    chiefComplaint: "",
    patientHistory: "",
    vitalSigns: "",
  })
  const [soapResult, setSoapResult] = useState<any>(null)

  const [prescriptionInput, setPrescriptionInput] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    patientAge: "",
    patientWeight: "",
  })
  const [prescriptionResult, setPrescriptionResult] = useState("")

  const [diagnosisInput, setDiagnosisInput] = useState({
    symptoms: "",
    vitalSigns: "",
    patientHistory: "",
  })
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)

  const { toast } = useToast()

  const handleGenerateSOAP = async () => {
    if (!soapInput.chiefComplaint.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide the chief complaint to generate SOAP notes.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateSOAPNote(
        soapInput.chiefComplaint,
        soapInput.patientHistory,
        soapInput.vitalSigns ? JSON.parse(soapInput.vitalSigns) : undefined,
      )

      if (result) {
        setSoapResult(result)
        toast({
          title: "SOAP Notes Generated!",
          description: "AI has generated professional SOAP notes based on your input.",
        })
      } else {
        toast({
          title: "Generation Failed",
          description: "Unable to generate SOAP notes. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while generating SOAP notes.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePrescription = async () => {
    if (!prescriptionInput.medication || !prescriptionInput.dosage) {
      toast({
        title: "Missing Information",
        description: "Please provide medication name and dosage.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const result = await generatePrescriptionInstructions(
        prescriptionInput.medication,
        prescriptionInput.dosage,
        prescriptionInput.frequency,
        prescriptionInput.duration,
        prescriptionInput.patientAge ? Number.parseInt(prescriptionInput.patientAge) : undefined,
        prescriptionInput.patientWeight ? Number.parseFloat(prescriptionInput.patientWeight) : undefined,
      )

      if (result) {
        setPrescriptionResult(result)
        toast({
          title: "Instructions Generated!",
          description: "AI has generated clear prescription instructions.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while generating prescription instructions.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnalyzeSymptoms = async () => {
    if (!diagnosisInput.symptoms.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide symptoms to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const result = await analyzeSymptomsAndSuggestDiagnosis(
        diagnosisInput.symptoms,
        diagnosisInput.vitalSigns ? JSON.parse(diagnosisInput.vitalSigns) : undefined,
        diagnosisInput.patientHistory,
      )

      if (result) {
        setDiagnosisResult(result)
        toast({
          title: "Analysis Complete!",
          description: "AI has analyzed the symptoms and provided diagnostic suggestions.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while analyzing symptoms.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-medledger-navy">AI Assistant</h1>
            <p className="text-gray-600">Intelligent tools to enhance your medical practice</p>
          </div>
        </div>

        {/* AI Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-medledger-navy">Smart SOAP Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Generate professional SOAP notes based on patient symptoms and examination findings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader>
              <Pill className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-medledger-navy">Prescription Helper</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Generate clear, patient-friendly prescription instructions with dosage guidelines.
              </p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-medledger-navy">Symptom Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Analyze patient symptoms and get AI-powered diagnostic suggestions and recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Tools */}
        <Tabs defaultValue="soap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
            <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* SOAP Notes Generator */}
          <TabsContent value="soap">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate SOAP Notes
                  </CardTitle>
                  <CardDescription>Provide patient information to generate professional SOAP notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chief Complaint *</label>
                    <Textarea
                      placeholder="Patient's main complaint or reason for visit..."
                      value={soapInput.chiefComplaint}
                      onChange={(e) => setSoapInput((prev) => ({ ...prev, chiefComplaint: e.target.value }))}
                      className="border-medledger-teal/20 focus:border-medledger-teal"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient History (Optional)</label>
                    <Textarea
                      placeholder="Relevant medical history, previous conditions, medications..."
                      value={soapInput.patientHistory}
                      onChange={(e) => setSoapInput((prev) => ({ ...prev, patientHistory: e.target.value }))}
                      className="border-medledger-teal/20 focus:border-medledger-teal"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vital Signs (Optional JSON)</label>
                    <Textarea
                      placeholder='{"bp_systolic": 120, "bp_diastolic": 80, "pulse": 72, "temperature": 36.5}'
                      value={soapInput.vitalSigns}
                      onChange={(e) => setSoapInput((prev) => ({ ...prev, vitalSigns: e.target.value }))}
                      className="border-medledger-teal/20 focus:border-medledger-teal font-mono text-sm"
                      rows={2}
                    />
                  </div>

                  <Button
                    onClick={handleGenerateSOAP}
                    disabled={isGenerating}
                    className="w-full bg-medledger-teal hover:bg-medledger-teal/90 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate SOAP Notes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* SOAP Results */}
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy">Generated SOAP Notes</CardTitle>
                  <CardDescription>AI-generated professional medical notes</CardDescription>
                </CardHeader>
                <CardContent>
                  {soapResult ? (
                    <div className="space-y-4">
                      {Object.entries(soapResult).map(([key, value]) => (
                        <div key={key} className="soap-section">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-medledger-navy capitalize">{key}</h4>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(value as string)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Generated SOAP notes will appear here</p>
                      <p className="text-sm">Fill in the form and click generate to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Prescription Generator */}
          <TabsContent value="prescription">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy flex items-center">
                    <Pill className="h-5 w-5 mr-2" />
                    Generate Prescription Instructions
                  </CardTitle>
                  <CardDescription>Create clear, patient-friendly prescription instructions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Medication Name *</label>
                      <Input
                        placeholder="e.g., Paracetamol"
                        value={prescriptionInput.medication}
                        onChange={(e) => setPrescriptionInput((prev) => ({ ...prev, medication: e.target.value }))}
                        className="border-medledger-teal/20 focus:border-medledger-teal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dosage *</label>
                      <Input
                        placeholder="e.g., 500mg"
                        value={prescriptionInput.dosage}
                        onChange={(e) => setPrescriptionInput((prev) => ({ ...prev, dosage: e.target.value }))}
                        className="border-medledger-teal/20 focus:border-medledger-teal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Frequency</label>
                      <Input
                        placeholder="e.g., TDS (3 times daily)"
                        value={prescriptionInput.frequency}
                        onChange={(e) => setPrescriptionInput((prev) => ({ ...prev, frequency: e.target.value }))}
                        className="border-medledger-teal/20 focus:border-medledger-teal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration</label>
                      <Input
                        placeholder="e.g., 7 days"
                        value={prescriptionInput.duration}
                        onChange={(e) => setPrescriptionInput((prev) => ({ ...prev, duration: e.target.value }))}
                        className="border-medledger-teal/20 focus:border-medledger-teal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Patient Age (Optional)</label>
                      <Input
                        type="number"
                        placeholder="e.g., 35"
                        value={prescriptionInput.patientAge}
                        onChange={(e) => setPrescriptionInput((prev) => ({ ...prev, patientAge: e.target.value }))}
                        className="border-medledger-teal/20 focus:border-medledger-teal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Patient Weight (kg)</label>
                      <Input
                        type="number"
                        placeholder="e.g., 70"
                        value={prescriptionInput.patientWeight}
                        onChange={(e) => setPrescriptionInput((prev) => ({ ...prev, patientWeight: e.target.value }))}
                        className="border-medledger-teal/20 focus:border-medledger-teal"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleGeneratePrescription}
                    disabled={isGenerating}
                    className="w-full bg-medledger-teal hover:bg-medledger-teal/90 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Pill className="h-4 w-4 mr-2" />
                        Generate Instructions
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Prescription Results */}
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy">Generated Instructions</CardTitle>
                  <CardDescription>Patient-friendly prescription instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  {prescriptionResult ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800">Prescription Instructions</h4>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(prescriptionResult)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-green-700 whitespace-pre-wrap">{prescriptionResult}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Generated instructions will appear here</p>
                      <p className="text-sm">Fill in the medication details and click generate</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Diagnosis Assistant */}
          <TabsContent value="diagnosis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Symptom Analysis
                  </CardTitle>
                  <CardDescription>Get AI-powered diagnostic suggestions based on patient symptoms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient Symptoms *</label>
                    <Textarea
                      placeholder="Describe the patient's symptoms in detail..."
                      value={diagnosisInput.symptoms}
                      onChange={(e) => setDiagnosisInput((prev) => ({ ...prev, symptoms: e.target.value }))}
                      className="border-medledger-teal/20 focus:border-medledger-teal"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vital Signs (Optional JSON)</label>
                    <Textarea
                      placeholder='{"bp_systolic": 140, "bp_diastolic": 90, "pulse": 88, "temperature": 38.2}'
                      value={diagnosisInput.vitalSigns}
                      onChange={(e) => setDiagnosisInput((prev) => ({ ...prev, vitalSigns: e.target.value }))}
                      className="border-medledger-teal/20 focus:border-medledger-teal font-mono text-sm"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient History (Optional)</label>
                    <Textarea
                      placeholder="Relevant medical history, current medications, allergies..."
                      value={diagnosisInput.patientHistory}
                      onChange={(e) => setDiagnosisInput((prev) => ({ ...prev, patientHistory: e.target.value }))}
                      className="border-medledger-teal/20 focus:border-medledger-teal"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleAnalyzeSymptoms}
                    disabled={isGenerating}
                    className="w-full bg-medledger-teal hover:bg-medledger-teal/90 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analyze Symptoms
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Diagnosis Results */}
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy">Analysis Results</CardTitle>
                  <CardDescription>AI-powered diagnostic suggestions and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  {diagnosisResult ? (
                    <div className="space-y-4">
                      {diagnosisResult.diagnoses && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Possible Diagnoses</h4>
                          <ul className="space-y-1">
                            {diagnosisResult.diagnoses.map((diagnosis: string, index: number) => (
                              <li key={index} className="text-sm text-blue-700">
                                {index + 1}. {diagnosis}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {diagnosisResult.investigations && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-2">Recommended Investigations</h4>
                          <ul className="space-y-1">
                            {diagnosisResult.investigations.map((investigation: string, index: number) => (
                              <li key={index} className="text-sm text-purple-700">
                                • {investigation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {diagnosisResult.treatment_approach && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">Treatment Approach</h4>
                          <p className="text-sm text-green-700">{diagnosisResult.treatment_approach}</p>
                        </div>
                      )}

                      {diagnosisResult.red_flags && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2">Red Flags to Watch</h4>
                          <ul className="space-y-1">
                            {diagnosisResult.red_flags.map((flag: string, index: number) => (
                              <li key={index} className="text-sm text-red-700">
                                ⚠️ {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Analysis results will appear here</p>
                      <p className="text-sm">Describe symptoms and click analyze to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SOAP Templates */}
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy">SOAP Note Templates</CardTitle>
                  <CardDescription>Pre-built templates for common conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {soapTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-medledger-navy">{template.name}</h4>
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {template.subjective_template?.substring(0, 100)}...
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(
                              `Subjective: ${template.subjective_template}\n\nObjective: ${template.objective_template}\n\nAssessment: ${template.assessment_template}\n\nPlan: ${template.plan_template}`,
                            )
                          }
                          className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Template
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Medication Templates */}
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy">Medication Templates</CardTitle>
                  <CardDescription>Common medications with dosage information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicationTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-medledger-navy">{template.medication_name}</h4>
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Dosages:</strong> {template.common_dosages.join(", ")}
                          </p>
                          <p>
                            <strong>Frequencies:</strong> {template.common_frequencies.join(", ")}
                          </p>
                          <p>
                            <strong>Durations:</strong> {template.common_durations.join(", ")}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{template.instructions_template}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(
                              `${template.medication_name}\nDosages: ${template.common_dosages.join(", ")}\nFrequencies: ${template.common_frequencies.join(", ")}\nInstructions: ${template.instructions_template}`,
                            )
                          }
                          className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 mt-2"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Info
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Ethics Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">AI Assistant Guidelines</h4>
                <p className="text-sm text-yellow-700">
                  All AI suggestions are recommendations only. Always use your clinical judgment and verify information
                  before making medical decisions. The AI assistant is designed to support, not replace, professional
                  medical expertise.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
