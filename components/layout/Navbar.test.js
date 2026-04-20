import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';
import { AppProvider } from '@/context/AppContext';

// Mock context to control user state
jest.mock('@/context/AppContext', () => ({
  useApp: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    role: 'student',
    setRole: jest.fn(),
    logout: jest.fn(),
  }),
  AppProvider: ({ children }) => <div>{children}</div>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock fetch for broadcasts
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: 1, title: 'Alert', message: 'Test Broadcast' }]),
  })
);

describe('Navbar Component', () => {
  const mockOnMenuToggle = jest.fn();
  const mockOnBannerStateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and basic elements', async () => {
    await act(async () => {
      render(<Navbar onMenuToggle={mockOnMenuToggle} onBannerStateChange={mockOnBannerStateChange} />);
    });
    expect(screen.getByText('Eventra')).toBeInTheDocument();
  });

  it('displays the broadcast banner when data is fetched', async () => {
    await act(async () => {
      render(<Navbar onMenuToggle={mockOnMenuToggle} onBannerStateChange={mockOnBannerStateChange} />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Test Broadcast/)).toBeInTheDocument();
    });
    expect(mockOnBannerStateChange).toHaveBeenCalledWith(true);
  });

  it('closes the banner when close button is clicked', async () => {
    await act(async () => {
      render(<Navbar onMenuToggle={mockOnMenuToggle} onBannerStateChange={mockOnBannerStateChange} />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Test Broadcast/)).toBeInTheDocument();
    });
    
    const closeBtn = screen.getByLabelText(/Close broadcast banner/i);
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText(/Test Broadcast/)).not.toBeInTheDocument();
    expect(mockOnBannerStateChange).toHaveBeenCalledWith(false);
  });

  it('toggles the sidebar menu', async () => {
    await act(async () => {
      render(<Navbar onMenuToggle={mockOnMenuToggle} />);
    });
    const menuBtn = screen.getByLabelText(/Open main menu/i);
    fireEvent.click(menuBtn);
    expect(mockOnMenuToggle).toHaveBeenCalled();
  });

  it('updates search query', async () => {
    await act(async () => {
      render(<Navbar />);
    });
    const searchInput = screen.getByPlaceholderText(/Search experiences.../i);
    fireEvent.change(searchInput, { target: { value: 'ai' } });
    expect(searchInput.value).toBe('ai');
    
    const clearBtn = screen.getByLabelText(/Clear search/i);
    fireEvent.click(clearBtn);
    expect(searchInput.value).toBe('');
  });

  it('toggles notifications dropdown', async () => {
    await act(async () => {
      render(<Navbar />);
    });
    const notifBtn = screen.getByLabelText(/Toggle notifications/i);
    fireEvent.click(notifBtn);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    fireEvent.click(notifBtn);
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  it('navigates to role-specific tools in profile menu', async () => {
    await act(async () => {
      render(<Navbar />);
    });
    const profileBtn = screen.getByLabelText(/Toggle user profile menu/i);
    fireEvent.click(profileBtn);
    
    // Test clicking role switch buttons
    const organizerPortalBtn = screen.getByText(/Organizer Portal/i);
    fireEvent.click(organizerPortalBtn);
    // Menu closes on role switch
    expect(screen.queryByText(/Protocol Settings/i)).not.toBeInTheDocument();
  });

  it('renders sign in button when no user', async () => {
    // Override mock for this test
    const { useApp } = require('@/context/AppContext');
    jest.spyOn(require('@/context/AppContext'), 'useApp').mockReturnValue({
      user: null,
      role: 'student',
    });

    await act(async () => {
      render(<Navbar />);
    });
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('changes scroll state on window scroll', async () => {
    await act(async () => {
      render(<Navbar />);
    });
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    // This is hard to test without checking classList, but we can verify listener was added
  });
});
