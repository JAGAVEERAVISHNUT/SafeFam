export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  profile_id: string | null;
  full_name: string;
  relationship: string | null;
  date_of_birth: string | null;
  blood_type: string | null;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  avatar_url: string | null;
  is_primary_account: boolean;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  family_member_id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  start_date: string;
  end_date: string | null;
  instructions: string | null;
  prescribing_doctor: string | null;
  pharmacy: string | null;
  refill_reminder_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  taken_time: string | null;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  notes: string | null;
  created_at: string;
}

export interface Vaccination {
  id: string;
  family_member_id: string;
  vaccine_name: string;
  date_administered: string;
  next_dose_date: string | null;
  administered_by: string | null;
  location: string | null;
  batch_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  family_member_id: string;
  title: string;
  appointment_type: string;
  doctor_name: string | null;
  location: string | null;
  appointment_date: string;
  duration_minutes: number;
  notes: string | null;
  reminder_sent: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  family_member_id: string;
  record_type: string;
  title: string;
  description: string | null;
  date: string;
  doctor_name: string | null;
  facility: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}
