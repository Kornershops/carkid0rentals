import Link from 'next/link';
import Image from 'next/image';
import { Lightning, MapPin, ShieldCheck, Images } from '@phosphor-icons/react';
import { Badge } from '@/components/ui';
import { Rating } from '@/components/ui/rating';
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

function getTierBadgeStyle(category: string) {
  switch (category) {
    case 'exotic': return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'premium': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'eco-gig': return 'bg-green-50 text-green-700 border border-green-200';
    case 'heavy-haul': return 'bg-orange-50 text-orange-700 border border-orange-200';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-gray-100">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getTierBadgeStyle(listing.category)}`}>
              {listing.category.toUpperCase()}
            </span>
            {listing.isEV && (
              <Badge variant="success" size="sm">
                <Lightning size={12} weight="fill" />
                EV
              </Badge>
            )}
          </div>

          {/* Image count */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <Images size={14} weight="bold" />
              {listing.images.length}
            </div>
          )}

          {/* Availability */}
          {listing.availability !== 'available' && (
            <div className="absolute top-3 right-3">
              <Badge variant="error" size="sm">
                {listing.availability.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {listing.title}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>{listing.brand}</span>
            <span>•</span>
            <span>{listing.year}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin size={14} weight="bold" />
              <span>{listing.location}</span>
            </div>
          </div>

          {/* Attribution */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            {listing.lister.role === 'admin' ? (
              <div className="flex items-center gap-2">
                <div className="bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck size={14} weight="fill" />
                  CarKid0 Official
                </div>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {listing.lister.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {listing.lister.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Rating value={listing.lister.rating} size={12} />
                    <span className="text-xs text-gray-500">
                      ({listing.lister.reviewCount})
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(listing.pricePerDay, listing.country)}
              </p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
            <div className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
