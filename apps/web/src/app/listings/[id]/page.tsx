"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Lightning, MapPin, Calendar, Users, Gauge } from '@phosphor-icons/react';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Badge } from '@/components/ui';
import { DatePicker } from '@/components/forms';
import { ListerCard } from '@/components/lister-card';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function ListingDetailPage() {
  const params = useParams();
  const listing = MOCK_LISTINGS.find(l => l.id === params.id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
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
                <Button variant="primary">
                  Back to Listings
                </Button>
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
  
  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * listing.pricePerDay : 0;
  };
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-20">
        <Container size="xl">
          {/* Back Button */}
          <div className="py-6">
            <Link href="/listings">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} weight="bold" />
                Back to Listings
              </Button>
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 pb-20">
            {/* Left Column */}
            <div>
              {/* Image Gallery */}
              <div className="mb-8">
                <div className="relative aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={listing.images[selectedImage]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-gray-900' : 'border-transparent'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${listing.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Title & Meta */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" size="sm">
                    {listing.category.toUpperCase()}
                  </Badge>
                  {listing.isEV && (
                    <Badge variant="success" size="sm">
                      <Lightning size={12} weight="fill" />
                      EV
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                  {listing.title}
                </h1>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <span>{listing.brand} • {listing.year}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} weight="bold" />
                    <span>{listing.location}, {listing.country}</span>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature, index) => (
                    <Badge key={index} variant="default" size="md">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Specifications */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Specifications
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {listing.specs.seats && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Users size={24} weight="bold" className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Seats</p>
                        <p className="font-semibold text-gray-900">{listing.specs.seats}</p>
                      </div>
                    </div>
                  )}
                  
                  {listing.specs.transmission && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Gauge size={24} weight="bold" className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Transmission</p>
                        <p className="font-semibold text-gray-900">{listing.specs.transmission}</p>
                      </div>
                    </div>
                  )}
                  
                  {listing.specs.fuelType && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Lightning size={24} weight="bold" className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Fuel Type</p>
                        <p className="font-semibold text-gray-900">{listing.specs.fuelType}</p>
                      </div>
                    </div>
                  )}
                  
                  {listing.specs.hp && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Gauge size={24} weight="bold" className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Horsepower</p>
                        <p className="font-semibold text-gray-900">{listing.specs.hp} HP</p>
                      </div>
                    </div>
                  )}
                  
                  {listing.specs.payload && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Gauge size={24} weight="bold" className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Payload</p>
                        <p className="font-semibold text-gray-900">{listing.specs.payload} kg</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Lister Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Listed By
                </h2>
                <ListerCard lister={listing.lister} />
              </div>
            </div>
            
            {/* Right Column - Booking */}
            <div>
              <div className="sticky top-24">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="mb-6">
                    <p className="text-3xl font-semibold text-gray-900 mb-1">
                      {formatPrice(listing.pricePerDay)}
                    </p>
                    <p className="text-sm text-gray-600">per day</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      fullWidth
                    />
                    
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      fullWidth
                    />
                  </div>
                  
                  {startDate && endDate && calculateTotal() > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {formatPrice(listing.pricePerDay)} × {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!startDate || !endDate || calculateTotal() === 0}
                  >
                    Request to Book
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    You won't be charged yet
                  </p>
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
