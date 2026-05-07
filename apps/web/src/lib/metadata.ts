import { Metadata } from 'next';

export const siteConfig = {
  name: 'CarKid0 Rentals',
  description: 'Omni-Tier Vehicle Rental Platform with real-time IoT enforcement. Rent exotic cars, eco-gig vehicles, and heavy-haul trucks across Africa.',
  url: 'https://carkid0rentals.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/carkid0rentals',
    github: 'https://github.com/carkid0rentals',
  },
};

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;

  return {
    title: metaTitle,
    description: metaDescription,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@carkid0rentals',
    },
    alternates: {
      canonical: siteConfig.url,
    },
  };
}

export const defaultMetadata: Metadata = generateMetadata({});
