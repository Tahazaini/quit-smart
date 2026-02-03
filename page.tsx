'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage, DailyProgress } from '@/lib/storage';
import { getDayNumber, getTodayString } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [dayNumber, setDayNumber] = useState(1);
  const [tipOfDay, setTipOfDay] = useState('');

  useEffect(() => {
    const user = storage.getUser();
    const plan = storage.getPlan();

    if (!user || !user.onboardingComplete || !plan) {
      router.push('/onboarding');
      return;
    }

    const today = getTodayString();
    const currentDay = getDayNumber(user.startDate);
    setDayNumber(currentDay);

    let dailyProgress = storage.getDailyProgress(today);

    if (!dailyProgress && currentDay <= 21) {
      const dayPlan = plan[currentDay - 1];
      dailyProgress = {
        date: today,
        day: currentDay,
        target: dayPlan.target,
        smoked: 0,
        remaining: dayPlan.target,
      };
      storage.setDailyProgress(dailyProgress);
    }

    setProgress(dailyProgress);
    setTipOfDay(plan[currentDay - 1]?.tip || 'Keep going!');
    setLoading(false);
  }, [router]);

  const handleSmoked = () => {
    if (!progress) return;
    const updated = {
      ...progress,
      smoked: progress.smoked + 1,
      remaining: Math.max(0, progress.remaining - 1),
    };
    storage.setDailyProgress(updated);
    setProgress(updated);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to start over? This will clear all your progress.')) {
      storage.clearAll();
      router.push('/onboarding');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (dayNumber > 21) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Congratulations!</h1>
          <p className="text-gray-700 mb-2 text-lg">
            You've completed your 21-day journey!
          </p>
          <p className="text-gray-600 mb-6">
            This is a huge achievement. You've reduced your smoking and built healthier habits.
          </p>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              💡 <strong>Next steps:</strong> Consider continuing with your new habits, seeking professional support, or using nicotine replacement therapy if needed.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Start New Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8 pb-20">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">QuitSmart</h1>
              <p className="text-sm text-gray-600">Your smoking reduction coach</p>
            </div>
            <Link href="/plan" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
              View Plan →
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-semibold">Day {dayNumber} of 21</span>
              <span className="font-semibold">{Math.round((dayNumber / 21) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(dayNumber / 21) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {21 - dayNumber} days remaining
            </p>
          </div>

          {/* Today's Target - Hero Section */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
            <h2 className="text-sm font-semibold mb-2 opacity-90">Today's Target</h2>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-6xl font-bold mb-1">
                  {progress?.target}
                </div>
                <p className="text-sm opacity-90">cigarettes allowed</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{progress?.remaining}</div>
                  <div className="text-xs opacity-90">left today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 border-2 border-red-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-600">{progress?.smoked}</div>
              <div className="text-sm text-gray-600 mt-1">Smoked Today</div>
            </div>
            <div className="bg-green-50 border-2 border-green-100 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">{progress?.remaining}</div>
              <div className="text-sm text-gray-600 mt-1">Remaining</div>
            </div>
          </div>

          {/* Status Message */}
          {progress && progress.remaining === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-xl">⚠️</div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    You've reached today's limit
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Try the craving helper if you're struggling
                  </p>
                </div>
              </div>
            </div>
          )}

          {progress && progress.remaining > 0 && progress.smoked > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-xl">💪</div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800 font-medium">
                    You're doing great!
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {progress.remaining} cigarettes left for today
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSmoked}
              disabled={progress?.remaining === 0}
              className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              🚬 Smoked 1
            </button>

            <Link
              href="/craving"
              className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition text-center shadow-md hover:shadow-lg"
            >
              💭 Having a Craving?
            </Link>
          </div>
        </div>

        {/* Tip of the Day */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-2xl mr-3">💡</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Tip of the Day</h3>
              <p className="text-gray-700">{tipOfDay}</p>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-md p-5 mb-4">
          <div className="text-center">
            <p className="text-gray-700 italic mb-2">
              "The secret of change is to focus all of your energy not on fighting the old, but on building the new."
            </p>
            <p className="text-xs text-gray-600">— Socrates</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              href="/plan"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📅</span>
                <span className="text-sm font-medium text-gray-700">View Full 21-Day Plan</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
            <button
              onClick={handleReset}
              className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🔄</span>
                <span className="text-sm font-medium text-gray-700">Restart Journey</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center text-xs text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-3">
          ⚠️ <strong>Disclaimer:</strong> This app provides general guidance only and is not medical advice. 
          Consult a healthcare professional for personalized quitting support.
        </div>
      </div>
    </div>
  );
}
