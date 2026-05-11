/**
 * @fileoverview Onboarding System Type Definitions
 * @module types/onboarding
 * @description Enterprise-grade type definitions for multi-stage user onboarding
 */

export enum UserRole {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  LISTER = 'lister',
  HAULER = 'hauler',
  COMPANY = 'company',
  ADMIN = 'admin',
}

export enum OnboardingStage {
  ROLE_SELECTION = 'role_selection',
  ACCOUNT_CREATION = 'account_creation',
  IDENTITY_VERIFICATION = 'identity_verification',
  DOCUMENT_SUBMISSION = 'document_submission',
  BUSINESS_REGISTRATION = 'business_registration',
  VEHICLE_LISTING = 'vehicle_listing',
  PREFERENCES_SETUP = 'preferences_setup',
  PAYMENT_SETUP = 'payment_setup',
  ONBOARDING_COMPLETE = 'onboarding_complete',
}

export enum DriverServiceType {
  RIDE_HAILING = 'ride_hailing',
  DELIVERY_SERVICES = 'delivery_services',
  RIDE_HAILING_AND_DELIVERY = 'ride_hailing_and_delivery',
  PERSONAL_DRIVER = 'personal_driver',
}

export enum HaulerCargoType {
  LIGHT_CARGO = 'light_cargo',
  MEDIUM_CARGO = 'medium_cargo',
  HEAVY_CARGO = 'heavy_cargo',
  SPECIALIZED_CARGO = 'specialized_cargo',
  REFRIGERATED = 'refrigerated',
  HAZMAT = 'hazmat',
}

export enum ListerFleetType {
  EXOTIC_LUXURY = 'exotic_luxury',
  PREMIUM_VEHICLES = 'premium_vehicles',
  ECO_GIG_VEHICLES = 'eco_gig_vehicles',
  HEAVY_HAUL_VEHICLES = 'heavy_haul_vehicles',
  MIXED_FLEET = 'mixed_fleet',
  CORPORATE_FLEET = 'corporate_fleet',
}

export enum KYCStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_RESUBMISSION = 'requires_resubmission',
}

export enum DocumentType {
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  PASSPORT = 'passport',
  PROOF_OF_ADDRESS = 'proof_of_address',
  BUSINESS_REGISTRATION = 'business_registration',
  TAX_CERTIFICATE = 'tax_certificate',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  INSURANCE_CERTIFICATE = 'insurance_certificate',
}

export enum StageStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  FAILED = 'failed',
}

export interface AccountInformation {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  city: string;
  dateOfBirth?: string;
  profilePhotoUrl?: string;
}

export interface IdentityVerification {
  kycStatus: KYCStatus;
  idType: DocumentType;
  idNumber: string;
  idExpiryDate?: string;
  verificationProvider?: 'smileid' | 'dojah' | 'manual';
  verificationDate?: string;
  verificationReference?: string;
}

export interface DriverInformation {
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseIssuingCountry: string;
  yearsOfExperience: number;
  serviceType: DriverServiceType;
  preferredVehicleTypes: string[];
  hasCommercialLicense: boolean;
  hasCleanDrivingRecord: boolean;
}

export interface ListerBusinessInformation {
  businessName: string;
  businessType: 'individual' | 'company' | 'corporation';
  businessRegistrationNumber?: string;
  taxIdentificationNumber: string;
  fleetType: ListerFleetType;
  numberOfVehicles: number;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
}

export interface HaulerInformation {
  cargoType: HaulerCargoType;
  maxLoadCapacity: number;
  preferredRoutes: string[];
  hasHazmatCertification: boolean;
  hasRefrigerationCapability: boolean;
  insuranceCoverage: number;
}

export interface DocumentSubmission {
  documentType: DocumentType;
  documentUrl: string;
  uploadedAt: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingOptIn: boolean;
}

export interface PaymentSetup {
  paymentMethodAdded: boolean;
  bankAccountLinked: boolean;
  paystackCustomerId?: string;
  defaultPaymentMethod?: string;
}

export interface StageMetadata {
  stage: OnboardingStage;
  status: StageStatus;
  startedAt?: string;
  completedAt?: string;
  attemptCount: number;
  lastError?: string;
}

export interface OnboardingProgress {
  userId?: string;
  sessionId: string;
  userRole: UserRole;
  roleSubType?: DriverServiceType | HaulerCargoType | ListerFleetType;
  currentStage: OnboardingStage;
  stages: StageMetadata[];
  completionPercentage: number;
  
  accountInformation?: AccountInformation;
  identityVerification?: IdentityVerification;
  driverInformation?: DriverInformation;
  listerBusinessInformation?: ListerBusinessInformation;
  haulerInformation?: HaulerInformation;
  documents: DocumentSubmission[];
  preferences?: UserPreferences;
  paymentSetup?: PaymentSetup;
  
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  isComplete: boolean;
  abandonedAt?: string;
}

export interface OnboardingConfiguration {
  role: UserRole;
  requiredStages: OnboardingStage[];
  optionalStages: OnboardingStage[];
  estimatedDuration: number;
  allowSkip: boolean;
  requiresApproval: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface OnboardingApiResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}
