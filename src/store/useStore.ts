import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, StudySession, StudyGoal, Reminder } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  
  // Study Sessions
  sessions: StudySession[];
  
  // Goals
  goals: StudyGoal[];
  
  // Reminders
  reminders: Reminder[];
  
  // Timer state
  isTimerRunning: boolean;
  timerSeconds: number;
  currentSubject: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setDemoMode: (isDemoMode: boolean) => void;
  
  addSession: (session: StudySession) => void;
  updateSession: (id: string, updates: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  
  addGoal: (goal: StudyGoal) => void;
  updateGoal: (id: string, updates: Partial<StudyGoal>) => void;
  deleteGoal: (id: string) => void;
  
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  
  setTimerRunning: (running: boolean) => void;
  setTimerSeconds: (seconds: number) => void;
  setCurrentSubject: (subject: string) => void;
  
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDemoMode: false,
      sessions: [],
      goals: [],
      reminders: [],
      isTimerRunning: false,
      timerSeconds: 0,
      currentSubject: '',
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setDemoMode: (isDemoMode) => set({ isDemoMode }),
      
      addSession: (session) => set((state) => ({ 
        sessions: [...state.sessions, session] 
      })),
      updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map((s) => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),
      deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id)
      })),
      
      addGoal: (goal) => set((state) => ({ 
        goals: [...state.goals, goal] 
      })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => 
          g.id === id ? { ...g, ...updates } : g
        )
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),
      
      addReminder: (reminder) => set((state) => ({ 
        reminders: [...state.reminders, reminder] 
      })),
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map((r) => 
          r.id === id ? { ...r, ...updates } : r
        )
      })),
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id)
      })),
      
      setTimerRunning: (running) => set({ isTimerRunning: running }),
      setTimerSeconds: (seconds) => set({ timerSeconds: seconds }),
      setCurrentSubject: (subject) => set({ currentSubject: subject }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isTimerRunning: false,
        timerSeconds: 0,
        currentSubject: ''
      }),
    }),
    {
      name: 'studyflow-storage',
    }
  )
);
