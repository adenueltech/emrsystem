import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateSOAPNote(chiefComplaint: string, patientHistory?: string, vitalSigns?: any) {
  try {
    const prompt = `
You are an AI assistant helping a Nigerian doctor write SOAP notes. Based on the following information, suggest a professional SOAP note:

Chief Complaint: ${chiefComplaint}
${patientHistory ? `Patient History: ${patientHistory}` : ""}
${vitalSigns ? `Vital Signs: ${JSON.stringify(vitalSigns)}` : ""}

Please provide suggestions for each SOAP component:
- Subjective: Patient's reported symptoms and history
- Objective: Physical examination findings and vital signs
- Assessment: Clinical impression and diagnosis
- Plan: Treatment plan and follow-up

Keep the language professional but accessible for Nigerian healthcare settings. Include common local medical practices and terminology.

Format your response as JSON with keys: subjective, objective, assessment, plan
`

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      temperature: 0.7,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating SOAP note:", error)
    return null
  }
}

export async function generatePrescriptionInstructions(
  medicationName: string,
  dosage: string,
  frequency: string,
  duration: string,
  patientAge?: number,
  patientWeight?: number,
) {
  try {
    const prompt = `
Generate clear prescription instructions for a Nigerian patient:

Medication: ${medicationName}
Dosage: ${dosage}
Frequency: ${frequency}
Duration: ${duration}
${patientAge ? `Patient Age: ${patientAge}` : ""}
${patientWeight ? `Patient Weight: ${patientWeight}kg` : ""}

Provide clear, simple instructions that include:
1. How to take the medication
2. When to take it
3. Important precautions
4. What to do if a dose is missed

Keep instructions simple and culturally appropriate for Nigerian patients.
`

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      temperature: 0.3,
    })

    return text
  } catch (error) {
    console.error("Error generating prescription instructions:", error)
    return null
  }
}

export async function analyzeSymptomsAndSuggestDiagnosis(symptoms: string, vitalSigns?: any, patientHistory?: string) {
  try {
    const prompt = `
You are assisting a Nigerian doctor with clinical decision support. Based on the following information, suggest possible diagnoses and recommendations:

Symptoms: ${symptoms}
${vitalSigns ? `Vital Signs: ${JSON.stringify(vitalSigns)}` : ""}
${patientHistory ? `Patient History: ${patientHistory}` : ""}

Consider common conditions in Nigerian healthcare settings including:
- Malaria
- Typhoid fever
- Upper respiratory infections
- Hypertension
- Diabetes
- Gastroenteritis

Provide:
1. Top 3 possible diagnoses (most likely first)
2. Recommended investigations
3. General treatment approach
4. Red flags to watch for

Format as JSON with keys: diagnoses (array), investigations (array), treatment_approach (string), red_flags (array)
`

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      temperature: 0.5,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return null
  }
}
