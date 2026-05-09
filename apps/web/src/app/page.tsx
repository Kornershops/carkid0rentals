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
      <main style={{ paddingTop: 0 }}>

        {/* ─── Hero ─── */}
        <section style={{ padding: '100px 0 120px' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              {/* Text */}
              <div>
                <h1 style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#1a1a1a', marginBottom: 20 }}>
                  Rent verified vehicles across Africa.
                </h1>
                <p style={{ fontSize: 17, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 40, maxWidth: 420 }}>
                  Exotic, gig, and commercial vehicles from trusted listers in Lagos, Nairobi, Johannesburg, and Accra.
                </p>
                <Link href="/listings">
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '14px 28px', background: '#1a1a1a', color: '#fff',
                    fontSize: 14, fontWeight: 500, borderRadius: 100, border: 'none', cursor: 'pointer',
                  }}>
                    Browse vehicles
                    <ArrowRight size={15} weight="bold" />
                  </button>
                </Link>
              </div>

              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 24, overflow: 'hidden', background: '#f5f5f3' }}>
                <Image
                  src="/fleet/cars/mercedes-gle-coupe/exterior-front.png"
                  alt="Mercedes-Benz GLE Coupe"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Featured ─── */}
        <section style={{ padding: '80px 0', background: '#f9f9f7' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Featured</h2>
              <Link href="/listings" style={{ fontSize: 13, fontWeight: 500, color: '#6b6b6b' }}>
                View all →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Categories ─── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 48px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.02em', marginBottom: 40 }}>Categories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { title: 'Premium & Exotic', image: '/fleet/cars/mercedes-gle-coupe/exterior-side-1.png', href: '/listings' },
                { title: 'Eco-Gig', image: '/fleet/cars/wuling-bingo-ev-green/exterior-front.png', href: '/driver/gig-vehicles' },
                { title: 'Heavy-Haul', image: '/fleet/cars/jet-mover-ev-white/exterior-front.png', href: '/hauler/vehicles' },
              ].map((cat, i) => (
                <Link key={i} href={cat.href}>
                  <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 20, overflow: 'hidden', background: '#f0f0ee' }}>
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{cat.title}</span>
                      <ArrowRight size={14} weight="bold" color="rgba(255,255,255,0.7)" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Value Props ─── */}
        <section style={{ padding: '80px 0', background: '#f9f9f7' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 48px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.02em', marginBottom: 48 }}>Why CarKid0</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
              {[
                { icon: ShieldCheck, title: 'Verified & insured', desc: 'Every vehicle inspected. Every lister identity-verified. Full coverage included.' },
                { icon: Globe, title: 'Pan-African', desc: 'One account across Lagos, Nairobi, Johannesburg, and Accra. More cities coming.' },
                { icon: Lightning, title: 'Instant booking', desc: 'Platform vehicles confirm instantly. Pay securely via Paystack in seconds.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i}>
                    <Icon size={22} weight="regular" color="#1a1a1a" style={{ marginBottom: 16 }} />
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: '#6b6b6b', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{ padding: '100px 0' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 32, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Ready to get started?
            </h2>
            <p style={{ fontSize: 16, color: '#6b6b6b', marginBottom: 40 }}>
              Join thousands accessing verified vehicles across Africa.
            </p>
            <Link href="/listings">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px', background: '#1a1a1a', color: '#fff',
                fontSize: 14, fontWeight: 500, borderRadius: 100, border: 'none', cursor: 'pointer',
              }}>
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
