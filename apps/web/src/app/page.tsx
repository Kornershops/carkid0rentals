"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Lightning, Globe, Star, Play, CaretRight } from '@phosphor-icons/react';
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
      setTimeout(() => setIsRoleModalOpen(true), 1500);
      localStorage.setItem('hasVisited', 'true');
    }
  }, [role]);

  const featured = [
    MOCK_LISTINGS.find(l => l.id === 'listing-1')!,
    MOCK_LISTINGS.find(l => l.id === 'listing-17')!,
    MOCK_LISTINGS.find(l => l.id === 'listing-9')!,
    MOCK_LISTINGS.find(l => l.id === 'listing-15')!,
  ].filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fafafa]">

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0a0a0a]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/fleet/cars/mercedes-gle-coupe/exterior-action.png"
              alt="Premium vehicle"
              fill
              className="object-cover opacity-40 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-32">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-white/70 tracking-wide">Now live in 5 African countries</span>
              </div>

              {/* Headline */}
              <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white mb-8">
                The Future of
                <br />
                Vehicle Access
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  in Africa.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-xl mb-12 font-light">
                From luxury SUVs to gig-economy EVs and heavy-haul trucks — rent verified vehicles from trusted listers across the continent.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/listings">
                  <button className="group flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] text-sm font-semibold rounded-full hover:bg-amber-50 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    Browse Fleet
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button
                  onClick={() => setIsRoleModalOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 text-white/80 text-sm font-medium rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                >
                  <Play size={16} weight="fill" className="text-amber-300" />
                  How it Works
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-24 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl">
              {[
                { value: '500+', label: 'Vehicles' },
                { value: '50K+', label: 'Active Users' },
                { value: '5', label: 'Countries' },
                { value: '4.9', label: 'App Rating', icon: true },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                    {stat.icon && <Star size={16} weight="fill" className="text-amber-400" />}
                  </div>
                  <span className="text-sm text-white/40 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-xs text-white/50 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </section>

        {/* ═══ FEATURED VEHICLES ═══ */}
        <section className="py-24 md:py-36 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3 block">Curated Selection</span>
                <h2 className="text-3xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight">
                  Featured Vehicles
                </h2>
              </div>
              <Link href="/listings" className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#0a0a0a] hover:text-amber-700 transition-colors group">
                View All
                <CaretRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            <div className="mt-8 md:hidden text-center">
              <Link href="/listings" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a0a0a]">
                View All Vehicles <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ CATEGORIES ═══ */}
        <section className="py-24 md:py-36 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-400 mb-3 block">Three Tiers</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                One Platform, Every Need
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto font-light">
                Whether you need a luxury ride, a gig vehicle, or a heavy-haul truck — we've got you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Premium & Exotic',
                  subtitle: 'Luxury SUVs, sedans & exotics',
                  image: '/fleet/cars/toyota-lc200-red-interior/exterior-side.jpg',
                  href: '/listings',
                  accent: 'from-violet-500/20 to-purple-900/40',
                },
                {
                  title: 'Eco-Gig',
                  subtitle: 'EVs & fuel-efficient for ride-hailing',
                  image: '/fleet/cars/saglev-s5-ev-white/exterior-front.jpg',
                  href: '/driver/gig-vehicles',
                  accent: 'from-emerald-500/20 to-green-900/40',
                },
                {
                  title: 'Heavy-Haul',
                  subtitle: 'Trucks & logistics vehicles',
                  image: '/fleet/cars/toyota-hilux-adventure/exterior-front.jpg',
                  href: '/hauler/vehicles',
                  accent: 'from-amber-500/20 to-orange-900/40',
                },
              ].map((cat, i) => (
                <Link key={i} href={cat.href}>
                  <div className="group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{cat.title}</h3>
                      <p className="text-white/60 text-sm mb-6">{cat.subtitle}</p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-amber-300 transition-colors">
                        Explore
                        <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ VALUE PROPS ═══ */}
        <section className="py-24 md:py-36 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Left */}
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-4 block">Why CarKid0</span>
                <h2 className="text-3xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6 leading-[1.1]">
                  Built for Africa's
                  <br />
                  mobility future.
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-12 font-light">
                  We combine verified fleet management, real-time IoT tracking, and seamless payments to deliver a rental experience that's secure, transparent, and instant.
                </p>

                <div className="space-y-8">
                  {[
                    { icon: ShieldCheck, title: 'Verified & Insured', desc: 'Every vehicle inspected. Every lister KYC-verified. Full insurance coverage.' },
                    { icon: Globe, title: 'Pan-African Network', desc: 'Lagos, Nairobi, Johannesburg, Accra — one account, multiple cities.' },
                    { icon: Lightning, title: 'Instant Booking', desc: 'Platform vehicles confirm instantly. Pay via Paystack in seconds.' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex gap-5">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0a0a0a] flex items-center justify-center">
                          <Icon size={22} weight="bold" className="text-amber-300" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-[#0a0a0a] mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right — Image Grid */}
              <div className="relative hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-64 rounded-2xl overflow-hidden">
                      <Image src="/fleet/cars/lexus-gx460-facelift/exterior-front.jpg" alt="Lexus GX460" fill className="object-cover" />
                    </div>
                    <div className="relative h-48 rounded-2xl overflow-hidden">
                      <Image src="/fleet/cars/wuling-bingo-ev-green/exterior-front.png" alt="Wuling EV" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative h-48 rounded-2xl overflow-hidden">
                      <Image src="/fleet/cars/toyota-hilux-escort/exterior-front.jpg" alt="Toyota Hilux" fill className="object-cover" />
                    </div>
                    <div className="relative h-64 rounded-2xl overflow-hidden">
                      <Image src="/fleet/cars/toyota-prado-txl/exterior-front.jpg" alt="Toyota Prado" fill className="object-cover" />
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <ShieldCheck size={20} weight="fill" className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0a0a0a]">100% Verified</p>
                      <p className="text-xs text-gray-500">All vehicles & listers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF ═══ */}
        <section className="py-24 md:py-32 bg-[#f5f5f0] border-y border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3 block">Trusted</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight">
                Loved by thousands across Africa
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Adebayo O.', city: 'Lagos', text: 'Booked a GLE Coupe for my wedding weekend. Seamless process, vehicle was immaculate.', rating: 5 },
                { name: 'Wanjiku M.', city: 'Nairobi', text: 'I use CarKid0 for my Uber business. The Wuling EVs are perfect — low cost, zero emissions.', rating: 5 },
                { name: 'Thabo K.', city: 'Johannesburg', text: 'Our logistics company rents 3 Hilux trucks monthly. Reliable fleet, great support team.', rating: 5 },
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={16} weight="fill" className="text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-6 font-light italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-[#0a0a0a]">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative py-32 md:py-44 overflow-hidden">
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/fleet/cars/toyota-lc200-red-interior/interior-dash.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/70" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.05]">
              Ready to drive?
            </h2>
            <p className="text-lg text-white/50 max-w-lg mx-auto mb-12 font-light">
              Join 50,000+ users accessing premium vehicles across Africa. Your next ride is one tap away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/listings">
                <button className="group flex items-center gap-3 px-10 py-5 bg-white text-[#0a0a0a] text-sm font-bold rounded-full hover:bg-amber-50 transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.08)]">
                  Start Browsing
                  <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="flex items-center gap-3 px-10 py-5 text-white/70 text-sm font-medium rounded-full border border-white/10 hover:border-white/25 hover:text-white transition-all duration-300"
              >
                Choose Your Role
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </>
  );
}
