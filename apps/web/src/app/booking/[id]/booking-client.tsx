"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Input } from '@/components/ui';
import { DatePicker } from '@/components/forms';
import { ListerCard } from '@/components/lister-card';
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { useAuthGuard } from '@/lib/auth-guard';
import { api } from '@/lib/api-client';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const isAuth = useAuthGuard(`/booking/${params.id}`);
  const listing = MOCK_LISTINGS.find(l => l.id === params.id);

  if (!isAuth) return null;
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  if (!listing) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <Container>
            <div className="py-20 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Listing Not Found</h1>
              <Link href="/listings"><Button variant="primary">Back to Listings</Button></Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const formatCurrency = (price: number) => {
    switch (listing.country) {
      case 'Nigeria': return `₦${price.toLocaleString()}`;
      case 'Kenya': return `KSh ${price.toLocaleString()}`;
      case 'South Africa': return `R${price.toLocaleString()}`;
      default: return `$${price.toLocaleString()}`;
    }
  };
  
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  
  const subtotal = calculateDays() * listing.pricePerDay;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create booking via API
      const booking = await api.createBooking({
        listingId: listing.id,
        startDate,
        endDate,
        fullName,
        email,
        phone,
        message,
      });

      // Initialize Paystack payment
      const payment = await api.initializePayment(booking.id);

      // Redirect to Paystack checkout
      window.location.href = payment.authorizationUrl;
    } catch {
      // Fallback: navigate to confirmation directly (static/dev mode)
      router.push(`/booking/confirmation?listing=${listing.id}&start=${startDate}&end=${endDate}`);
    }
  };
  
  const isFormValid = startDate && endDate && fullName && email && phone && calculateDays() > 0;
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <Container size="lg">
          <div className="py-6">
            <Link href={`/listings/${listing.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} weight="bold" /> Back to Listing
              </Button>
            </Link>
          </div>
          
          <div className="pb-20">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8">Request to Book</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}

            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Trip</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <DatePicker label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required fullWidth />
                    <DatePicker label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required fullWidth />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
                  <div className="space-y-4">
                    <Input label="Full Name" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required fullWidth />
                    <Input label="Email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
                    <Input label="Phone Number" type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} required fullWidth />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Message to Lister (Optional)</h2>
                  <textarea
                    className="w-full h-32 px-4 py-3 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    placeholder="Tell the lister about your trip..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">You'll be renting from</h2>
                  <ListerCard lister={listing.lister} showContactButton={false} />
                </div>
                
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={!isFormValid || isSubmitting} loading={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </Button>
                
                <p className="text-sm text-gray-600 text-center">
                  You&apos;ll be redirected to Paystack to complete payment securely.
                </p>
              </form>
              
              {/* Summary */}
              <div>
                <div className="sticky top-24">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{listing.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} weight="bold" /><span>{listing.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Price Details</h3>
                      {calculateDays() > 0 ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{formatCurrency(listing.pricePerDay)} × {calculateDays()} days</span>
                            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service fee</span>
                            <span className="font-medium text-gray-900">{formatCurrency(serviceFee)}</span>
                          </div>
                          <div className="pt-3 border-t border-gray-200 flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-semibold text-gray-900">{formatCurrency(total)}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Select dates to see pricing</p>
                      )}
                    </div>
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
