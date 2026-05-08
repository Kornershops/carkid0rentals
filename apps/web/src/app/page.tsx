"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lightning, Users, Globe, CheckCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RoleModal } from '@/components/role-modal';
import { ListingCard } from '@/components/listing-card';
import { useStore } from '@/store/use-store';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function Home() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { role } = useStore();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited && !role) {
      setTimeout(() => setIsRoleModalOpen(true), 1000);
      localStorage.setItem('hasVisited', 'true');
    }
  }, [role]);

  // Featured: 1 exotic/premium, 1 eco-gig, 1 heavy-haul, 1 admin pick
  const featured = [
    MOCK_LISTINGS.find(l => l.id === 'listing-1')!,
    MOCK_LISTINGS.find(l => l.id === 'listing-17')!,
    MOCK_LISTINGS.find(l => l.id === 'listing-9')!,
  ].filter(Boolean);

  const features = [
    { icon: ShieldCheck, title: 'Verified Fleet', description: 'Every vehicle inspected, insured, and tracked in real-time.' },
    { icon: Globe, title: 'Pan-African Network', description: 'Access vehicles across Nigeria, Kenya, South Africa, and Ghana.' },
    { icon: Lightning, title: 'Instant Booking', description: 'Reserve vehicles in minutes with transparent pricing.' },
    { icon: Users, title: 'Trusted by 50K+', description: 'Join thousands using our platform daily.' },
  ];

  const stats = [
    { value: '500+', label: 'Vehicles' },
    { value: '50K+', label: 'Users' },
    { value: '5', label: 'Countries' },
    { value: '24/7', label: 'Support' },
  ];

  const categories = [
    {
      title: 'Exotic & Premium',
      description: 'Luxury SUVs and exotic vehicles for business and special occasions.',
      image: '/fleet/cars/mercedes-gle-coupe/exterior-front.png',
      href: '/listings?category=exotic',
    },
    {
      title: 'Eco-Gig Vehicles',
      description: 'Fuel-efficient and electric vehicles for ride-hailing and delivery.',
      image: '/fleet/cars/wuling-bingo-ev-blue/exterior-front.png',
      href: '/driver/gig-vehicles',
    },
    {
      title: 'Heavy-Haul',
      description: 'Trucks and logistics vehicles for cargo and hauling operations.',
      image: '/fleet/cars/jet-mover-ev-white/exterior-front.png',
      href: '/hauler/vehicles',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <Container size="lg">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight">
                Premium Vehicle Rentals
                <br />
                <span className="text-gray-400">Across Africa</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Access exotic vehicles, gig cars, and heavy-haul trucks from verified listers across the continent.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" size="lg" onClick={() => setIsRoleModalOpen(true)}>
                  Get Started
                </Button>
                <Link href="/listings">
                  <Button variant="secondary" size="lg">Browse Vehicles</Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-gray-200 bg-gray-50">
          <Container size="lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-semibold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured Vehicles */}
        <section className="py-20 md:py-32">
          <Container size="xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">Featured on CarKid0</h2>
                <p className="text-lg text-gray-600">Hand-picked vehicles from our platform</p>
              </div>
              <Link href="/listings">
                <Button variant="ghost" size="sm">View All →</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </Container>
        </section>

        {/* Vehicle Categories */}
        <section className="py-20 md:py-32 bg-gray-50">
          <Container size="lg">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-6">Vehicle Categories</h2>
              <p className="text-lg text-gray-600">Find the perfect vehicle for your needs.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <Link key={i} href={cat.href}>
                  <div className="relative h-72 rounded-lg overflow-hidden group cursor-pointer">
                    <Image src={cat.image} alt={cat.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{cat.title}</h3>
                      <p className="text-sm text-gray-300">{cat.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Features */}
        <section className="py-20 md:py-32">
          <Container size="lg">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-6">Why Choose CarKid0</h2>
              <p className="text-lg text-gray-600">Built for drivers, businesses, and individuals who need reliable vehicle access.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon size={32} weight="bold" className="text-gray-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Trust */}
        <section className="py-20 md:py-32 bg-gray-50">
          <Container size="lg">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-6">Built on Trust</h2>
                <p className="text-lg text-gray-600">Every vehicle and lister is verified for your peace of mind.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Verified Listers', desc: 'All vehicle owners undergo identity verification and background checks.' },
                  { title: 'Inspected Vehicles', desc: 'Every vehicle is inspected and insured before listing.' },
                  { title: 'Real-Time Tracking', desc: 'IoT-enabled tracking ensures vehicle security and monitoring.' },
                  { title: '24/7 Support', desc: 'Our support team is available around the clock.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle size={24} weight="fill" className="text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-gray-900">
          <Container size="lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-gray-400 mb-12">Choose your role and start accessing vehicles across Africa today.</p>
              <Button variant="primary" size="lg" onClick={() => setIsRoleModalOpen(true)} className="bg-white text-gray-900 hover:bg-gray-100">
                Choose Your Role
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
      <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </>
  );
}
