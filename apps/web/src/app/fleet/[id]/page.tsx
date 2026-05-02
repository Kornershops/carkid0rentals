import { MOCK_FLEET } from "@/data/mock-fleet";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Car, ChevronLeft, Calendar, ShieldCheck, Zap, Truck, Shield, Lock } from "lucide-react";

export default async function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params object before accessing its properties
  const { id } = await params;
  const vehicle = MOCK_FLEET.find((v) => v.id === id);

  if (!vehicle) {
    notFound();
  }

  // Tier-specific UI elements
  const isEco = vehicle.tier === "eco-gig";
  const isElite = vehicle.tier === "elite";
  const isHaul = vehicle.tier === "heavy-haul";

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/fleet" className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Fleet
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-premium-gradient rounded-lg flex items-center justify-center">
              <Car className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">CarKid0</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Visual Area */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-surface border border-border shadow-xl">
              {isElite && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background/80 backdrop-blur rounded-lg border border-white/10 text-xs font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  360° View Active
                </div>
              )}
              <Image 
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
                unoptimized
              />
              
              {/* Fake 360 viewer controls for Elite */}
              {isElite && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="w-8 h-1 bg-white/50 rounded-full" />
                  <div className="w-12 h-1 bg-white rounded-full" />
                  <div className="w-8 h-1 bg-white/50 rounded-full" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
               {/* Mock thumbnails */}
               {[1, 2, 3].map((i) => (
                 <div key={i} className="aspect-video bg-surface rounded-xl border border-border overflow-hidden relative opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                    <Image src={vehicle.image} alt="thumbnail" fill className="object-cover" unoptimized />
                 </div>
               ))}
            </div>
          </div>

          {/* Details & Booking Area */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold w-fit mb-4 capitalize">
              {isEco && <Zap className="w-3 h-3 text-yellow-500" />}
              {isElite && <Shield className="w-3 h-3 text-primary" />}
              {isHaul && <Truck className="w-3 h-3 text-blue-500" />}
              {vehicle.tier.replace("-", " ")}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              {vehicle.brand} <span className="text-muted font-light">{vehicle.model}</span>
            </h1>
            <p className="text-lg text-muted mb-8">{vehicle.year} • Automatic • 5 Seats</p>

            {/* Dynamic Tier Stats Box */}
            <div className={`p-6 rounded-2xl border mb-8 ${
              isEco ? 'bg-yellow-500/5 border-yellow-500/20' : 
              isElite ? 'bg-primary/5 border-primary/20' : 
              'bg-blue-500/5 border-blue-500/20'
            }`}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">Vehicle Specifications</h3>
              <div className="grid grid-cols-2 gap-6">
                
                {isEco && (
                  <>
                    <div>
                      <p className="text-xs text-muted mb-1">Fuel Efficiency</p>
                      <p className="font-mono text-lg font-bold text-yellow-600 dark:text-yellow-400">{vehicle.fuelEfficiency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Est. Daily Earnings (Bolt/Uber)</p>
                      <p className="font-mono text-lg font-bold text-green-500">₦{vehicle.estDailyRevenue?.toLocaleString()}</p>
                    </div>
                  </>
                )}

                {isElite && (
                  <>
                    <div>
                      <p className="text-xs text-muted mb-1">Horsepower</p>
                      <p className="font-mono text-lg font-bold text-primary">{vehicle.hp} HP</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">0 - 60 mph</p>
                      <p className="font-mono text-lg font-bold">{vehicle.zeroToSixty}s</p>
                    </div>
                  </>
                )}

                {isHaul && (
                  <>
                    <div>
                      <p className="text-xs text-muted mb-1">Max Payload</p>
                      <p className="font-mono text-lg font-bold text-blue-500">{(vehicle.payloadKg! / 1000).toFixed(1)} Tons</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Clearance Height</p>
                      <p className="font-mono text-lg font-bold">{vehicle.clearanceHeight}m</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4">Included Features</h3>
              <div className="flex flex-wrap gap-3">
                {vehicle.features.map((feat) => (
                  <div key={feat} className="px-4 py-2 bg-surface border border-border rounded-xl text-sm font-medium">
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted mb-1">Total Pricing</p>
                  <p className="text-3xl font-bold">₦{vehicle.pricePerDay.toLocaleString()}<span className="text-lg text-muted font-normal">/day</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted mb-1">Security Deposit</p>
                  <p className="text-lg font-bold">₦{(vehicle.pricePerDay * 0.5).toLocaleString()}</p>
                </div>
              </div>

              <Link 
                href="/dashboard/customer" // Mock routing directly to dashboard after booking
                className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-xl transition-opacity hover:opacity-90 ${
                  isEco ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/20' : 
                  isElite ? 'bg-gradient-to-r from-primary to-secondary shadow-primary/20' : 
                  'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/20'
                }`}
              >
                <Lock className="w-5 h-5" />
                Book & Escrow Funds
              </Link>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                KYC Verification required before unlock.
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
