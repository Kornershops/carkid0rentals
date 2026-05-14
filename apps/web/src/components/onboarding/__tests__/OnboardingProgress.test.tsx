import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingProgress from '../OnboardingProgress';

const mockSteps = [
  { id: 1, name: 'Personal Info', status: 'completed' },
  { id: 2, name: 'Verification', status: 'current' },
  { id: 3, name: 'Payment', status: 'pending' }
];

describe('OnboardingProgress', () => {
  it('renders progress indicator', () => {
    render(<OnboardingProgress steps={mockSteps} currentStep={2} />);
    
    expect(screen.getByText(/personal info/i)).toBeInTheDocument();
    expect(screen.getByText(/verification/i)).toBeInTheDocument();
    expect(screen.getByText(/payment/i)).toBeInTheDocument();
  });

  it('shows correct step status', () => {
    render(<OnboardingProgress steps={mockSteps} currentStep={2} />);
    
    const completedStep = screen.getByText(/personal info/i).closest('div');
    expect(completedStep).toHaveClass('completed');
    
    const currentStep = screen.getByText(/verification/i).closest('div');
    expect(currentStep).toHaveClass('current');
  });

  it('displays progress percentage', () => {
    render(<OnboardingProgress steps={mockSteps} currentStep={2} />);
    
    expect(screen.getByText(/67%/i)).toBeInTheDocument();
  });

  it('allows navigation to completed steps', () => {
    const onStepClick = jest.fn();
    render(<OnboardingProgress steps={mockSteps} currentStep={2} onStepClick={onStepClick} />);
    
    const completedStep = screen.getByText(/personal info/i);
    fireEvent.click(completedStep);

    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it('prevents navigation to future steps', () => {
    const onStepClick = jest.fn();
    render(<OnboardingProgress steps={mockSteps} currentStep={2} onStepClick={onStepClick} />);
    
    const futureStep = screen.getByText(/payment/i);
    fireEvent.click(futureStep);

    expect(onStepClick).not.toHaveBeenCalled();
  });

  it('shows completion checkmarks', () => {
    render(<OnboardingProgress steps={mockSteps} currentStep={2} />);
    
    const checkmarks = screen.getAllByTestId('check-icon');
    expect(checkmarks).toHaveLength(1);
  });

  it('renders mobile-friendly layout', () => {
    render(<OnboardingProgress steps={mockSteps} currentStep={2} mobile />);
    
    expect(screen.getByTestId('mobile-progress')).toBeInTheDocument();
  });

  it('shows step numbers', () => {
    render(<OnboardingProgress steps={mockSteps} currentStep={2} showNumbers />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
