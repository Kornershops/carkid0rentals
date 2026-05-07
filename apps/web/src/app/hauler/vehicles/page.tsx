'use client';

import { useState } from 'react';
import { MagnifyingGlass, MapPin, SortAscending, Truck } from '@phosphor-icons/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ListingCard } from '@/components/listing-card';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function HaulerVehiclesPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');

  const heavyHaulVehicles = MOCK_LISTINGS.filter(v => v.category === 'heavy-haul');

  const filtered = heavyHaulVehicles
    .filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase())
    )
    .filter(v => location === 'all' || v.location === location)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      return 0;
    });

  const locations = Array.from(new Set(heavyHaulVehicles.map(v => v.location)));

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="lg">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <Truck size={24} weight="duotone" className="text-neutral-900 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-medium text-neutral-900 mb-2">Heavy-Haul Vehicles</h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Commercial-grade trucks and vans for cargo transport, moving, and logistics. All vehicles include cargo insurance and 24/7 roadside assistance.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <Input
                icon={<MagnifyingGlass size={20} />}
                placeholder="Search by brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              icon={<MapPin size={20} />}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </Select>
            <Select
              icon={<SortAscending size={20} />}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </Select>
          </div>

          <p className="text-sm text-neutral-600 mb-6">
            {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} available
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(vehicle => (
              <ListingCard key={vehicle.id} listing={vehicle} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Truck size={48} weight="duotone" className="text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">No vehicles found matching your criteria</p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
