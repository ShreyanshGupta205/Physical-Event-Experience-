import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimulationConsole from './SimulationConsole';

describe('SimulationConsole', () => {
  const mockOnSimulate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders all simulation buttons', () => {
    render(<SimulationConsole onSimulate={mockOnSimulate} />);
    expect(screen.getByText('Crowd Surge')).toBeInTheDocument();
    expect(screen.getByText('Gate Jam')).toBeInTheDocument();
    expect(screen.getByText('System Alert')).toBeInTheDocument();
  });

  it('triggers onSimulate when a button is clicked', () => {
    render(<SimulationConsole onSimulate={mockOnSimulate} />);
    const surgeButton = screen.getByText('Crowd Surge').closest('button');
    fireEvent.click(surgeButton);
    expect(mockOnSimulate).toHaveBeenCalledWith('surge');
  });

  it('shows running status and disables buttons during simulation', () => {
    render(<SimulationConsole onSimulate={mockOnSimulate} />);
    const surgeButton = screen.getByText('Crowd Surge').closest('button');
    fireEvent.click(surgeButton);

    expect(screen.getByText('RUNNING SIM...')).toBeInTheDocument();
    expect(surgeButton).toBeDisabled();
    
    const jamButton = screen.getByText('Gate Jam').closest('button');
    expect(jamButton).toBeDisabled();
  });

  it('returns to standby after timeout', () => {
    render(<SimulationConsole onSimulate={mockOnSimulate} />);
    const surgeButton = screen.getByText('Crowd Surge').closest('button');
    fireEvent.click(surgeButton);

    expect(screen.getByText('RUNNING SIM...')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText('STANDBY')).toBeInTheDocument();
    expect(surgeButton).not.toBeDisabled();
  });
});
