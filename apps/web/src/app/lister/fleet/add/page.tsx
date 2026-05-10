'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { useStore } from '@/store/use-store';

const CATEGORIES = [
  { value: 'exotic', label: 'Exotic' },
  { value: 'premium', label: 'Premium' },
  { value: 'eco-gig', label: 'Eco-Gig' },
  { value: 'heavy-haul', label: 'Heavy-Haul' },
];

const COUNTRIES = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Egypt', label: 'Egypt' },
];

const TRANSMISSIONS = [
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Manual', label: 'Manual' },
];

const FUEL_TYPES = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
];

export default function AddListingPage() {
  const router = useRouter();
  const { isAuthenticated } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'eco-gig',
    pricePerDay: 0,
    location: '',
    country: 'Nigeria',
    features: '',
    imageUrls: '',
    isEV: false,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
  });

  const update = (field: string, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/lister/fleet/add');
      return;
    }

    if (!form.title || !form.brand || !form.model || !form.pricePerDay || !form.location) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const images = form.imageUrls
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean);

      const features = form.features
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      await api.createListing({
        title: form.title,
        brand: form.brand,
        model: form.model,
        year: form.year,
        category: form.category,
        pricePerDay: form.pricePerDay,
        images: images.length ? images : ['/fleet/cars/placeholder.png'],
        location: form.location,
        country: form.country,
        features,
        isEV: form.isEV,
      });

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container size="sm">
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✓</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">Listing Submitted</h1>
              <p className="text-gray-600 mb-8">
                Your vehicle has been submitted for review. Admin listings go live immediately.
                Third-party listings will be visible after approval.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push('/lister/fleet')}>View Fleet</Button>
                <Button variant="secondary" onClick={() => { setSuccess(false); setForm({ ...form, title: '', brand: '', model: '', pricePerDay: 0, features: '', imageUrls: '' }); }}>
                  Add Another
                </Button>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="sm">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Add Vehicle</h1>
          <p className="text-gray-600 mb-8">List a vehicle on the CarKid0 platform.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Info */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Vehicle Details</h2>
              <Input placeholder="Listing title *" value={form.title} onChange={e => update('title', e.target.value)} fullWidth />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Brand *" value={form.brand} onChange={e => update('brand', e.target.value)} fullWidth />
                <Input placeholder="Model *" value={form.model} onChange={e => update('model', e.target.value)} fullWidth />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input type="number" placeholder="Year" value={form.year} onChange={e => update('year', parseInt(e.target.value))} fullWidth />
                <Select options={CATEGORIES} value={form.category} onChange={e => update('category', e.target.value)} fullWidth />
                <Select options={FUEL_TYPES} value={form.fuelType} onChange={e => update('fuelType', e.target.value)} fullWidth />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input type="number" placeholder="Seats" value={form.seats} onChange={e => update('seats', parseInt(e.target.value))} fullWidth />
                <Select options={TRANSMISSIONS} value={form.transmission} onChange={e => update('transmission', e.target.value)} fullWidth />
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.isEV} onChange={e => update('isEV', e.target.checked)} className="rounded" />
                  Electric Vehicle
                </label>
              </div>
            </section>

            {/* Pricing & Location */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Pricing & Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Price per day *" value={form.pricePerDay || ''} onChange={e => update('pricePerDay', parseInt(e.target.value) || 0)} fullWidth />
                <Select options={COUNTRIES} value={form.country} onChange={e => update('country', e.target.value)} fullWidth />
              </div>
              <Input placeholder="City / Location *" value={form.location} onChange={e => update('location', e.target.value)} fullWidth />
            </section>

            {/* Features & Images */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Features & Images</h2>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Features (comma-separated)</label>
                <Input placeholder="e.g. Sunroof, Leather Seats, GPS" value={form.features} onChange={e => update('features', e.target.value)} fullWidth />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Image URLs (one per line)</label>
                <textarea
                  className="w-full h-28 px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  placeholder={"/fleet/cars/my-vehicle/front.jpg\n/fleet/cars/my-vehicle/side.jpg"}
                  value={form.imageUrls}
                  onChange={e => update('imageUrls', e.target.value)}
                />
              </div>
            </section>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Submitting...' : 'Submit Listing'}
            </Button>
          </form>
        </Container>
      </main>
      <Footer />
    </>
  );
}
