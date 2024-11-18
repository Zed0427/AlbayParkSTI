import { User, Animal, HealthRecord,Notification, Task, Schedule, Report, QuickAction, Activity, Case, Appointment, Inventory, UrgentCase, Medication, Member } from './models';

export const users: User[] = [
  { id: '1', name: 'Dr. John Doe', email: 'john@example.com', role: 'headVet', profilePicture: 'https://example.com/john.jpg' },
  { id: '2', name: 'Dr. Jane Smith', email: 'jane@example.com', role: 'assistantVet', profilePicture: 'https://example.com/jane.jpg' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'caretakerA', profilePicture: 'https://example.com/mike.jpg' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'caretakerB', profilePicture: 'https://example.com/sarah.jpg' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com', role: 'caretakerC', profilePicture: 'https://example.com/tom.jpg' },
  { id: '6', name: 'Admin User', email: 'admin@example.com', role: 'admin', profilePicture: 'https://example.com/admin.jpg' },
];

export const passwords: { [userId: string]: string } = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
};

// Mock Data
export const members: Member[] = [
  {
    id: '1',
    name: 'African Lovebirds',
    category: 'avian',
    totalHeads: 2,
    imageUrl: 'https://i.pinimg.com/736x/47/6b/34/476b34a4fe6593a1aec5515d4db55d30.jpg',
    animals: [
      {
        id: '1-1',
        name: 'Lovebird A',
        uniqueName: 'Lovebird A',
        species: 'African Lovebird',
        type: 'avian',
        healthStatus: 'healthy',
        imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy8Us_B_jVXts2AGuAMm_OtGPMAE-z7P_n3A&s',
        gender: 'male',
        age: '2 years',
        details: 'Colorful and active. Enjoys chirping and flying.',
        healthRecords: [
          {
            id: 'hr1',
            animalId: '1-1',
            date: '2023-01-01',
            type: 'checkup',
            notes: 'Routine checkup. Healthy bird.',
            vitals: { temperature: 38.5, weight: 1.2 },
            treatedBy: '1',
            images: [],
            status: 'completed',
          },
        ],
      },
      {
        id: '1-2',
        name: 'Lovebird B',
        uniqueName: 'Lovebird B',
        species: 'African Lovebird',
        type: 'avian',
        healthStatus: 'healthy',
        imageUri: 'https://cdn.dotpe.in/longtail/store-items/7562157/fFjmuqau.jpeg',
        gender: 'female',
        age: '2 years',
        details: 'Playful and friendly. Loves perching and seeds.',
        healthRecords: [
          {
            id: 'hr1',
            animalId: '2-1',
            date: '2023-01-01',
            type: 'checkup',
            notes: 'Routine checkup. Healthy bird.',
            vitals: { temperature: 38.5, weight: 1.2 },
            treatedBy: '2',
            images: [],
            status: 'completed',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Bengal Tigers',
    category: 'mammal',
    totalHeads: 3,
    imageUrl: 'https://bigcatsindia.com/wp-content/uploads/2018/06/Royal-Bengal-Tiger.jpg',
    animals: [
      {
        id: '2-1',
        name: 'Raja',
        uniqueName: 'Tiger Raja',
        species: 'Bengal Tiger',
        type: 'mammal',
        healthStatus: 'healthy',
        imageUri: 'https://a-z-animals.com/media/2022/09/iStock-1397800630-1024x614.jpg',
        gender: 'male',
        age: '5 years',
        details: 'Majestic and strong. King of the enclosure.',
      },
      {
        id: '2-2',
        name: 'Rani',
        uniqueName: 'Tiger Rani',
        species: 'Bengal Tiger',
        type: 'mammal',
        healthStatus: 'under treatment',
        imageUri: 'https://i.natgeofe.com/n/621a9811-d11c-4199-9eac-035b5bc42ad2/tiger-animals-hero_square.jpg',
        gender: 'female',
        age: '4 years',
        details: 'Graceful huntress. Currently under observation.',
      },
    ],
  },
  {
    id: '3',
    name: 'Macaws',
    category: 'avian',
    totalHeads: 4,
    imageUrl: 'https://palotoaamazontravel.com/wp-content/uploads/2023/10/macaw.webp',
    animals: [
      {
        id: '3-1',
        name: 'Blue',
        uniqueName: 'Macaw Blue',
        species: 'Blue-and-Gold Macaw',
        type: 'avian',
        healthStatus: 'healthy',
        imageUri: 'https://www.thoughtco.com/thmb/c6Aa3yV4VQtT48oQVXh_h8nvOBE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/scarlet-macaw--ara-macao--native-to-central-and-south-america-175866670-5c3d4d7046e0fb00016e7168.jpg',
        gender: 'male',
        age: '15 years',
        details: 'Intelligent and talkative. Knows multiple phrases.',
      },
    ],
  },
  {
    id: '4',
    name: 'King Cobras',
    category: 'reptile',
    totalHeads: 2,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg',
    animals: [
      {
        id: '4-1',
        name: 'Naga',
        uniqueName: 'Cobra Naga',
        species: 'King Cobra',
        type: 'reptile',
        healthStatus: 'healthy',
        imageUri: 'https://i.natgeofe.com/k/0a566dfa-d8ec-4ade-af66-3c6add8793fb/king-cobra-head_square.jpg',
        gender: 'male',
        age: '8 years',
        details: 'Longest venomous snake in the facility.',
      },
    ],
  },
  {
    id: '5',
    name: 'African Lions',
    category: 'mammal',
    totalHeads: 4,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF6b4beSRANpLYgtBjRJZcl39v1tE89O2Njg&s',
    animals: [
      {
        id: '5-1',
        name: 'Simba',
        uniqueName: 'Lion Simba',
        species: 'African Lion',
        type: 'mammal',
        healthStatus: 'healthy',
        imageUri: 'https://i.natgeofe.com/n/487a0d69-8202-406f-a6a0-939ed3704693/african-lion_thumb_square.JPG',
        gender: 'male',
        age: '6 years',
        details: 'Majestic male lion with full mane.',
      },
    ],
  },
  {
    id: '6',
    name: 'Bearded Dragons',
    category: 'reptile',
    totalHeads: 3,
    imageUrl: 'https://betterthancrickets.com/cdn/shop/articles/b4ccc6b7-d54c-42d0-b8ba-33564cc0798a.jpg?v=1699154925',
    animals: [
      {
        id: '6-1',
        name: 'Drake',
        uniqueName: 'Dragon Drake',
        species: 'Bearded Dragon',
        type: 'reptile',
        healthStatus: 'healthy',
        imageUri: 'https://cdn.britannica.com/37/155037-050-A0B795A3/Bearded-dragon.jpg',
        gender: 'male',
        age: '3 years',
        details: 'Friendly and docile. Great with handlers.',
      },
    ],
  },
  
];

export const notifications = [
  {
    id: '1',
    message: 'Sr. commented on the gallery.',
    date: '2024-11-18 10:15 AM',
  },
  {
    id: '2',
    message: 'Caretaker A finished the daily task.',
    date: '2024-11-18 9:00 AM',
  },
  {
    id: '3',
    message: 'New appointment scheduled for Animal B.',
    date: '2024-11-17 3:30 PM',
  },
  {
    id: '4',
    message: 'Urgent case reported for Animal C.',
    date: '2024-11-17 2:00 PM',
  },
  {
    id: '5',
    message: 'Medication stock is low.',
    date: '2024-11-16 5:45 PM',
  },
];

export const schedules: Schedule[] = [
  {
    id: '1', title: 'Vet check - Polly', date: '2023-06-15', time: '10:00 AM', type: 'checkup', assignedTo: '1',
    status: 'completed'
  },
];

// Tasks
export const tasks: Task[] = [
  { id: '10', title: 'Feed Lions', description: 'Daily feeding', assignedTo: '3', status: 'pending', dueDate: '2023-06-15' },
  { id: '5', title: 'Check Polly’s health', description: 'Emergency health check', assignedTo: '2', status: 'pending', dueDate: '2023-06-15' },
];

// Reports
export const reports: Report[] = [
  { id: '1', title: 'Monthly Health Report', date: '2023-06-01', content: 'Report content here...', generatedBy: '1' },
];

// Quick Actions
export const quickActions: QuickAction[] = [
  { id: '1', title: 'New Health Check', icon: 'medical', color: '#4CAF50' },
  { id: '2', title: 'Schedule Treatment', icon: 'calendar', color: '#2196F3' },
];

// Recent Activities
export const recentActivities: Activity[] = [
  { id: '1', userId: '2', action: 'Completed Health Check', time: '10 mins ago', details: 'Completed health check for Leo' },
];

// Animals
export const animals: Animal[] = [
  {
    id: '1-1',
    name: 'Lovebird A',
    species: 'African Lovebird',
    type: 'avian',
    healthStatus: 'healthy',
    imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy8Us_B_jVXts2AGuAMm_OtGPMAE-z7P_n3A&s', // Same URL as in members
    gender: 'male',
    age: '2 years',
    details: 'Colorful and active.',
  },
];

export const healthRecords: HealthRecord[] = [
  {
    id: 'hr1',
    animalId: '1-1',
    date: '2023-01-01',
    type: 'checkup',
    notes: 'Routine checkup. Healthy bird.',
    vitals: { temperature: 38.5, weight: 0.05, heartRate: 120, respiratoryRate: 30 },
    treatedBy: '1',
    images: [],
    medications: [
      { name: 'Vitamins', dosage: '1 drop/day', frequency: 'daily', startDate: '2023-01-01', endDate: '2023-01-07' },
    ],
    status: 'completed',
  },
  {
    id: 'hr2', // Unique ID
    animalId: '1-2',
    date: '2023-01-01',
    type: 'checkup',
    notes: 'Routine checkup. Healthy bird.',
    vitals: { temperature: 38.5, weight: 1.2 },
    treatedBy: '2',
    images: [],
    status: 'completed',
  },
];


// Cases
export const cases: Case[] = [
  {
    id: '1',
    animalId: '1',  // Leo
    severity: 'high',
    assignedVets: ['1'],
    notes: ['Urgent case reported. Immediate action required.'],
    condition: 'Severe respiratory infection',
    reportedAt: '2023-06-05',
    reportedBy: '3',
    diagnosis: 'Acute respiratory infection',
    startDate: '2023-06-05',
    status: 'Critical', // Maps to red gradient
    treatment: 'Oxygen therapy and antibiotics',
    type: 'Emergency',
    priority: 'high',
    requestedBy: '2',
    details: 'Animal showing severe respiratory distress. Immediate oxygen therapy and antibiotic treatment required. Monitoring vitals every hour.',
    approvalStatus: 'approved',
  },
  {
    id: '2',
    animalId: '2',  // Polly
    severity: 'moderate',
    assignedVets: ['1', '2'],
    notes: ['Monitor breathing patterns daily.'],
    diagnosis: 'Respiratory infection',
    startDate: '2023-06-01',
    status: 'Urgent', // Maps to orange gradient
    treatment: 'Prescribed antibiotics',
    type: 'Treatment',
    priority: 'high',
    requestedBy: '2',
    details: 'Showing signs of respiratory infection. Requires immediate antibiotic treatment and close monitoring of breathing patterns.',
    condition: 'Moderate respiratory infection',
    reportedAt: '2023-06-01',
    reportedBy: '3',
    approvalStatus: 'pending',
  },
  {
    id: '3',
    animalId: '3',  // Milo
    severity: 'moderate',
    assignedVets: ['2'],
    notes: ['Requires routine checkup and monitoring.'],
    condition: 'Mild fever and lethargy',
    reportedAt: '2023-07-01',
    reportedBy: '4',
    diagnosis: 'Minor infection',
    startDate: '2023-07-01',
    status: 'Moderate', // Maps to green gradient
    treatment: 'Antibiotics and hydration',
    type: 'Observation',
    priority: 'medium',
    requestedBy: '2',
    details: 'Slight fever with mild lethargy. Maintaining regular food intake. Scheduled for follow-up in 48 hours.',
    approvalStatus: 'approved',
  },
  {
    id: '4',
    animalId: '4',  // New critical case
    severity: 'high',
    assignedVets: ['1', '2'],
    notes: ['Emergency surgery required'],
    condition: 'Acute abdominal pain',
    reportedAt: '2023-07-02',
    reportedBy: '1',
    diagnosis: 'Suspected intestinal blockage',
    startDate: '2023-07-02',
    status: 'active', // Maps to red gradient
    treatment: 'Emergency surgery',
    type: 'Emergency',
    priority: 'high',
    requestedBy: '1',
    details: 'Showing signs of severe abdominal pain and distension. Emergency surgery team on standby. Immediate intervention required.',
    approvalStatus: 'approved',
  },
  {
    id: '5',
    animalId: '5',  // Another urgent case
    severity: 'high',
    assignedVets: ['2'],
    notes: ['Rapid response needed'],
    condition: 'Severe dehydration',
    reportedAt: '2023-07-02',
    reportedBy: '2',
    diagnosis: 'Acute dehydration',
    startDate: '2023-07-02',
    status: 'Urgent', // Maps to orange gradient
    treatment: 'IV Fluid therapy',
    type: 'Treatment',
    priority: 'high',
    requestedBy: '2',
    details: 'Severe dehydration detected. Immediate IV fluid therapy required. Monitoring kidney function and electrolyte levels.',
    approvalStatus: 'pending',
  }
];



export const appointments: Appointment[] = [
  {
    id: '1',
    animalId: '1-1',
    date: '2023-11-20', // Add date
    time: '10:00 AM', // Add time
    status: 'Requested',
    assignedTo: '',
    procedure: 'Routine Checkup',
    requestedBy: '3',
  },
  {
    id: '2',
    animalId: '2-1',
    date: '2023-11-21', // Add date
    time: '11:00 AM', // Add time
    status: 'Requested',
    assignedTo: '',
    procedure: 'Vaccination',
    requestedBy: '4',
  },
  {
    id: '3',
    animalId: '3-1',
    date: '2023-11-25',
    time: '10:00 AM',
    status: 'Confirmed',
    assignedTo: '1',
    procedure: 'Emergency Surgery',
  },
  {
    id: '4',
    animalId: '4-1',
    date: '2024-11-25',
    time: '10:00 AM',
    status: 'Requested',
    assignedTo: '2',
    procedure: 'Emergency Surgery',
  },
];



const enrichData = () => {
  const enrichedUsers = users.map(user => ({
    ...user,
    tasks: tasks.filter(task => task.assignedTo === user.id),
    treatedHealthRecords: healthRecords.filter(record => record.treatedBy === user.id),
  }));

  const enrichedAnimals = animals.map(animal => ({
    ...animal,
    healthRecords: healthRecords.filter(record => record.animalId === animal.id),
    cases: cases.filter(caseItem => caseItem.animalId === animal.id), // Ensure cases are linked correctly to animals
  }));

  return { 
    enrichedUsers, 
    enrichedAnimals, 
    healthRecords, 
    tasks, 
    reports, 
    quickActions, 
    recentActivities, 
    cases,
  };
};


export const centralizedData = enrichData();


export const animalHealthOverview = {
  healthy: animals.filter((animal) => animal.healthStatus === "healthy").length,
  underTreatment: animals.filter((animal) => animal.healthStatus === "under treatment").length,
  sick: animals.filter((animal) => animal.healthStatus === "sick").length,
};

export const inventory: Inventory[] = [
  { id: '1', itemName: 'Antibiotics', quantity: 5, threshold: 10 },
  { id: '2', itemName: 'Vaccines', quantity: 15, threshold: 20 },
  { id: '3', itemName: 'Bandages', quantity: 25, threshold: 5 },
];


export const urgentCases: UrgentCase[] = [
  { id: '1', description: 'Severe respiratory infection in Lovebird A', status: 'open' },
  { id: '2', description: 'Mild respiratory infection in Tiger Rani', status: 'in-progress' },
];

export const medications: Medication[] = [
  { id: '1', name: 'Antibiotics', dosage: '2 pills per day' },
  { id: '2', name: 'Painkillers', dosage: '1 pill every 6 hours' },
];