'use client';
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'student' | 'organizer' | 'admin' | 'staff';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AppEvent {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  capacity: number;
  registered: number;
  checkedIn: number;
  organizerId: string;
  organizerName: string;
  color: string;
  tags: string[];
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoggedIn: boolean;
  sessionLoading: boolean;
  login: (userData: UserProfile, selectedRole: UserRole) => void;
  logout: () => Promise<void>;
  registrations: any[];
  registerForEvent: (event: AppEvent) => Promise<any>;
  checkInAttendee: (eventId: string, passId: string) => Promise<{ success: boolean; message: string }>;
  events: AppEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AppEvent[]>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('student');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/organizer')) setRole('organizer');
      else if (path.startsWith('/admin')) setRole('admin');
      else if (path.startsWith('/staff')) setRole('staff');
      else if (path.startsWith('/student')) setRole('student');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setSessionLoading(true);
      if (firebaseUser) {
        setIsLoggedIn(true);
        try {
          let res = await fetch(`/api/users?email=${encodeURIComponent(firebaseUser.email!)}`);
          
          if (!res.ok && res.status === 404) {
             res = await fetch('/api/users', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ 
                 name: firebaseUser.displayName || 'Eventra Member', 
                 email: firebaseUser.email,
                 role: 'student'
               })
             });
          }

          if (res.ok) {
            const mongoUser = await res.json();
            setUser(mongoUser);
            setRole(mongoUser.role || 'student');
          } else {
            setUser(null); 
          }
        } catch (e) {
          setUser({ email: firebaseUser.email!, name: firebaseUser.displayName!, id: '', role: 'student' });
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRegistrations([]);
        setEvents([]);
      }
      setSessionLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    async function loadData() {
      try {
        setLoading(true);
        const resEvents = await fetch('/api/events');
        if (resEvents.ok) {
          const evts = await resEvents.json();
          setEvents(evts || []);
        }
        if (user?.id) {
          const resRegs = await fetch(`/api/registrations?userId=${user.id}`);
          if (resRegs.ok) {
            const regs = await resRegs.json();
            setRegistrations(regs || []);
          }
        }
      } catch (e) {
        console.error('Data init failed:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionLoading, user?.id]);

  const login = useCallback((userData: UserProfile, selectedRole: UserRole) => {
    setUser(userData);
    setRole(selectedRole);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
    } catch (e) {
      console.error('Logout error', e);
    }
  }, []);

  const registerForEvent = useCallback(async (event: AppEvent) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          eventId: event.id, 
          userId: user?.id,
          userEmail: user?.email
        })
      });
      
      const newReg = await res.json();
      if (!res.ok) throw new Error(newReg.error || 'Registration failed');

      setRegistrations(prev => [newReg, ...prev]);
      setEvents(prev => prev.map(e =>
        e.id === event.id ? { ...e, registered: (e.registered || 0) + 1 } : e
      ));
      return newReg;
    } catch (e) {
      console.error('Registration Error:', e);
      throw e;
    }
  }, [user?.id, user?.email]);

  const checkInAttendee = useCallback(async (eventId: string, passId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId, passId })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || data.error || 'Failed to check in' };

      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, checkedIn: (e.checkedIn || 0) + 1 } : e
      ));
      return data;
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error' };
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
  }, []);

  return (
    <AppContext.Provider value={{
      role, setRole: switchRole,
      user, setUser,
      isLoggedIn, sessionLoading, login, logout,
      registrations, registerForEvent,
      checkInAttendee,
      events, setEvents,
      notifications, setNotifications,
      sidebarOpen, setSidebarOpen,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
