'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlass, Truck } from '@phosphor-icons/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Input, Select, Button } from '@/components/ui';
import { ListingCard } from '@/components/listing-card';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function HaulerVehiclesPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const heavyHaulVehicles = MOCK_LISTINGS.filter(v => v.category === 'heavy-haul');

  const locations = useMemo(() => {
    return Array.from(new Set(heavyHaulVehicles.map(v => v.location))).sort();
  }, [heavyHaulVehicles]);

  const filtered = useMemo(() => {
    let result = heavyHaulVehicles;

    if (search) {
      result = result.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location !== 'all') {
      result = result.filter(v => v.location === location);
    }

    if (sourceFilter !== 'all') {
      result = result.filter(v => v.lister.role === sourceFilter);
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    return result;
  }, [search, location, sourceFilter, sortBy, heavyHaulVehicles]);

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...locations.map(loc => ({ value: loc, label: loc })),
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'admin', label: 'CarKid0 Official' },
    { value: 'lister', label: 'Third-Party Fleet' },
  ];

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <Container size="xl">
          {/* Header */}
          <div className="py-12 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck size={24} weight="bold" className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Heavy-Haul Vehicles</h1>
                <p className="text-lg text-gray-600">{filtered.length} commercial vehicles available</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by brand or model..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12"
                    fullWidth
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Select options={locationOptions} value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
              <Select options={sourceOptions} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} fullWidth />
              <Select options={sortOptions} value={sortBy} onChange={(e) => setSortBy(e.target.value)} fullWidth />
            </div>
          </div>

          {/* Info Banner */}
          <div className="py-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Truck size={24} weight="duotone" className="text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Commercial-Grade Fleet</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All vehicles include cargo insurance and 24/7 roadside assistance</li>
                    <li>• GPS tracking and fleet management included</li>
                    <li>• Flexible rental terms for logistics operations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="py-12">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Truck size={48} weight="duotone" className="text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-4">No vehicles found matching your criteria.</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('');
                    setLocation('all');
                    setSourceFilter('all');
                    setSortBy('default');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(vehicle => (
                  <ListingCard key={vehicle.id} listing={vehicle} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
