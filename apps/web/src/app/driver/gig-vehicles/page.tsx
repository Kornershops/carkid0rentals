"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Lightning, MapPin, MagnifyingGlass } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Input, Select, Button } from '@/components/ui';
import { ListingCard } from '@/components/listing-card';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function GigVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<string>('default');
  
  // Get only eco-gig vehicles
  const ecoGigVehicles = MOCK_LISTINGS.filter(l => l.category === 'eco-gig');
  
  // Get unique locations
  const locations = useMemo(() => {
    const locs = Array.from(new Set(ecoGigVehicles.map(l => l.location)));
    return locs.sort();
  }, []);
  
  // Filter and sort
  const filteredVehicles = useMemo(() => {
    let filtered = ecoGigVehicles;
    
    // Search
    if (searchQuery) {
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Location
    if (locationFilter !== 'all') {
      filtered = filtered.filter(v => v.location === locationFilter);
    }
    
    // Fuel type
    if (fuelTypeFilter === 'ev') {
      filtered = filtered.filter(v => v.isEV);
    } else if (fuelTypeFilter === 'petrol') {
      filtered = filtered.filter(v => !v.isEV);
    }
    
    // Sort
    if (priceSort === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (priceSort === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.pricePerDay - a.pricePerDay);
    }
    
    return filtered;
  }, [searchQuery, locationFilter, fuelTypeFilter, priceSort, ecoGigVehicles]);
  
  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...locations.map(loc => ({ value: loc, label: loc })),
  ];
  
  const fuelTypeOptions = [
    { value: 'all', label: 'All Fuel Types' },
    { value: 'ev', label: 'Electric Only' },
    { value: 'petrol', label: 'Petrol Only' },
  ];
  
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'low-high', label: 'Price: Low to High' },
    { value: 'high-low', label: 'Price: High to Low' },
  ];
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-20">
        <Container size="xl">
          {/* Page Header */}
          <div className="py-12 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Lightning size={24} weight="bold" className="text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Eco-Gig Vehicles
                </h1>
                <p className="text-lg text-gray-600">
                  {filteredVehicles.length} fuel-efficient vehicles available
                </p>
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlass
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type="text"
                    placeholder="Search by brand or model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12"
                    fullWidth
                  />
                </div>
              </div>
            </div>
            
            {/* Filter Row */}
            <div className="grid md:grid-cols-3 gap-4">
              <Select
                options={locationOptions}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                fullWidth
              />
              
              <Select
                options={fuelTypeOptions}
                value={fuelTypeFilter}
                onChange={(e) => setFuelTypeFilter(e.target.value)}
                fullWidth
              />
              
              <Select
                options={sortOptions}
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="py-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Lightning size={24} weight="fill" className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Why Choose Eco-Gig Vehicles?
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Lower fuel costs - save up to 60% on daily expenses</li>
                    <li>• Zero emissions for electric vehicles</li>
                    <li>• Perfect for ride-hailing and delivery services</li>
                    <li>• Reliable and well-maintained fleet</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="py-12">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-gray-600 mb-4">
                  No vehicles found matching your criteria.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setLocationFilter('all');
                    setFuelTypeFilter('all');
                    setPriceSort('default');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <ListingCard key={vehicle.id} listing={vehicle} />
                ))}
              </div>
            )}
          </div>
          
          {/* CTA Section */}
          <div className="py-12 border-t border-gray-200">
            <div className="bg-gray-900 rounded-lg p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Book a vehicle and start your gig journey today. Flexible terms and competitive rates.
              </p>
              <Link href="/driver/dashboard">
                <Button variant="primary" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </>
  );
}
