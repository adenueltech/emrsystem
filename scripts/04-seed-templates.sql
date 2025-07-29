-- Insert common SOAP templates
INSERT INTO public.soap_templates (name, category, subjective_template, objective_template, assessment_template, plan_template) 
VALUES
('Routine Check-up', 'general', 
 'Patient presents for routine health maintenance. No acute complaints. Feels well overall.',
 'Vital signs stable. Physical examination unremarkable.',
 'Healthy adult for routine preventive care.',
 '1. Continue current health maintenance\n2. Return in 12 months for routine follow-up\n3. Maintain healthy lifestyle'),

('Malaria Case', 'infectious', 
 'Patient presents with fever, chills, headache, and body aches for [X] days. Reports [sweating/rigors]. No recent travel outside Nigeria.',
 'Temperature: [X]°C, appears [well/unwell]. No signs of severe malaria.',
 'Clinical malaria, uncomplicated.',
 '1. Artemether-Lumefantrine (Coartem) as per weight\n2. Paracetamol for fever\n3. Adequate fluid intake\n4. Return if symptoms worsen\n5. Follow-up in 3 days'),

('Hypertension Follow-up', 'chronic', 
 'Patient with known hypertension presents for routine follow-up. Reports [compliance/non-compliance] with medications. [Symptoms if any].',
 'BP: [X/X] mmHg, HR: [X] bpm. [Other relevant findings].',
 'Hypertension, [controlled/uncontrolled].',
 '1. Continue current antihypertensive therapy\n2. Lifestyle modifications\n3. Regular BP monitoring\n4. Follow-up in [X] weeks'),

('Diabetes Follow-up', 'chronic',
 'Patient with Type 2 diabetes presents for routine follow-up. Reports [blood sugar control]. [Diet and exercise compliance].',
 'Weight: [X] kg, BP: [X/X] mmHg. [Foot examination findings]. [Other relevant findings].',
 'Type 2 Diabetes Mellitus, [controlled/uncontrolled].',
 '1. Continue current diabetic medications\n2. Dietary counseling\n3. Regular blood glucose monitoring\n4. HbA1c in 3 months\n5. Follow-up in [X] weeks'),

('Upper Respiratory Infection', 'infectious',
 'Patient presents with [cough/sore throat/nasal congestion] for [X] days. [Associated symptoms]. No fever.',
 'Temperature: [X]°C. Throat: [findings]. Chest: clear to auscultation.',
 'Upper respiratory tract infection, viral.',
 '1. Symptomatic treatment\n2. Adequate rest and fluids\n3. Paracetamol for discomfort\n4. Return if symptoms worsen or persist > 7 days')
ON CONFLICT DO NOTHING;

-- Insert common medications
INSERT INTO public.medication_templates (medication_name, common_dosages, common_frequencies, common_durations, category, instructions_template) 
VALUES
('Paracetamol', ARRAY['500mg', '1000mg'], ARRAY['TDS', 'QDS', 'PRN'], ARRAY['3 days', '5 days', '7 days'], 'analgesic', 'Take with or after food. Do not exceed 4g daily.'),
('Artemether-Lumefantrine', ARRAY['20/120mg', '40/240mg'], ARRAY['BD'], ARRAY['3 days'], 'antimalarial', 'Take with fatty food or milk. Complete the full course.'),
('Amlodipine', ARRAY['5mg', '10mg'], ARRAY['OD'], ARRAY['ongoing'], 'antihypertensive', 'Take at the same time daily. Monitor blood pressure regularly.'),
('Metformin', ARRAY['500mg', '850mg', '1000mg'], ARRAY['BD', 'TDS'], ARRAY['ongoing'], 'antidiabetic', 'Take with or after meals to reduce GI upset.'),
('Amoxicillin', ARRAY['250mg', '500mg'], ARRAY['TDS'], ARRAY['5 days', '7 days', '10 days'], 'antibiotic', 'Complete the full course even if feeling better.')
ON CONFLICT DO NOTHING;
