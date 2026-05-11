/**
 * @fileoverview Onboarding System Constants and Configurations
 * @module constants/onboarding
 */

import {
  UserRole,
  OnboardingStage,
  OnboardingConfiguration,
  DriverServiceType,
  HaulerCargoType,
  ListerFleetType,
} from '@/types/onboarding.types';

export const STORAGE_KEYS = {
  ONBOARDING_PROGRESS: 'carkid0_onboarding_progress_v2',
  ONBOARDING_SESSION: 'carkid0_onboarding_session',
  ROLE_SELECTION: 'carkid0_role_selection',
  LAST_ACTIVE_STAGE: 'carkid0_last_active_stage',
} as const;

export const SESSION_EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000;
export const STAGE_TIMEOUT_DURATION = 30 * 60 * 1000;
export const MAX_FILE_UPLOAD_SIZE = 10 * 1024 * 1024;

export const ALLOWED_DOCUMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
] as const;

export const DRIVER_SERVICE_OPTIONS = [
  {
    value: DriverServiceType.RIDE_HAILING,
    label: 'Ride-Hailing Services',
    description: 'Uber, Bolt, InDrive, and similar platforms',
    icon: '🚗',
  },
  {
    value: DriverServiceType.DELIVERY_SERVICES,
    label: 'Delivery Services',
    description: 'Food delivery, package delivery, courier services',
    icon: '📦',
  },
  {
    value: DriverServiceType.RIDE_HAILING_AND_DELIVERY,
    label: 'Both Ride-Hailing & Delivery',
    description: 'Flexible gig work across multiple platforms',
    icon: '🚗📦',
  },
  {
    value: DriverServiceType.PERSONAL_DRIVER,
    label: 'Personal/Corporate Driver',
    description: 'Dedicated driver services for individuals or companies',
    icon: '👔',
  },
] as const;

export const HAULER_CARGO_OPTIONS = [
  {
    value: HaulerCargoType.LIGHT_CARGO,
    label: 'Light Cargo',
    description: 'Pickup trucks, vans (up to 1.5 tons)',
    icon: '🚐',
    maxCapacity: 1500,
  },
  {
    value: HaulerCargoType.MEDIUM_CARGO,
    label: 'Medium Cargo',
    description: 'Box trucks, small lorries (1.5-5 tons)',
    icon: '🚚',
    maxCapacity: 5000,
  },
  {
    value: HaulerCargoType.HEAVY_CARGO,
    label: 'Heavy Cargo',
    description: 'Semi-trucks, large lorries (5+ tons)',
    icon: '🚛',
    maxCapacity: 20000,
  },
  {
    value: HaulerCargoType.SPECIALIZED_CARGO,
    label: 'Specialized Cargo',
    description: 'Flatbed, tanker, oversized loads',
    icon: '🏗️',
    maxCapacity: 30000,
  },
  {
    value: HaulerCargoType.REFRIGERATED,
    label: 'Refrigerated Transport',
    description: 'Temperature-controlled cargo',
    icon: '❄️',
    maxCapacity: 10000,
  },
  {
    value: HaulerCargoType.HAZMAT,
    label: 'Hazardous Materials',
    description: 'Certified hazmat transportation',
    icon: '⚠️',
    maxCapacity: 15000,
  },
] as const;

export const LISTER_FLEET_OPTIONS = [
  {
    value: ListerFleetType.EXOTIC_LUXURY,
    label: 'Exotic & Luxury Vehicles',
    description: 'High-end sports cars, luxury sedans, supercars',
    icon: '🏎️',
    minPrice: 50000,
  },
  {
    value: ListerFleetType.PREMIUM_VEHICLES,
    label: 'Premium Vehicles',
    description: 'Mid-range luxury, executive cars',
    icon: '🚙',
    minPrice: 15000,
  },
  {
    value: ListerFleetType.ECO_GIG_VEHICLES,
    label: 'Eco-Gig Vehicles',
    description: 'Fuel-efficient cars for gig economy drivers',
    icon: '🔋',
    minPrice: 5000,
  },
  {
    value: ListerFleetType.HEAVY_HAUL_VEHICLES,
    label: 'Heavy-Haul Vehicles',
    description: 'Trucks, lorries, commercial vehicles',
    icon: '🚛',
    minPrice: 20000,
  },
  {
    value: ListerFleetType.MIXED_FLEET,
    label: 'Mixed Fleet',
    description: 'Diverse vehicle types across categories',
    icon: '🚗🚙🚛',
    minPrice: 10000,
  },
  {
    value: ListerFleetType.CORPORATE_FLEET,
    label: 'Corporate Fleet',
    description: 'Company vehicles, executive transport',
    icon: '🏢',
    minPrice: 25000,
  },
] as const;

