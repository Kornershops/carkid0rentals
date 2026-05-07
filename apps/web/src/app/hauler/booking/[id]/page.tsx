'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, User, Envelope, Phone, Package, Ruler, Barcode, ArrowRight } from '@phosphor-icons/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function HaulerBookingPage() {
  const params = useParams();
  const router = useRouter();
  const vehicle = MOCK_LISTINGS.find(v => v.id === params.id);

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [cargoDescription, setCargoDescription] = useState('');

  if (!vehicle) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container>
            <p className="text-center text-neutral-600">Vehicle not found</p>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const days = calculateDays();
  const subtotal = days * vehicle.pricePerDay;
  const serviceFee = subtotal * 0.15;
  const cargoInsurance = days * 50;
  const total = subtotal + serviceFee + cargoInsurance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/hauler/booking/confirmation');
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="md">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-neutral-900 mb-2">Commercial Booking</h1>
            <p className="text-neutral-600">Complete your heavy-haul vehicle reservation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <h2 className="text-lg font-medium text-neutral-900 mb-4">Trip Dates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Pickup Date"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                    <Input
                      label="Return Date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                    />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-medium text-neutral-900 mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <Input
                      label="Company Name (Optional)"
                      placeholder="ABC Logistics Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-medium text-neutral-900 mb-4">Cargo Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Cargo Type</label>
                      <select
                        className="h-10 px-4 pr-10 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 appearance-none cursor-pointer w-full"
                        value={cargoType}
                        onChange={(e) => setCargoType(e.target.value)}
                        required
                      >
                        <option value="">Select cargo type</option>
                        <option value="general">General Goods</option>
                        <option value="furniture">Furniture & Appliances</option>
                        <option value="construction">Construction Materials</option>
                        <option value="equipment">Equipment & Machinery</option>
                        <option value="food">Food & Beverages</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Input
                      label="Estimated Weight (kg)"
                      type="number"
                      placeholder="1000"
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(e.target.value)}
                      required
                    />
                    <Textarea
                      label="Cargo Description"
                      placeholder="Provide details about your cargo, special handling requirements, or delivery instructions..."
                      value={cargoDescription}
                      onChange={(e) => setCargoDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                </Card>

                <Button type="submit" fullWidth disabled={days === 0}>
                  Confirm Booking
                  <ArrowRight size={20} weight="bold" />
                </Button>
              </form>
            </div>

            <div>
              <Card className="sticky top-24">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Booking Summary</h2>
                
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-neutral-900">{vehicle.name}</h3>
                  <p className="text-sm text-neutral-600">{vehicle.location}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      ₦{vehicle.pricePerDay.toLocaleString()} × {days} day{days !== 1 ? 's' : ''}
                    </span>
                    <span className="text-neutral-900">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Service fee (15%)</span>
                    <span className="text-neutral-900">₦{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Cargo insurance</span>
                    <span className="text-neutral-900">₦{cargoInsurance.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex justify-between font-medium">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-neutral-900">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-neutral-900 mb-2">Included:</p>
                  <ul className="text-xs text-neutral-600 space-y-1">
                    <li>• Cargo insurance coverage</li>
                    <li>• 24/7 roadside assistance</li>
                    <li>• Unlimited mileage</li>
                    <li>• GPS tracking</li>
                  </ul>
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
