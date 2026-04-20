import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { useApp } from '@/context/AppContext';
import { usePathname } from 'next/navigation';

// Mock the context and navigation hooks
jest.mock('@/context/AppContext', () => ({
  useApp: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockUser = { name: 'Shreyansh Gupta', email: 'test@example.com' };
  
  beforeEach(() => {
    usePathname.mockReturnValue('/');
    useApp.mockReturnValue({
      user: mockUser,
      role: 'student',
      setRole: jest.fn(),
      logout: jest.fn(),
    });
    
    // Mock the fetch for broadcasts
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });
  });

  test('renders Eventra logo', () => {
    render(<Navbar />);
    expect(screen.getByText(/Eventra/i)).toBeInTheDocument();
  });

  test('shows student portal label by default', () => {
    render(<Navbar />);
    expect(screen.getByText(/Student/i)).toBeInTheDocument();
  });

  test('toggles notifications menu when clicked', () => {
    render(<Navbar />);
    const notifBtn = screen.getByLabelText(/Toggle notifications/i);
    fireEvent.click(notifBtn);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  test('renders sign in button when no user is present', () => {
    useApp.mockReturnValue({
      user: null,
      role: 'student',
      setRole: jest.fn(),
      logout: jest.fn(),
    });
    render(<Navbar />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });
});
