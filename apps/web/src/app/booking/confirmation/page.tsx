"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Calendar, MapPin, ShieldCheck } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Badge } from '@/components/ui';
import { MOCK_LISTINGS } from '@/data/mock-listings';

function formatCurrency(price: number, country: string) {
  switch (country) {
    case 'Nigeria': return `₦${price.toLocaleString()}`;
    case 'Kenya': return `KSh ${price.toLocaleString()}`;
    case 'South Africa': return `R${price.toLocaleString()}`;
    default: return `$${price.toLocaleString()}`;
  }
}

export default function BookingConfirmationPage() {
  return (
    <Suspense>
      <BookingConfirmationContent />
    </Suspense>
  );
}

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing');
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  const listing = MOCK_LISTINGS.find(l => l.id === listingId);

  if (!listing || !startDate || !endDate) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <Container>
            <div className="py-20 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Booking Not Found</h1>
              <Link href="/listings"><Button variant="primary">Browse Listings</Button></Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const isAdmin = listing.lister.role === 'admin';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const calculateDays = () => {
    return Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();
  const subtotal = listing.pricePerDay * days;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;
  const bookingRef = `BK${Date.now().toString().slice(-8)}`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <Container size="md">
          <div className="py-12">
            {/* Success */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle size={48} weight="fill" className="text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                {isAdmin ? 'Booking Confirmed!' : 'Booking Request Sent!'}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {isAdmin
                  ? 'Your booking has been confirmed by CarKid0. You\'re all set.'
                  : `Your booking request has been sent to ${listing.lister.name}. You'll receive a confirmation once they accept.`}
              </p>
            </div>

            {/* Booking Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                  <p className="text-xl font-semibold text-gray-900">{bookingRef}</p>
                </div>
                <Badge variant={isAdmin ? 'success' : 'warning'} size="md">
                  {isAdmin ? 'Confirmed' : 'Pending Approval'}
                </Badge>
              </div>

              {/* Vehicle Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} weight="bold" />
                      <span>{listing.location}, {listing.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <>
                          <ShieldCheck size={16} weight="fill" className="text-gray-900" />
                          <span className="font-medium text-gray-900">CarKid0 Official</span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">
                            {listing.lister.name.charAt(0)}
                          </div>
                          <span>{listing.lister.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Pick-up</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} weight="bold" className="text-gray-400" />
                    <p className="font-medium text-gray-900">{formatDate(startDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Drop-off</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} weight="bold" className="text-gray-400" />
                    <p className="font-medium text-gray-900">{formatDate(endDate)}</p>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{formatCurrency(listing.pricePerDay, listing.country)} × {days} days</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal, listing.country)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium text-gray-900">{formatCurrency(serviceFee, listing.country)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-semibold text-gray-900">{formatCurrency(total, listing.country)}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
              <ol className="space-y-4">
                {isAdmin ? (
                  <>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Complete Payment</p>
                        <p className="text-sm text-gray-600">Proceed to payment to secure your booking.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Receive Pickup Details</p>
                        <p className="text-sm text-gray-600">You'll get pickup location and instructions via email.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Pick Up Your Vehicle</p>
                        <p className="text-sm text-gray-600">Collect your vehicle on {formatDate(startDate)}.</p>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Lister Reviews Your Request</p>
                        <p className="text-sm text-gray-600">{listing.lister.name} typically responds within {listing.lister.responseTime}.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Receive Confirmation</p>
                        <p className="text-sm text-gray-600">You'll get an email and notification once your booking is confirmed.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Complete Payment</p>
                        <p className="text-sm text-gray-600">You'll be charged only after the lister accepts your request.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Pick Up Your Vehicle</p>
                        <p className="text-sm text-gray-600">Meet the lister at the agreed location on {formatDate(startDate)}.</p>
                      </div>
                    </li>
                  </>
                )}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/customer" className="flex-1">
                <Button variant="primary" size="lg" fullWidth>Go to My Bookings</Button>
              </Link>
              <Link href="/listings" className="flex-1">
                <Button variant="secondary" size="lg" fullWidth>Browse More Vehicles</Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
