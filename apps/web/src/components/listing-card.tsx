import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/data/mock-listings';

export interface ListingCardProps {
  listing: Listing;
}

function formatCurrency(price: number, country: string) {
  switch (country) {
    case 'Nigeria': return `₦${price.toLocaleString()}`;
    case 'Kenya': return `KSh ${price.toLocaleString()}`;
    case 'South Africa': return `R${price.toLocaleString()}`;
    default: return `$${price.toLocaleString()}`;
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f5f5f3] mb-3">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </div>

        {/* Info */}
        <div className="px-0.5">
          <h3 className="text-[15px] font-medium text-[#1a1a1a] leading-snug line-clamp-1 mb-1">
            {listing.title}
          </h3>
          <p className="text-[13px] text-[#999] mb-2">
            {listing.location}, {listing.country}
          </p>
          <p className="text-[15px] font-semibold text-[#1a1a1a]">
            {formatCurrency(listing.pricePerDay, listing.country)}
            <span className="text-[13px] font-normal text-[#999]"> /day</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
