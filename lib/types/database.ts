export interface Profile {
  id: string
  email: string
  full_name: string
  created_at: string
  updated_at: string
}

export interface Family {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface FamilyMember {
  id: string
  family_id: string
  name: string
  date_of_birth: string
  blood_type?: string
  allergies?: string[]
  medical_conditions?: string[]
  emergency_contact?: string
  emergency_phone?: string
  profile_picture?: string
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  family_member_id: string
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date?: string
  notes?: string
  reminder_enabled: boolean
  created_at: string
  updated_at: string
}

export interface MedicationLog {
  id: string
  medication_id: string
  taken_at: string
  notes?: string
  created_at: string
}

export interface Vaccination {
  id: string
  family_member_id: string
  vaccine_name: string
  date_administered: string
  next_dose_date?: string
  administered_by?: string
  location?: string
  batch_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  family_member_id: string
  title: string
  appointment_date: string
  doctor_name?: string
  location?: string
  notes?: string
  reminder_enabled: boolean
  status: "scheduled" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export interface HealthRecord {
  id: string
  family_member_id: string
  record_type: string
  title: string
  description?: string
  file_url?: string
  record_date: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>
      }
      families: {
        Row: Family
        Insert: Omit<Family, "id" | "created_at">
        Update: Partial<Omit<Family, "id" | "created_at">>
      }
      family_members: {
        Row: FamilyMember
        Insert: Omit<FamilyMember, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<FamilyMember, "id" | "created_at" | "updated_at">>
      }
      medications: {
        Row: Medication
        Insert: Omit<Medication, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Medication, "id" | "created_at" | "updated_at">>
      }
      medication_logs: {
        Row: MedicationLog
        Insert: Omit<MedicationLog, "id" | "created_at">
        Update: Partial<Omit<MedicationLog, "id" | "created_at">>
      }
      vaccinations: {
        Row: Vaccination
        Insert: Omit<Vaccination, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Vaccination, "id" | "created_at" | "updated_at">>
      }
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Appointment, "id" | "created_at" | "updated_at">>
      }
      health_records: {
        Row: HealthRecord
        Insert: Omit<HealthRecord, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<HealthRecord, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
