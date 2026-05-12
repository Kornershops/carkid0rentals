/**
 * @fileoverview Analytics Tracking for Onboarding System
 * @module lib/analytics
 */

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
}

class OnboardingAnalytics {
  private queue: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
    }
  }

  private track(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
      timestamp: new Date().toISOString(),
    };

    this.queue.push(analyticsEvent);

    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }

    // Send to backend
    this.sendToBackend(analyticsEvent);
  }

  private async sendToBackend(event: AnalyticsEvent) {
    try {
      await fetch('/api/v1/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  // Onboarding Events
  roleSelected(role: string, subType?: string) {
    this.track('onboarding_role_selected', {
      role,
      subType: subType || 'none',
    });
  }

  stageStarted(stage: string, role: string) {
    this.track('onboarding_stage_started', {
      stage,
      role,
    });
  }

  stageCompleted(stage: string, role: string, duration: number, attemptCount: number = 1) {
    this.track('onboarding_stage_completed', {
      stage,
      role,
      duration, // seconds
      attemptCount,
    });
  }

  stageFailed(stage: string, role: string, error: string) {
    this.track('onboarding_stage_failed', {
      stage,
      role,
      error,
    });
  }

  onboardingCompleted(role: string, totalTime: number, stagesCompleted: number) {
    this.track('onboarding_completed', {
      role,
      totalTime, // seconds
      stagesCompleted,
    });
  }

  onboardingAbandoned(stage: string, role: string, completionPercentage: number, timeSpent: number) {
    this.track('onboarding_abandoned', {
      stage,
      role,
      completionPercentage,
      timeSpent, // seconds
    });
  }

  onboardingResumed(stage: string, role: string, daysSinceStart: number) {
    this.track('onboarding_resumed', {
      stage,
      role,
      daysSinceStart,
    });
  }

  // User Actions
  buttonClicked(buttonName: string, context: string) {
    this.track('button_clicked', {
      buttonName,
      context,
    });
  }

  formSubmitted(formName: string, success: boolean) {
    this.track('form_submitted', {
      formName,
      success,
    });
  }

  errorOccurred(errorType: string, errorMessage: string, context: string) {
    this.track('error_occurred', {
      errorType,
      errorMessage,
      context,
    });
  }

  // Get queued events (for debugging)
  getQueue(): AnalyticsEvent[] {
    return [...this.queue];
  }

  // Clear queue
  clearQueue() {
    this.queue = [];
  }
}

// Singleton instance
export const analytics = new OnboardingAnalytics();

// Helper hook for React components
export function useAnalytics() {
  return analytics;
}
