import React from 'react';
import { render, screen } from '@testing-library/react';
import * as OnboardingComponents from '../index';

describe('Onboarding Components Index', () => {
  it('exports DriverOnboarding component', () => {
    const { DriverOnboarding } = OnboardingComponents;
    expect(DriverOnboarding).toBeDefined();
    
    render(<DriverOnboarding />);
    expect(screen.getByText(/driver onboarding/i)).toBeInTheDocument();
  });

  it('exports ListerOnboarding component', () => {
    const { ListerOnboarding } = OnboardingComponents;
    expect(ListerOnboarding).toBeDefined();
    
    render(<ListerOnboarding />);
    expect(screen.getByText(/become a lister/i)).toBeInTheDocument();
  });

  it('exports CompanyOnboarding component', () => {
    const { CompanyOnboarding } = OnboardingComponents;
    expect(CompanyOnboarding).toBeDefined();
    
    render(<CompanyOnboarding />);
    expect(screen.getByText(/company registration/i)).toBeInTheDocument();
  });

  it('exports KYCVerification component', () => {
    const { KYCVerification } = OnboardingComponents;
    expect(KYCVerification).toBeDefined();
    
    render(<KYCVerification />);
    expect(screen.getByText(/identity verification/i)).toBeInTheDocument();
  });

  it('exports DocumentUpload component', () => {
    const { DocumentUpload } = OnboardingComponents;
    expect(DocumentUpload).toBeDefined();
    
    render(<DocumentUpload label="Test Upload" />);
    expect(screen.getByText(/test upload/i)).toBeInTheDocument();
  });

  it('exports VerificationStatus component', () => {
    const { VerificationStatus } = OnboardingComponents;
    expect(VerificationStatus).toBeDefined();
    
    render(<VerificationStatus status="pending" />);
    expect(screen.getByText(/verification pending/i)).toBeInTheDocument();
  });

  it('exports BackgroundCheck component', () => {
    const { BackgroundCheck } = OnboardingComponents;
    expect(BackgroundCheck).toBeDefined();
    
    render(<BackgroundCheck />);
    expect(screen.getByText(/background check/i)).toBeInTheDocument();
  });

  it('exports RoleSelection component', () => {
    const { RoleSelection } = OnboardingComponents;
    expect(RoleSelection).toBeDefined();
    
    render(<RoleSelection />);
    expect(screen.getByText(/choose your role/i)).toBeInTheDocument();
  });

  it('exports OnboardingProgress component', () => {
    const { OnboardingProgress } = OnboardingComponents;
    expect(OnboardingProgress).toBeDefined();
    
    const steps = [{ id: 1, name: 'Step 1', status: 'current' }];
    render(<OnboardingProgress steps={steps} currentStep={1} />);
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
  });
});
