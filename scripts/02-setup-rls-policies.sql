-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Patients policies
DROP POLICY IF EXISTS "Doctors can view own patients" ON public.patients;
CREATE POLICY "Doctors can view own patients" ON public.patients 
  FOR SELECT USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can insert own patients" ON public.patients;
CREATE POLICY "Doctors can insert own patients" ON public.patients 
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can update own patients" ON public.patients;
CREATE POLICY "Doctors can update own patients" ON public.patients 
  FOR UPDATE USING (auth.uid() = doctor_id);

-- Visits policies
DROP POLICY IF EXISTS "Doctors can view own visits" ON public.visits;
CREATE POLICY "Doctors can view own visits" ON public.visits 
  FOR SELECT USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can insert own visits" ON public.visits;
CREATE POLICY "Doctors can insert own visits" ON public.visits 
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can update own visits" ON public.visits;
CREATE POLICY "Doctors can update own visits" ON public.visits 
  FOR UPDATE USING (auth.uid() = doctor_id);

-- Prescriptions policies
DROP POLICY IF EXISTS "Doctors can view own prescriptions" ON public.prescriptions;
CREATE POLICY "Doctors can view own prescriptions" ON public.prescriptions 
  FOR SELECT USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can insert own prescriptions" ON public.prescriptions;
CREATE POLICY "Doctors can insert own prescriptions" ON public.prescriptions 
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

-- Lab results policies
DROP POLICY IF EXISTS "Doctors can view own lab results" ON public.lab_results;
CREATE POLICY "Doctors can view own lab results" ON public.lab_results 
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE doctor_id = auth.uid())
  );

DROP POLICY IF EXISTS "Doctors can insert own lab results" ON public.lab_results;
CREATE POLICY "Doctors can insert own lab results" ON public.lab_results 
  FOR INSERT WITH CHECK (
    patient_id IN (SELECT id FROM public.patients WHERE doctor_id = auth.uid())
  );

-- Appointments policies
DROP POLICY IF EXISTS "Doctors can view own appointments" ON public.appointments;
CREATE POLICY "Doctors can view own appointments" ON public.appointments 
  FOR SELECT USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can insert own appointments" ON public.appointments;
CREATE POLICY "Doctors can insert own appointments" ON public.appointments 
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Doctors can update own appointments" ON public.appointments;
CREATE POLICY "Doctors can update own appointments" ON public.appointments 
  FOR UPDATE USING (auth.uid() = doctor_id);
