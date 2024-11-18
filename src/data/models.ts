// src/data/models.ts

// Define UserRole type to match specific roles used in the system
export type UserRole = 'headVet' | 'assistantVet' | 'caretakerA' | 'caretakerB' | 'caretakerC' | 'admin';

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  tasks?: Task[];
  treatedHealthRecords?: HealthRecord[];
}
interface GalleryItem {
  id: string;
  imageUri: string;
  caption: string;
  date: string;
  uploadedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: string[];
  comments: Comment[];
}


// Animal Interface
export interface Animal {
  id: string;
  name: string;
  uniqueName?: string; // Add this property
  species: string;
  type: 'avian' | 'mammal' | 'reptile';
  healthStatus: 'healthy' | 'sick' | 'under treatment';
  imageUri: string;
  gender: 'male' | 'female';  // Add gender property
  age: string;               // Add age property
  healthRecords?: HealthRecord[];
  cases?: Case[];
  schedules?: Schedule[];
  details?: string; // Optional details property

}

export interface Member {
  id: string;
  name: string;
  category: 'avian' | 'mammal' | 'reptile';
  totalHeads: number;
  imageUrl: string;
  animals: Animal[];
}

// Health Record Interface
export interface HealthRecord {
  id: string;
  animalId: string;
  date: string;
  type: 'checkup' | 'treatment' | 'emergency';
  notes: string;
  vitals: {
    temperature?: number;
    weight?: number;
    hydrationLevel?: string;
    appetite?: string;
    heartRate?: number;
    respiratoryRate?: number;
  };
  treatedBy: string;
  images: string[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
  }[];
  diet?: string; // Add this if required
  status: 'pending' | 'in-progress' | 'completed';
}


// Task Interface
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'completed';
  dueDate: string;
  isUrgent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Appointment Interface
export interface Appointment {
  id: string;
  animalId: string;
  date: string;
  time: string;
  status: 'Requested' | 'Confirmed' | 'Completed';
  assignedTo: string;
  procedure: string;
  requestedBy?: string;
  animals?: Animal[];
}


export interface notifications {
  id: string;
  message: string;
  date: string;
}[]


// Schedule Interface
export interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'feeding' | 'medication' | 'checkup' | 'maintenance';
  assignedTo: string;
  status: 'pending' | 'completed';
}

// Report Interface
export interface Report {
  id: string;
  title: string;
  date: string;
  content: string;
  generatedBy: string;
}

// Quick Action Interface
export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
}

// Activity Interface
export interface Activity {
  id: string;
  userId: string;
  action: string;
  time: string;
  details: string;
}

// Case Interface
export interface Case {
  id: string;
  animalId: string;
  severity: 'high' | 'medium' | 'low' | 'critical' | 'moderate' | 'stable';
  assignedVets: string[];
  notes: string[];
  diagnosis?: string;
  condition?: string;
  startDate?: string;
  reportedAt?: string;
  status?: 'active' | 'monitoring' | 'resolved' | 'Critical' | 'Urgent' | 'Moderate';
  reportedBy?: string;
  treatment?: string;
  type?: 'medication' | 'Treatment' | 'procedure' | 'Emergency' | 'Observation' ;
  priority?: 'high' | 'medium' | 'low';
  requestedBy?: string;
  details?: string;
  urgent?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface Inventory {
  id: string;
  itemName: string;
  quantity: number;
  threshold: number;
}

// src/data/models.ts
export interface Notification {
  id: string;
  message: string;
  date: string;
}



export interface UrgentCase {
  id: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
}



export interface Medication {
  id: string;
  name: string;
  dosage: string;
}