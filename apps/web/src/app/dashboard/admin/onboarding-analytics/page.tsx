"use client";

import { useEffect, useState } from 'react';

interface OnboardingAnalytics {
  totalInProgress: number;
  totalCompleted: number;
  totalAbandoned: number;
  avgCompletion: number;
  roleBreakdown: Array<{ userRole: string; count: number }>;
  stageBreakdown: Array<{ currentStage: string; count: number }>;
}

export default function OnboardingAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<OnboardingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/v1/onboarding/analytics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-8"><p className="text-red-600">Failed to load analytics</p></div>;
  }

  const completionRate = analytics.totalCompleted + analytics.totalInProgress > 0
    ? (analytics.totalCompleted / (analytics.totalCompleted + analytics.totalInProgress) * 100).toFixed(1)
    : 0;

  const abandonmentRate = analytics.totalAbandoned + analytics.totalCompleted > 0
    ? (analytics.totalAbandoned / (analytics.totalAbandoned + analytics.totalCompleted) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Onboarding Analytics</h1>
        <p className="text-gray-600">Monitor user onboarding progress and completion rates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalInProgress}</p>
          <p className="text-xs text-gray-500 mt-2">Active sessions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{analytics.totalCompleted}</p>
          <p className="text-xs text-gray-500 mt-2">{completionRate}% completion rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Abandoned</p>
          <p className="text-3xl font-bold text-red-600">{analytics.totalAbandoned}</p>
          <p className="text-xs text-gray-500 mt-2">{abandonmentRate}% abandonment</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Avg Completion</p>
          <p className="text-3xl font-bold text-purple-600">{analytics.avgCompletion.toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-2">Average progress</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Onboarding by Role</h2>
        <div className="space-y-3">
          {analytics.roleBreakdown.map((role) => {
            const total = analytics.roleBreakdown.reduce((sum, r) => sum + r.count, 0);
            const percentage = total > 0 ? (role.count / total * 100).toFixed(1) : 0;
            
            return (
              <div key={role.userRole} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium capitalize">{role.userRole}</div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full flex items-center justify-end px-3 text-white text-sm font-medium"
                      style={{ width: `${percentage}%` }}
                    >
                      {role.count > 0 && `${role.count}`}
                    </div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Drop-off by Stage</h2>
        <p className="text-sm text-gray-600 mb-4">Where users are currently stuck</p>
        <div className="space-y-3">
          {analytics.stageBreakdown.map((stage) => {
            const total = analytics.stageBreakdown.reduce((sum, s) => sum + s.count, 0);
            const percentage = total > 0 ? (stage.count / total * 100).toFixed(1) : 0;
            
            return (
              <div key={stage.currentStage} className="flex items-center gap-4">
                <div className="w-48 text-sm font-medium">{stage.currentStage.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full flex items-center justify-end px-3 text-white text-sm font-medium"
                      style={{ width: `${percentage}%` }}
                    >
                      {stage.count > 0 && `${stage.count}`}
                    </div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchAnalytics}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
