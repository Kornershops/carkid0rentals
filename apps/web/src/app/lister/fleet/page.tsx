'use client';

import { useState } from 'react';
import { MagnifyingGlass, Plus, PencilSimple, Trash, Eye } from '@phosphor-icons/react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function ListerFleetPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const myVehicles = MOCK_LISTINGS.map(v => ({
    ...v,
    status: Math.random() > 0.3 ? 'available' : 'rented',
    bookings: Math.floor(Math.random() * 20) + 5,
  }));

  const filtered = myVehicles
    .filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase())
    )
    .filter(v => category === 'all' || v.category === category);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-medium text-neutral-900 mb-2">Fleet Management</h1>
              <p className="text-neutral-600">Manage your vehicle listings</p>
            </div>
            <Link href="/lister/fleet/add">
              <Button>
                <Plus size={20} weight="bold" />
                Add Vehicle
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <Input
                placeholder="Search vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-10 px-4 pr-10 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 appearance-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="exotic">Exotic</option>
              <option value="premium">Premium</option>
              <option value="eco-gig">Eco-Gig</option>
              <option value="heavy-haul">Heavy-Haul</option>
            </select>
          </div>

          <p className="text-sm text-neutral-600 mb-6">
            {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} in fleet
          </p>

          <div className="space-y-4">
            {filtered.map(vehicle => (
              <Card key={vehicle.id}>
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-neutral-900">{vehicle.name}</h3>
                          <Badge variant={vehicle.status === 'available' ? 'success' : 'warning'} size="sm">
                            {vehicle.status === 'available' ? 'Available' : 'Rented'}
                          </Badge>
                          <Badge variant="neutral" size="sm">{vehicle.category}</Badge>
                        </div>
                        <p className="text-sm text-neutral-600">{vehicle.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-neutral-900">₦{vehicle.pricePerDay.toLocaleString()}</p>
                        <p className="text-xs text-neutral-600">per day</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Total Bookings</p>
                        <p className="text-sm font-medium text-neutral-900">{vehicle.bookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Rating</p>
                        <p className="text-sm font-medium text-neutral-900">{vehicle.rating} ★</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Year</p>
                        <p className="text-sm font-medium text-neutral-900">{vehicle.year}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Transmission</p>
                        <p className="text-sm font-medium text-neutral-900">{vehicle.transmission}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/listings/${vehicle.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye size={16} weight="bold" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <PencilSimple size={16} weight="bold" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash size={16} weight="bold" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
