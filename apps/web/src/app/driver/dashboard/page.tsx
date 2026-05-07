"use client";

import Link from 'next/link';
import { Car, CurrencyDollar, Calendar, TrendUp, Lightning, MapPin } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Badge } from '@/components/ui';
import { Stats } from '@/components/data/stats';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function DriverDashboardPage() {
  const ecoGigVehicles = MOCK_LISTINGS.filter(l => l.category === 'eco-gig' && l.availability === 'available');
  
  const stats = [
    {
      label: 'Today\'s Earnings',
      value: '$45',
      change: { value: 12, trend: 'up' as const },
      icon: CurrencyDollar,
    },
    {
      label: 'This Week',
      value: '$280',
      change: { value: 8, trend: 'up' as const },
      icon: TrendUp,
    },
    {
      label: 'Active Bookings',
      value: '2',
      icon: Calendar,
    },
    {
      label: 'Available Vehicles',
      value: ecoGigVehicles.length.toString(),
      icon: Car,
    },
  ];
  
  const activeBookings = [
    {
      id: '1',
      vehicle: 'Wuling Bingo EV',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      earnings: '$70',
      status: 'active',
    },
    {
      id: '2',
      vehicle: 'Toyota Corolla 2017',
      startDate: '2024-01-18',
      endDate: '2024-01-20',
      earnings: '$84',
      status: 'active',
    },
  ];
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-20">
        <Container size="xl">
          <div className="py-12">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                Welcome back, Driver!
              </h1>
              <p className="text-lg text-gray-600">
                Here's your earnings and activity overview
              </p>
            </div>
            
            {/* Stats */}
            <Stats stats={stats} columns={4} className="mb-12" />
            
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Active Bookings */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Active Bookings
                    </h2>
                    <Link href="/driver/bookings">
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                  
                  {activeBookings.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                      <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">No active bookings</p>
                      <Link href="/driver/gig-vehicles">
                        <Button variant="primary">
                          Browse Vehicles
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBookings.map((booking) => (
                        <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {booking.vehicle}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>
                                  {new Date(booking.startDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                  {' - '}
                                  {new Date(booking.endDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                                <span>•</span>
                                <span className="font-semibold text-green-600">
                                  {booking.earnings}
                                </span>
                              </div>
                            </div>
                            <Badge variant="success">Active</Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" className="flex-1">
                              View Details
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1">
                              Contact Lister
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Quick Actions */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Quick Actions
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/driver/gig-vehicles">
                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                          <Lightning size={24} weight="bold" className="text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Browse Gig Vehicles
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Find eco-friendly vehicles for your next trip
                        </p>
                        <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                          View Vehicles →
                        </span>
                      </div>
                    </Link>
                    
                    <Link href="/driver/earnings">
                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <CurrencyDollar size={24} weight="bold" className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          View Earnings
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Track your income and payment history
                        </p>
                        <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                          View Details →
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Available Vehicles */}
              <div>
                <div className="sticky top-24">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Available Near You
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      {ecoGigVehicles.slice(0, 3).map((vehicle) => (
                        <Link key={vehicle.id} href={`/driver/gig-vehicles`}>
                          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                {vehicle.brand} {vehicle.model}
                              </h3>
                              {vehicle.isEV && (
                                <Badge variant="success" size="sm">
                                  <Lightning size={10} weight="fill" />
                                  EV
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin size={14} weight="bold" />
                                <span>{vehicle.location}</span>
                              </div>
                              <span className="font-semibold text-gray-900">
                                ${vehicle.pricePerDay}/day
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <Link href="/driver/gig-vehicles">
                      <Button variant="primary" size="md" fullWidth>
                        View All Vehicles
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </>
  );
}
