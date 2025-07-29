export interface Profile {
  id: string
  email: string
  full_name?: string
  clinic_name?: string
  phone?: string
  license_number?: string
  specialization?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  doctor_id: string
  patient_id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  gender?: "male" | "female" | "other"
  phone?: string
  email?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  blood_group?: string
  allergies?: string[]
  chronic_conditions?: string[]
  created_at: string
  updated_at: string
}

export interface VitalSigns {
  bp_systolic?: number
  bp_diastolic?: number
  pulse?: number
  temperature?: number
  weight?: number
  height?: number
  bmi?: number
}

export interface Visit {
  id: string
  patient_id: string
  doctor_id: string
  visit_date: string
  visit_type: string
  chief_complaint?: string
  vital_signs?: VitalSigns
  soap_subjective?: string
  soap_objective?: string
  soap_assessment?: string
  soap_plan?: string
  diagnosis?: string[]
  icd_codes?: string[]
  follow_up_date?: string
  notes?: string
  created_at: string
  updated_at: string
  patient?: Patient
}

export interface Prescription {
  id: string
  visit_id: string
  patient_id: string
  doctor_id: string
  medication_name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  quantity?: number
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  reason?: string
  notes?: string
  created_at: string
  updated_at: string
  patient?: Patient
}

export interface SOAPTemplate {
  id: string
  name: string
  category: string
  subjective_template?: string
  objective_template?: string
  assessment_template?: string
  plan_template?: string
}

export interface MedicationTemplate {
  id: string
  medication_name: string
  common_dosages: string[]
  common_frequencies: string[]
  common_durations: string[]
  category?: string
  instructions_template?: string
}
