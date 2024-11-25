export type UserRole = 'super_admin' | 'service_admin' | 'pool_admin' | 'nurse' | 'pending';

export interface Department {
  id: string;
  name: string;
  description?: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  departmentId: string;
  admins: string[]; // User IDs of service admins
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: 'pending' | 'active' | 'inactive';
  photoURL?: string;
  
  // Professional Information
  department?: string; // Department ID
  service?: string; // Service ID or 'POOL'
  workingHours: {
    type: 'full_time' | 'part_time';
    percentage?: number; // For part-time only
  };
  position?: {
    type: 'nurse' | 'auxiliary_nurse' | 'other';
    internalId?: string;
  };

  // Optional preferences
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    defaultView: 'weekly' | 'monthly';
    theme: 'light' | 'dark' | 'system';
    language: 'fr' | 'en';
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  validatedAt?: Date;
  validatedBy?: string; // User ID of the admin who validated
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RegistrationStep1 {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  service: string;
  workingHours: {
    type: 'full_time' | 'part_time';
    percentage?: number;
  };
}

export interface RegistrationStep2 {
  position?: {
    type: 'nurse' | 'auxiliary_nurse' | 'other';
    internalId?: string;
  };
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    defaultView: 'weekly' | 'monthly';
  };
}
