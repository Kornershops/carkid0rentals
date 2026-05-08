"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MapPin, User, Phone, Envelope } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Input, Badge } from '@/components/ui';
import { DatePicker } from '@/components/forms';
import { ListerCard } from '@/components/lister-card';
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { useAuthGuard } from '@/lib/auth-guard';

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
  
  if (!listing) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <Container>
            <div className="py-20 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Listing Not Found
              </h1>
              <Link href="/listings">
                <Button variant="primary">Back to Listings</Button>
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  
  const calculateSubtotal = () => {
    return calculateDays() * listing.pricePerDay;
  };
  
  const calculateServiceFee = () => {
    return Math.round(calculateSubtotal() * 0.1); // 10% service fee
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateServiceFee();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to confirmation
    router.push(`/booking/confirmation?listing=${listing.id}&start=${startDate}&end=${endDate}`);
  };
  
  const isFormValid = startDate && endDate && fullName && email && phone && calculateDays() > 0;
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-20">
        <Container size="lg">
          {/* Back Button */}
          <div className="py-6">
            <Link href={`/listings/${listing.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} weight="bold" />
                Back to Listing
              </Button>
            </Link>
          </div>
          
          <div className="pb-20">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8">
              Request to Book
            </h1>
            
            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
              {/* Left Column - Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Dates */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Your Trip
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        fullWidth
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        fullWidth
                      />
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Your Information
                    </h2>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        fullWidth
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        fullWidth
                      />
                    </div>
                  </div>
                  
                  {/* Message to Lister */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Message to Lister (Optional)
                    </h2>
                    <textarea
                      className="w-full h-32 px-4 py-3 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                      placeholder="Tell the lister about your trip..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  
                  {/* Lister Info */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      You'll be renting from
                    </h2>
                    <ListerCard lister={listing.lister} showContactButton={false} />
                  </div>
                  
                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!isFormValid || isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Request to Book'}
                  </Button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    You won't be charged until the lister accepts your request.
                  </p>
                </form>
              </div>
              
              {/* Right Column - Summary */}
              <div>
                <div className="sticky top-24">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {/* Vehicle Info */}
                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} weight="bold" />
                          <span>{listing.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                      <h3 className="font-semibold text-gray-900">
                        Price Details
                      </h3>
                      
                      {calculateDays() > 0 ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {formatPrice(listing.pricePerDay)} × {calculateDays()} days
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatPrice(calculateSubtotal())}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service fee</span>
                            <span className="font-medium text-gray-900">
                              {formatPrice(calculateServiceFee())}
                            </span>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-200 flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-semibold text-gray-900">
                              {formatPrice(calculateTotal())}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Select dates to see pricing
                        </p>
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
