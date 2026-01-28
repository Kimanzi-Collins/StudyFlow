export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  duration: number; // in minutes
  date: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface StudyGoal {
  id: string;
  userId: string;
  subject: string;
  targetHours: number;
  currentHours: number;
  deadline: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  time: string;
  days: string[]; // e.g., ['monday', 'wednesday', 'friday']
  enabled: boolean;
}

export interface StudyTip {
  id: string;
  title: string;
  content: string;
  category: 'focus' | 'memory' | 'productivity' | 'wellbeing';
}
