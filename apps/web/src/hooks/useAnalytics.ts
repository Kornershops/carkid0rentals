'use client';

import { useCallback } from 'react';

type EventType = 
  | 'onboarding_started'
  | 'onboarding_step_completed'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'tooltip_viewed'
  | 'feature_tour_started'
  | 'first_booking_guide_viewed'
  | 'celebration_shown';

interface EventProperties {
  step?: string;
  progress?: number;
  tooltip_content?: string;
  celebration_type?: string;
  [key: string]: any;
}

export function useAnalytics() {
  const trackEvent = useCallback((event: EventType, properties?: EventProperties) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }

    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }

    // Send to backend for server-side tracking
    fetch('/api/v1/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties, timestamp: new Date().toISOString() })
    }).catch(() => {}); // Silent fail
  }, []);

  const trackOnboardingStart = useCallback(() => {
    trackEvent('onboarding_started', { timestamp: Date.now() });
  }, [trackEvent]);

  const trackOnboardingStep = useCallback((step: string, progress: number) => {
    trackEvent('onboarding_step_completed', { step, progress });
  }, [trackEvent]);

  const trackOnboardingComplete = useCallback((duration: number) => {
    trackEvent('onboarding_completed', { duration_seconds: duration });
  }, [trackEvent]);

  const trackTooltipView = useCallback((content: string) => {
    trackEvent('tooltip_viewed', { tooltip_content: content });
  }, [trackEvent]);

  const trackCelebration = useCallback((type: string) => {
    trackEvent('celebration_shown', { celebration_type: type });
  }, [trackEvent]);

  return {
    trackEvent,
    trackOnboardingStart,
    trackOnboardingStep,
    trackOnboardingComplete,
    trackTooltipView,
    trackCelebration
  };
}
