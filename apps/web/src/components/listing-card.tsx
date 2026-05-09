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
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
      <div>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', background: '#f5f5f3', marginBottom: 12 }}>
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </h3>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>
          {listing.location}, {listing.country}
        </p>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
          {formatCurrency(listing.pricePerDay, listing.country)}
          <span style={{ fontSize: 13, fontWeight: 400, color: '#999' }}> /day</span>
        </p>
      </div>
    </Link>
  );
}