export const ONBOARDING_CONFIGURATIONS: Record<UserRole, OnboardingConfiguration> = {
  [UserRole.CUSTOMER]: {
    role: UserRole.CUSTOMER,
    requiredStages: [
      OnboardingStage.ROLE_SELECTION,
      OnboardingStage.ACCOUNT_CREATION,
      OnboardingStage.IDENTITY_VERIFICATION,
    ],
    optionalStages: [
      OnboardingStage.PREFERENCES_SETUP,
      OnboardingStage.PAYMENT_SETUP,
    ],
    estimatedDuration: 10,
    allowSkip: true,
    requiresApproval: false,
  },
  [UserRole.DRIVER]: {
    role: UserRole.DRIVER,
    requiredStages: [
      OnboardingStage.ROLE_SELECTION,
      OnboardingStage.ACCOUNT_CREATION,
      OnboardingStage.IDENTITY_VERIFICATION,
      OnboardingStage.DOCUMENT_SUBMISSION,
    ],
    optionalStages: [
      OnboardingStage.PREFERENCES_SETUP,
      OnboardingStage.PAYMENT_SETUP,
    ],
    estimatedDuration: 20,
    allowSkip: false,
    requiresApproval: true,
  },
  [UserRole.LISTER]: {
    role: UserRole.LISTER,
    requiredStages: [
      OnboardingStage.ROLE_SELECTION,
      OnboardingStage.ACCOUNT_CREATION,
      OnboardingStage.BUSINESS_REGISTRATION,
      OnboardingStage.IDENTITY_VERIFICATION,
      OnboardingStage.DOCUMENT_SUBMISSION,
      OnboardingStage.VEHICLE_LISTING,
    ],
    optionalStages: [
      OnboardingStage.PREFERENCES_SETUP,
      OnboardingStage.PAYMENT_SETUP,
    ],
    estimatedDuration: 30,
    allowSkip: false,
    requiresApproval: true,
  },
  [UserRole.HAULER]: {
    role: UserRole.HAULER,
    requiredStages: [
      OnboardingStage.ROLE_SELECTION,
      OnboardingStage.ACCOUNT_CREATION,
      OnboardingStage.IDENTITY_VERIFICATION,
      OnboardingStage.DOCUMENT_SUBMISSION,
    ],
    optionalStages: [
      OnboardingStage.PREFERENCES_SETUP,
      OnboardingStage.PAYMENT_SETUP,
    ],
    estimatedDuration: 15,
    allowSkip: false,
    requiresApproval: true,
  },
  [UserRole.COMPANY]: {
    role: UserRole.COMPANY,
    requiredStages: [
      OnboardingStage.ROLE_SELECTION,
      OnboardingStage.ACCOUNT_CREATION,
      OnboardingStage.BUSINESS_REGISTRATION,
      OnboardingStage.IDENTITY_VERIFICATION,
      OnboardingStage.DOCUMENT_SUBMISSION,
    ],
    optionalStages: [
      OnboardingStage.PREFERENCES_SETUP,
      OnboardingStage.PAYMENT_SETUP,
    ],
    estimatedDuration: 25,
    allowSkip: false,
    requiresApproval: true,
  },
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    requiredStages: [
      OnboardingStage.ROLE_SELECTION,
      OnboardingStage.ACCOUNT_CREATION,
    ],
    optionalStages: [],
    estimatedDuration: 5,
    allowSkip: true,
    requiresApproval: false,
  },
};

export const STAGE_DISPLAY_NAMES: Record<OnboardingStage, string> = {
  [OnboardingStage.ROLE_SELECTION]: 'Role Selection',
  [OnboardingStage.ACCOUNT_CREATION]: 'Account Setup',
  [OnboardingStage.IDENTITY_VERIFICATION]: 'Identity Verification',
  [OnboardingStage.DOCUMENT_SUBMISSION]: 'Document Upload',
  [OnboardingStage.BUSINESS_REGISTRATION]: 'Business Registration',
  [OnboardingStage.VEHICLE_LISTING]: 'Vehicle Listing',
  [OnboardingStage.PREFERENCES_SETUP]: 'Preferences',
  [OnboardingStage.PAYMENT_SETUP]: 'Payment Setup',
  [OnboardingStage.ONBOARDING_COMPLETE]: 'Complete',
};

export const VALIDATION_RULES = {
  fullName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phoneNumber: {
    minLength: 10,
    maxLength: 15,
    pattern: /^\+?[1-9]\d{1,14}$/,
  },
  licenseNumber: {
    minLength: 5,
    maxLength: 20,
  },
  taxId: {
    minLength: 5,
    maxLength: 30,
  },
  businessName: {
    minLength: 2,
    maxLength: 200,
  },
} as const;
