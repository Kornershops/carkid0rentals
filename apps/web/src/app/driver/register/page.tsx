"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, User, FileText, Car } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Input } from '@/components/ui';
import { DatePicker, FileUpload } from '@/components/forms';

export default function DriverRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  
  // Step 2: Documents
  const [licenseFiles, setLicenseFiles] = useState<File[]>([]);
  const [idFiles, setIdFiles] = useState<File[]>([]);
  const [proofOfAddressFiles, setProofOfAddressFiles] = useState<File[]>([]);
  
  // Step 3: Vehicle Preference
  const [vehicleType, setVehicleType] = useState('');
  const [experience, setExperience] = useState('');
  
  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Documents', icon: FileText },
    { number: 3, title: 'Preferences', icon: Car },
  ];
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to verification
    router.push('/driver/verify');
  };
  
  const isStep1Valid = fullName && email && phone && dateOfBirth && address;
  const isStep2Valid = licenseFiles.length > 0 && idFiles.length > 0 && proofOfAddressFiles.length > 0;
  const isStep3Valid = vehicleType && experience;
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-20">
        <Container size="md">
          <div className="py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                Become a Driver
              </h1>
              <p className="text-lg text-gray-600">
                Join thousands of drivers earning with eco-gig vehicles
              </p>
            </div>
            
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  
                  return (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                            ${isCompleted ? 'bg-green-600 text-white' : isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}
                          `}
                        >
                          {isCompleted ? (
                            <CheckCircle size={24} weight="fill" />
                          ) : (
                            <Icon size={24} weight="bold" />
                          )}
                        </div>
                        <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                          {step.title}
                        </p>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Form Content */}
            <div className="max-w-2xl mx-auto">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>
                  
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    fullWidth
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    fullWidth
                  />
                  
                  <DatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    fullWidth
                  />
                  
                  <Input
                    label="Address"
                    type="text"
                    placeholder="123 Main Street, Lagos"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    fullWidth
                  />
                </div>
              )}
              
              {/* Step 2: Documents */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Upload Documents
                  </h2>
                  
                  <FileUpload
                    label="Driver's License"
                    accept="image/*,.pdf"
                    onChange={setLicenseFiles}
                    helperText="Upload a clear photo of your valid driver's license"
                  />
                  
                  <FileUpload
                    label="Government ID"
                    accept="image/*,.pdf"
                    onChange={setIdFiles}
                    helperText="National ID, Passport, or Voter's Card"
                  />
                  
                  <FileUpload
                    label="Proof of Address"
                    accept="image/*,.pdf"
                    onChange={setProofOfAddressFiles}
                    helperText="Utility bill or bank statement (not older than 3 months)"
                  />
                </div>
              )}
              
              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Vehicle Preferences
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Preferred Vehicle Type
                    </label>
                    <div className="space-y-2">
                      {['Electric (EV)', 'Hybrid', 'Petrol', 'Any'].map((type) => (
                        <label key={type} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="vehicleType"
                            value={type}
                            checked={vehicleType === type}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium text-gray-900">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Driving Experience
                    </label>
                    <div className="space-y-2">
                      {['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years'].map((exp) => (
                        <label key={exp} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="experience"
                            value={exp}
                            checked={experience === exp}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium text-gray-900">{exp}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-12">
                {currentStep > 1 && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !isStep1Valid) ||
                      (currentStep === 2 && !isStep2Valid)
                    }
                    className="flex-1"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!isStep3Valid || isSubmitting}
                    loading={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </>
  );
}
