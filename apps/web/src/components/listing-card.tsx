import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/data/mock-listings';
import { getCurrencyForCountry, CURRENCIES } from '@/lib/currency';

export interface ListingCardProps {
  listing: Listing;
}

const TIER_CONFIG: Record<string, { label: string; className: string }> = {
  exotic: { label: 'Exotic', className: 'bg-purple-100 text-purple-700' },
  premium: { label: 'Premium', className: 'bg-blue-100 text-blue-700' },
  'eco-gig': { label: 'Eco-Gig', className: 'bg-green-100 text-green-700' },
  'heavy-haul': { label: 'Heavy-Haul', className: 'bg-orange-100 text-orange-700' },
};

function formatCurrency(price: number, country: string) {
  const code = getCurrencyForCountry(country);
  const { symbol } = CURRENCIES[code];
  return `${symbol}${price.toLocaleString()}`;
}

export function ListingCard({ listing }: ListingCardProps) {
  const tier = TIER_CONFIG[listing.category];
  const isAdmin = listing.lister.role === 'admin';
  const imageCount = listing.images.length;

  return (
    <Link href={`/listings/${listing.id}`} className="group block no-underline">
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover object-[center_70%] transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlays */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${tier.className}`}>
              {tier.label}
            </span>
            {listing.isEV && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
                EV
              </span>
            )}
          </div>

          {imageCount > 1 && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-medium">
              1/{imageCount}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Source attribution */}
          <div className="flex items-center gap-1.5 mb-2">
            {isAdmin ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-900 text-white">
                CarKid0 Official
              </span>
            ) : (
              <span className="text-[11px] text-gray-500 truncate">
                {listing.lister.name} · ★ {listing.lister.rating}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-medium text-gray-900 leading-tight truncate mb-1">
            {listing.title}
          </h3>

          {/* Location */}
          <p className="text-[13px] text-gray-500 mb-2">
            {listing.location}, {listing.country}
          </p>

          {/* Specs */}
          <div className="flex items-center gap-2 mb-3 text-[11px] text-gray-500">
            {listing.year && <span>{listing.year}</span>}
            {listing.specs.seats && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                <span>{listing.specs.seats} seats</span>
              </>
            )}
            {listing.specs.transmission && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                <span>{listing.specs.transmission}</span>
              </>
            )}
          </div>

          {/* Price */}
          <p className="text-[16px] font-semibold text-gray-900">
            {formatCurrency(listing.pricePerDay, listing.country)}
            <span className="text-[13px] font-normal text-gray-500"> /day</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
