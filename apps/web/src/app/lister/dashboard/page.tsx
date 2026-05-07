'use client';

import { CurrencyCircleDollar, Car, CalendarCheck, TrendUp, Plus } from '@phosphor-icons/react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stats } from '@/components/data/stats';
import { Badge } from '@/components/ui/badge';

export default function ListerDashboardPage() {
  const stats = [
    { label: 'Monthly Revenue', value: '₦1,240,000', trend: 12, icon: CurrencyCircleDollar },
    { label: 'Active Bookings', value: '8', trend: 3, icon: CalendarCheck },
    { label: 'Fleet Size', value: '12', trend: 0, icon: Car },
    { label: 'Avg. Utilization', value: '67%', trend: 5, icon: TrendUp },
  ];

  const activeBookings = [
    { id: 1, vehicle: 'Lamborghini Urus', renter: 'John Doe', dates: 'Jan 15 - Jan 18', status: 'active', revenue: 450000 },
    { id: 2, vehicle: 'Tesla Model S', renter: 'Jane Smith', dates: 'Jan 16 - Jan 20', status: 'active', revenue: 200000 },
    { id: 3, vehicle: 'Mercedes-Benz Sprinter', renter: 'ABC Logistics', dates: 'Jan 14 - Jan 21', status: 'active', revenue: 350000 },
  ];

  const recentMessages = [
    { id: 1, from: 'John Doe', vehicle: 'Lamborghini Urus', message: 'Can I extend the booking by 2 days?', time: '2h ago', unread: true },
    { id: 2, from: 'Jane Smith', vehicle: 'Tesla Model S', message: 'Where is the charging cable located?', time: '5h ago', unread: true },
    { id: 3, from: 'Mike Johnson', vehicle: 'Porsche 911', message: 'Thanks for the smooth rental experience!', time: '1d ago', unread: false },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-medium text-neutral-900 mb-2">Dashboard</h1>
              <p className="text-neutral-600">Manage your fleet and bookings</p>
            </div>
            <Link href="/lister/fleet/add">
              <Button>
                <Plus size={20} weight="bold" />
                Add Vehicle
              </Button>
            </Link>
          </div>

          <Stats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-neutral-900">Active Bookings</h2>
                  <Link href="/lister/bookings">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {activeBookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-neutral-900">{booking.vehicle}</h3>
                          <Badge variant="success" size="sm">Active</Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">{booking.renter}</p>
                        <p className="text-xs text-neutral-500">{booking.dates}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-neutral-900">₦{booking.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-neutral-900">Fleet Overview</h2>
                  <Link href="/lister/fleet">
                    <Button variant="ghost" size="sm">Manage Fleet</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-medium text-neutral-900 mb-1">5</p>
                    <p className="text-xs text-neutral-600">Exotic</p>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-medium text-neutral-900 mb-1">3</p>
                    <p className="text-xs text-neutral-600">Premium</p>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-medium text-neutral-900 mb-1">2</p>
                    <p className="text-xs text-neutral-600">Eco-Gig</p>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <p className="text-2xl font-medium text-neutral-900 mb-1">2</p>
                    <p className="text-xs text-neutral-600">Heavy-Haul</p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-neutral-900">Messages</h2>
                  <Link href="/lister/messages">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentMessages.map(msg => (
                    <div key={msg.id} className={`p-3 rounded-lg border ${msg.unread ? 'bg-neutral-50 border-neutral-300' : 'border-neutral-200'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-neutral-900">{msg.from}</p>
                        <p className="text-xs text-neutral-500">{msg.time}</p>
                      </div>
                      <p className="text-xs text-neutral-600 mb-2">{msg.vehicle}</p>
                      <p className="text-sm text-neutral-700 line-clamp-2">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
