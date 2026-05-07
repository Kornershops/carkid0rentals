'use client';

import { useState } from 'react';
import { CalendarCheck, User, Phone, Envelope, MapPin } from '@phosphor-icons/react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Container from '@/components/layout/container';
import Card from '@/components/ui/card';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

export default function ListerBookingsPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const bookings = [
    {
      id: 1,
      ref: 'BK001',
      vehicle: 'Lamborghini Urus',
      renter: 'John Doe',
      email: 'john@example.com',
      phone: '+234 800 000 0001',
      pickupDate: '2025-01-15',
      returnDate: '2025-01-18',
      status: 'active',
      revenue: 450000,
      location: 'Lagos, Nigeria',
    },
    {
      id: 2,
      ref: 'BK002',
      vehicle: 'Tesla Model S',
      renter: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+234 800 000 0002',
      pickupDate: '2025-01-16',
      returnDate: '2025-01-20',
      status: 'active',
      revenue: 200000,
      location: 'Abuja, Nigeria',
    },
    {
      id: 3,
      ref: 'BK003',
      vehicle: 'Porsche 911',
      renter: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+234 800 000 0003',
      pickupDate: '2025-01-20',
      returnDate: '2025-01-25',
      status: 'upcoming',
      revenue: 600000,
      location: 'Lagos, Nigeria',
    },
    {
      id: 4,
      ref: 'BK004',
      vehicle: 'Mercedes-Benz Sprinter',
      renter: 'ABC Logistics',
      email: 'contact@abc.com',
      phone: '+234 800 000 0004',
      pickupDate: '2025-01-05',
      returnDate: '2025-01-10',
      status: 'completed',
      revenue: 250000,
      location: 'Port Harcourt, Nigeria',
    },
  ];

  const filtered = bookings.filter(b => statusFilter === 'all' || b.status === statusFilter);

  const getStatusVariant = (status: string) => {
    if (status === 'active') return 'success';
    if (status === 'upcoming') return 'info';
    if (status === 'completed') return 'neutral';
    return 'warning';
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="lg">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-neutral-900 mb-2">Bookings</h1>
            <p className="text-neutral-600">Manage your vehicle bookings</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">All Bookings</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </Select>
            <p className="text-sm text-neutral-600">
              {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
            {filtered.map(booking => (
              <Card key={booking.id}>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-neutral-900">{booking.vehicle}</h3>
                          <Badge variant={getStatusVariant(booking.status)} size="sm">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600">Ref: {booking.ref}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-neutral-900">₦{booking.revenue.toLocaleString()}</p>
                        <p className="text-xs text-neutral-600">Total Revenue</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-neutral-600 mb-2">Renter Information</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-neutral-600" />
                            <p className="text-sm text-neutral-900">{booking.renter}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Envelope size={16} className="text-neutral-600" />
                            <p className="text-sm text-neutral-900">{booking.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-neutral-600" />
                            <p className="text-sm text-neutral-900">{booking.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-2">Trip Details</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CalendarCheck size={16} className="text-neutral-600" />
                            <p className="text-sm text-neutral-900">
                              {new Date(booking.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-neutral-600" />
                            <p className="text-sm text-neutral-900">{booking.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Contact Renter</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                      {booking.status === 'upcoming' && (
                        <Button variant="outline" size="sm">Cancel Booking</Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <CalendarCheck size={48} weight="duotone" className="text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">No bookings found</p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
