'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, ShieldCheck, CurrencyCircleDollar } from '@phosphor-icons/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { useStore } from '@/store/use-store';

export default function ListerRegistrationPage() {
  const router = useRouter();
  const { isAuthenticated, setToken } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/auth/register/lister');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.updateRole('lister');
      setToken(res.token);
      router.push('/lister/fleet/add');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upgrade account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="sm">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">List Your Fleet</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Earn income by listing your vehicles on CarKid0. Reach renters across Africa.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid gap-6 mb-12">
            {[
              { icon: CurrencyCircleDollar, title: 'Earn daily income', desc: 'Set your own prices. Get paid via Paystack directly to your account.' },
              { icon: ShieldCheck, title: 'Verified renters only', desc: 'Every renter completes KYC. Full insurance coverage on all bookings.' },
              { icon: Truck, title: 'Fleet management tools', desc: 'Track bookings, manage availability, and monitor your vehicles in one dashboard.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50">
                  <Icon size={24} weight="regular" className="text-gray-900 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Requirements</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Valid government-issued ID (KYC verified)</li>
              <li>• Vehicle registration documents</li>
              <li>• Proof of insurance</li>
              <li>• Clear photos of your vehicle (minimum 2)</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <Button onClick={handleUpgrade} disabled={loading} className="w-full">
            {loading ? 'Upgrading...' : isAuthenticated ? 'Become a Lister' : 'Sign in to Get Started'}
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already a lister? <Link href="/lister/fleet" className="text-gray-900 underline">Go to Fleet Management</Link>
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
