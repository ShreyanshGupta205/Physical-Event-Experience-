'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('student'); // 'student' | 'organizer' | 'admin' | 'staff'
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Sync role with path — run once on mount only (no dependency on `role` to prevent infinite loop)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/organizer')) setRole('organizer');
      else if (path.startsWith('/admin')) setRole('admin');
      else if (path.startsWith('/staff')) setRole('staff');
      else if (path.startsWith('/student')) setRole('student');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Firebase Auto Session Persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setSessionLoading(true);
      if (firebaseUser) {
        setIsLoggedIn(true);
        try {
          // Sync with MongoDB to get the real BSON ID and Role
          let res = await fetch(`/api/users?email=${encodeURIComponent(firebaseUser.email)}`);
          
          if (!res.ok && res.status === 404) {
             // SELF-HEALING: If user exists in Auth but not in DB, sync them now
             console.log("Healing session: Syncing missing user to DB...");
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
            console.error("Failed to synchronize session with database.");
            setUser(null); 
          }
        } catch (e) {
          console.error("Context Sync Error:", e);
          // Still mark as logged in via Firebase even if DB is down
          setUser({ email: firebaseUser.email, name: firebaseUser.displayName });
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

  // Fetch initial data — wait until session is resolved AND user is known
  useEffect(() => {
    // Don't run while session is still loading
    if (sessionLoading) return;

    async function loadData() {
      try {
        setLoading(true);
        // Always load events (public data)
        const resEvents = await fetch('/api/events');
        if (resEvents.ok) {
          const evts = await resEvents.json();
          setEvents(evts || []);
        }

        // Load registrations only if logged in
        if (user?.id) {
          const resRegs = await fetch(`/api/registrations?userId=${user.id}`);
          if (resRegs.ok) {
            const regs = await resRegs.json();
            setRegistrations(regs || []);
          }
        }
      } catch (e) {
        console.error('Failed to init backend data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionLoading, user?.id]); // Re-runs when session finishes loading or user logs in/out


  const login = useCallback((userData, selectedRole) => {
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

  const registerForEvent = useCallback(async (event) => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId: event.id, 
          userId: user?.id,
          userEmail: user?.email      // fallback for ID mismatch after re-seed
        })
      });
      
      const newReg = await res.json();
      
      if (!res.ok) {
        throw new Error(newReg.error || 'Registration failed');
      }

      setRegistrations(prev => [newReg, ...prev]);
      setEvents(prev => prev.map(e =>
        e.id === event.id ? { ...e, registered: e.registered + 1 } : e
      ));
      
      return newReg;
    } catch (e) {
      console.error('Registration Error:', e);
      throw e;
    }
  }, [user?.id]);

  const checkInAttendee = useCallback(async (eventId, passId) => {
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, passId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, message: data.message || data.error || 'Failed to check in' };
      }

      // Update local checked-in count
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, checkedIn: e.checkedIn + 1 } : e
      ));

      return data;
    } catch (error) {
      return { success: false, message: error.message || 'Network error' };
    }
  }, []);

  const switchRole = useCallback((newRole) => {
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
