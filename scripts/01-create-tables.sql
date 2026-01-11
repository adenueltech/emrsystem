-- MedLedger NG Database Schema
-- This script creates the core tables for the EHR system

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  clinic_name TEXT,
  phone TEXT,
  license_number TEXT,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id TEXT UNIQUE NOT NULL, -- Custom patient ID
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  blood_group TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_type TEXT DEFAULT 'consultation',
  chief_complaint TEXT,
  vital_signs JSONB, -- {bp_systolic, bp_diastolic, pulse, temperature, weight, height, bmi}
  soap_subjective TEXT,
  soap_objective TEXT,
  soap_assessment TEXT,
  soap_plan TEXT,
  diagnosis TEXT[],
  icd_codes TEXT[],
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  instructions TEXT,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lab_results table
CREATE TABLE IF NOT EXISTS lab_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  test_date DATE DEFAULT CURRENT_DATE,
  results JSONB, -- Flexible structure for different test types
  reference_range TEXT,
  status TEXT DEFAULT 'normal', -- normal, abnormal, critical
  notes TEXT,
  file_url TEXT, -- For uploaded lab reports
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 30, -- minutes
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can view own patients" ON patients FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can insert own patients" ON patients FOR INSERT WITH CHECK (auth.uid() = doctor_id);
CREATE POLICY "Doctors can update own patients" ON patients FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can view own visits" ON visits FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can insert own visits" ON visits FOR INSERT WITH CHECK (auth.uid() = doctor_id);
CREATE POLICY "Doctors can update own visits" ON visits FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can view own prescriptions" ON prescriptions FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can insert own prescriptions" ON prescriptions FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can view own lab results" ON lab_results FOR SELECT USING (
  patient_id IN (SELECT id FROM patients WHERE doctor_id = auth.uid())
);
CREATE POLICY "Doctors can insert own lab results" ON lab_results FOR INSERT WITH CHECK (
  patient_id IN (SELECT id FROM patients WHERE doctor_id = auth.uid())
);

CREATE POLICY "Doctors can view own appointments" ON appointments FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = doctor_id);
CREATE POLICY "Doctors can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = doctor_id);
