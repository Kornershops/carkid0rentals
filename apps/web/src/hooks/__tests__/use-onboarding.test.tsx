/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useOnboarding } from '../use-onboarding';
import { UserRole, OnboardingStage, StageStatus } from '@/types/onboarding.types';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useOnboarding', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with null progress', () => {
      const { result } = renderHook(() => useOnboarding());
      
      waitFor(() => {
        expect(result.current.progress).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should load progress from localStorage', async () => {
      const mockProgress = {
        sessionId: 'test_123',
        userRole: UserRole.DRIVER,
        currentStage: OnboardingStage.ACCOUNT_CREATION,
        stages: [],
        completionPercentage: 20,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isComplete: false,
      };

      mockLocalStorage.setItem('carkid0_onboarding_progress_v2', JSON.stringify(mockProgress));

      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.progress).not.toBeNull();
        expect(result.current.progress?.userRole).toBe(UserRole.DRIVER);
      });
    });

    it('should handle corrupted localStorage data', async () => {
      mockLocalStorage.setItem('carkid0_onboarding_progress_v2', 'invalid json');

      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.progress).toBeNull();
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should expire old sessions', async () => {
      const expiredProgress = {
        sessionId: 'test_123',
        userRole: UserRole.DRIVER,
        currentStage: OnboardingStage.ACCOUNT_CREATION,
        stages: [],
        completionPercentage: 20,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() - 1000).toISOString(),
        isComplete: false,
      };

      mockLocalStorage.setItem('carkid0_onboarding_progress_v2', JSON.stringify(expiredProgress));

      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.progress).toBeNull();
        expect(mockLocalStorage.getItem('carkid0_onboarding_progress_v2')).toBeNull();
      });
    });
  });

  describe('initializeOnboarding', () => {
    it('should initialize onboarding with correct stages', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.initializeOnboarding(UserRole.DRIVER);
      });

      expect(result.current.progress).not.toBeNull();
      expect(result.current.progress?.userRole).toBe(UserRole.DRIVER);
      expect(result.current.progress?.currentStage).toBe(OnboardingStage.ACCOUNT_CREATION);
      expect(result.current.progress?.stages.length).toBeGreaterThan(0);
    });

    it('should generate secure sessionId', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.initializeOnboarding(UserRole.DRIVER);
      });

      expect(result.current.progress?.sessionId).toMatch(/^driver_/);
      expect(result.current.progress?.sessionId.length).toBeGreaterThan(10);
    });
  });

  describe('updateStage', () => {
    it('should update stage and calculate percentage', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.initializeOnboarding(UserRole.CUSTOMER);
      });

      const initialPercentage = result.current.progress?.completionPercentage;

      act(() => {
        result.current.updateStage(OnboardingStage.IDENTITY_VERIFICATION);
      });

      expect(result.current.progress?.currentStage).toBe(OnboardingStage.IDENTITY_VERIFICATION);
      expect(result.current.progress?.completionPercentage).toBeGreaterThan(initialPercentage || 0);
    });

    it('should mark previous stage as completed', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.initializeOnboarding(UserRole.DRIVER);
      });

      act(() => {
        result.current.updateStage(OnboardingStage.IDENTITY_VERIFICATION);
      });

      const accountCreationStage = result.current.progress?.stages.find(
        s => s.stage === OnboardingStage.ACCOUNT_CREATION
      );

      expect(accountCreationStage?.status).toBe(StageStatus.COMPLETED);
      expect(accountCreationStage?.completedAt).toBeTruthy();
    });
  });

  describe('completeOnboarding', () => {
    it('should complete onboarding and cleanup', async () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.initializeOnboarding(UserRole.CUSTOMER);
      });

      act(() => {
        result.current.completeOnboarding();
      });

      expect(result.current.progress?.isComplete).toBe(true);
      expect(result.current.progress?.completionPercentage).toBe(100);

      await waitFor(() => {
        expect(result.current.progress).toBeNull();
      }, { timeout: 2000 });
    });
  });
});
