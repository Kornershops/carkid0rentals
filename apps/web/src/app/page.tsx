"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Lightning, Globe } from '@phosphor-icons/react';
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
      setTimeout(() => setIsRoleModalOpen(true), 2000);
      localStorage.setItem('hasVisited', 'true');
    }
  }, [role]);

  const featured = [
    MOCK_LISTINGS.find(l => l.id === 'listing-1')!,
    MOCK_LISTINGS.find(l => l.id === 'listing-5')!,
    MOCK_LISTINGS.find(l => l.id === 'listing-9')!,
  ].filter(Boolean);

  return (
    <>
      <Header />
      <main>

        {/* ─── Hero ─── */}
        <section className="pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="max-w-[1140px] mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <div>
                <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] mb-5">
                  Rent verified vehicles across Africa.
                </h1>
                <p className="text-[17px] text-[#6b6b6b] leading-relaxed mb-10 max-w-md">
                  Exotic, gig, and commercial vehicles from trusted listers in Lagos, Nairobi, Johannesburg, and Accra.
                </p>
                <Link href="/listings">
                  <button className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1a1a1a] text-white text-[14px] font-medium rounded-full hover:bg-[#333] transition-colors">
                    Browse vehicles
                    <ArrowRight size={15} weight="bold" />
                  </button>
                </Link>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#f5f5f3]">
                <Image
                  src="/fleet/cars/mercedes-gle-coupe/exterior-front.png"
                  alt="Mercedes-Benz GLE Coupe"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Featured ─── */}
        <section className="py-20 md:py-28 bg-[#f9f9f7]">
          <div className="max-w-[1140px] mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[22px] font-semibold text-[#1a1a1a] tracking-tight">Featured</h2>
              <Link href="/listings" className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Categories ─── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1140px] mx-auto px-6 md:px-12">
            <h2 className="text-[22px] font-semibold text-[#1a1a1a] tracking-tight mb-10">Categories</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { title: 'Premium & Exotic', image: '/fleet/cars/toyota-highlander/exterior-front.png', href: '/listings' },
                { title: 'Eco-Gig', image: '/fleet/cars/wuling-bingo-ev-blue/exterior-front.png', href: '/driver/gig-vehicles' },
                { title: 'Heavy-Haul', image: '/fleet/cars/jet-mover-ev-white/exterior-front.png', href: '/hauler/vehicles' },
              ].map((cat, i) => (
                <Link key={i} href={cat.href}>
                  <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f5f5f3]">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-2">
                      <span className="text-[15px] font-medium text-white">{cat.title}</span>
                      <ArrowRight size={14} weight="bold" className="text-white/70" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Value Props ─── */}
        <section className="py-20 md:py-28 bg-[#f9f9f7]">
          <div className="max-w-[1140px] mx-auto px-6 md:px-12">
            <h2 className="text-[22px] font-semibold text-[#1a1a1a] tracking-tight mb-12">Why CarKid0</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: ShieldCheck, title: 'Verified & insured', desc: 'Every vehicle inspected. Every lister identity-verified. Full coverage included.' },
                { icon: Globe, title: 'Pan-African', desc: 'One account across Lagos, Nairobi, Johannesburg, and Accra. More cities coming.' },
                { icon: Lightning, title: 'Instant booking', desc: 'Platform vehicles confirm instantly. Pay securely via Paystack in seconds.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i}>
                    <Icon size={24} weight="regular" className="text-[#1a1a1a] mb-4" />
                    <h3 className="text-[15px] font-medium text-[#1a1a1a] mb-2">{item.title}</h3>
                    <p className="text-[14px] text-[#6b6b6b] leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1140px] mx-auto px-6 md:px-12 text-center">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold text-[#1a1a1a] tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-[16px] text-[#6b6b6b] mb-10 max-w-md mx-auto">
              Join thousands accessing verified vehicles across Africa.
            </p>
            <Link href="/listings">
              <button className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1a1a1a] text-white text-[14px] font-medium rounded-full hover:bg-[#333] transition-colors">
                Browse vehicles
                <ArrowRight size={15} weight="bold" />
              </button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
      <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </>
  );
}
