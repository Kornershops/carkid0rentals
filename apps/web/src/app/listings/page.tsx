"use client";

import { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlass, Faders } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Input, Select, Button } from '@/components/ui';
import { ListingCard } from '@/components/listing-card';
import { MOCK_LISTINGS, Listing } from '@/data/mock-listings';
import { api, Listing as ApiListing } from '@/lib/api-client';

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [usingApi, setUsingApi] = useState(false);

  useEffect(() => {
    api.getListings({ category: categoryFilter !== 'all' ? categoryFilter : undefined, source: sourceFilter !== 'all' ? sourceFilter : undefined })
      .then(res => {
        if (res.listings && res.listings.length > 0) {
          const mapped: Listing[] = (res.listings as ApiListing[]).map(l => ({
            id: l.id,
            title: l.title,
            brand: l.brand,
            model: l.model,
            year: l.year,
            category: l.category as Listing['category'],
            pricePerDay: l.pricePerDay,
            images: l.images,
            location: l.location,
            country: l.country,
            availability: l.availability as Listing['availability'],
            features: l.features,
            isEV: l.isEV,
            specs: {},
            lister: {
              id: l.listerId,
              name: l.listerName,
              role: l.listerRole,
              rating: 4.8,
              reviewCount: 0,
              responseTime: '< 2 hours',
              verificationStatus: 'verified' as const,
              fleetCount: 0,
              joinedDate: '2024-01',
              location: `${l.location}, ${l.country}`,
            },
          }));
          setListings(mapped);
          setUsingApi(true);
        }
      })
      .catch(() => {
        // API unavailable — keep using mock data
      });
  }, []);

  const locations = useMemo(() => {
    return Array.from(new Set(listings.map(l => l.location))).sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    let filtered = listings;

    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(listing => listing.location === locationFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(listing => listing.lister.role === sourceFilter);
    }

    if (priceSort === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (priceSort === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    return filtered;
  }, [searchQuery, categoryFilter, locationFilter, sourceFilter, priceSort, listings]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'exotic', label: 'Exotic & Premium' },
    { value: 'premium', label: 'Premium' },
    { value: 'eco-gig', label: 'Eco-Gig' },
    { value: 'heavy-haul', label: 'Heavy-Haul' },
  ];

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
    { value: 'default', label: 'Relevance' },
    { value: 'low-high', label: 'Price: Low to High' },
    { value: 'high-low', label: 'Price: High to Low' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <Container size="xl">
          <div className="py-12 border-b border-gray-200">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Browse Vehicles
            </h1>
            <p className="text-lg text-gray-600">
              {filteredListings.length} vehicles available across Africa
            </p>
          </div>

          {/* Filters */}
          <div className="py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by brand, model, or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12"
                    fullWidth
                  />
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Faders size={20} weight="bold" />
                Filters
              </Button>
            </div>

            <div className={`grid md:grid-cols-4 gap-4 mt-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <Select options={categoryOptions} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} fullWidth />
              <Select options={locationOptions} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} fullWidth />
              <Select options={sourceOptions} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} fullWidth />
              <Select options={sortOptions} value={priceSort} onChange={(e) => setPriceSort(e.target.value)} fullWidth />
            </div>
          </div>

          {/* Results */}
          <div className="py-12">
            {filteredListings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-gray-600 mb-4">No vehicles found matching your criteria.</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setLocationFilter('all');
                    setSourceFilter('all');
                    setPriceSort('default');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
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
