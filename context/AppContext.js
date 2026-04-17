'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { MY_REGISTRATIONS, EVENTS } from '@/data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('student'); // 'student' | 'organizer' | 'admin' | 'staff'
  const [user, setUser] = useState({
    id: 'user-001',
    name: 'Aarav Sharma',
    email: 'aarav@email.com',
    avatar: 'AS',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [registrations, setRegistrations] = useState(MY_REGISTRATIONS);
  const [events, setEvents] = useState(EVENTS);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = useCallback((userData, selectedRole) => {
    setUser(userData);
    setRole(selectedRole);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const registerForEvent = useCallback((event) => {
    const newReg = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      venue: event.venue,
      status: 'confirmed',
      qrCode: `${event.id.toUpperCase()}-USER001-REG${Date.now()}-2026`,
      passId: `PASS-${event.id.slice(-3).toUpperCase()}-${Date.now()}`,
      type: event.type,
      color: event.color,
    };
    setRegistrations(prev => [...prev, newReg]);
    setEvents(prev => prev.map(e =>
      e.id === event.id ? { ...e, registered: e.registered + 1 } : e
    ));
    return newReg;
  }, []);

  const checkInAttendee = useCallback((eventId, passId) => {
    // Find the event
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found' };

    // Update checked-in count
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, checkedIn: e.checkedIn + 1 } : e
    ));

    return { success: true, message: `Checked in successfully for ${event.title}` };
  }, [events]);

  const approveEvent = useCallback((eventId) => {
    // Simulated approval action
  }, []);

  const switchRole = useCallback((newRole) => {
    setRole(newRole);
  }, []);

  return (
    <AppContext.Provider value={{
      role, setRole: switchRole,
      user, setUser,
      isLoggedIn, login, logout,
      registrations, registerForEvent,
      checkInAttendee,
      events, setEvents,
      notifications, setNotifications,
      sidebarOpen, setSidebarOpen,
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
