'use client';

import { CheckCircle, Download, Truck, Calendar, CurrencyCircleDollar, FileText } from '@phosphor-icons/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HaulerConfirmationPage() {
  const bookingRef = 'HH' + Math.random().toString(36).substring(2, 9).toUpperCase();

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="md">
          <div className="text-center mb-8">
            <CheckCircle size={64} weight="duotone" className="text-neutral-900 mx-auto mb-4" />
            <h1 className="text-3xl font-medium text-neutral-900 mb-2">Booking Confirmed!</h1>
            <p className="text-neutral-600">Your commercial booking has been confirmed</p>
          </div>

          <Card className="mb-6">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-2">Booking Reference</p>
              <p className="text-2xl font-medium text-neutral-900 tracking-wider">{bookingRef}</p>
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-neutral-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Mercedes-Benz Sprinter</p>
                  <p className="text-sm text-neutral-600">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-neutral-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Trip Dates</p>
                  <p className="text-sm text-neutral-600">Jan 15, 2025 - Jan 20, 2025 (5 days)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CurrencyCircleDollar size={20} className="text-neutral-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Total Amount</p>
                  <p className="text-sm text-neutral-600">₦287,500</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">Check Your Email</p>
                  <p className="text-sm text-neutral-600">
                    We've sent booking confirmation and vehicle details to your email
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">Lister Will Contact You</p>
                  <p className="text-sm text-neutral-600">
                    The vehicle owner will reach out within 24 hours to confirm pickup details
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">Vehicle Inspection</p>
                  <p className="text-sm text-neutral-600">
                    Conduct pre-trip inspection and document vehicle condition before departure
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">Track Your Cargo</p>
                  <p className="text-sm text-neutral-600">
                    Use GPS tracking to monitor your vehicle and cargo in real-time
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" fullWidth>
              <Download size={20} weight="bold" />
              Download Receipt
            </Button>
            <Button variant="outline" fullWidth>
              <FileText size={20} weight="bold" />
              View Contract
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
