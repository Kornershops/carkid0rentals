"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Calendar, MapPin, User, Download } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Badge } from '@/components/ui';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function BookingConfirmationPage() {
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
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Booking Not Found
              </h1>
              <Link href="/listings">
                <Button variant="primary">Browse Listings</Button>
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const bookingRef = `BK${Date.now().toString().slice(-8)}`;
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-20">
        <Container size="md">
          <div className="py-12">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle size={48} weight="fill" className="text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                Booking Request Sent!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your booking request has been sent to {listing.lister.name}. 
                You'll receive a confirmation once they accept.
              </p>
            </div>
            
            {/* Booking Details Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                  <p className="text-xl font-semibold text-gray-900">{bookingRef}</p>
                </div>
                <Badge variant="warning" size="md">
                  Pending Approval
                </Badge>
              </div>
              
              {/* Vehicle Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} weight="bold" />
                      <span>{listing.location}, {listing.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} weight="bold" />
                      <span>Listed by {listing.lister.name}</span>
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
                  <span className="text-gray-600">
                    {formatPrice(listing.pricePerDay)} × {calculateDays()} days
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(listing.pricePerDay * calculateDays())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(Math.round(listing.pricePerDay * calculateDays() * 0.1))}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-semibold text-gray-900">
                    {formatPrice(Math.round(listing.pricePerDay * calculateDays() * 1.1))}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What Happens Next?
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Lister Reviews Your Request
                    </p>
                    <p className="text-sm text-gray-600">
                      {listing.lister.name} typically responds within {listing.lister.responseTime}.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Receive Confirmation
                    </p>
                    <p className="text-sm text-gray-600">
                      You'll get an email and notification once your booking is confirmed.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Complete Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      You'll be charged only after the lister accepts your request.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Pick Up Your Vehicle
                    </p>
                    <p className="text-sm text-gray-600">
                      Meet the lister at the agreed location on {formatDate(startDate)}.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/listings" className="flex-1">
                <Button variant="secondary" size="lg" fullWidth>
                  Browse More Vehicles
                </Button>
              </Link>
              <Button variant="primary" size="lg" className="flex-1">
                <Download size={20} weight="bold" />
                Download Receipt
              </Button>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </>
  );
}
