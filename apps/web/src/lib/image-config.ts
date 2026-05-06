/**
 * Image Configuration & CDN Strategy
 * Using Cloudinary for responsive image delivery with automatic optimization
 */

export const IMAGE_CONFIG = {
  // Cloudinary settings
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "carkid0",
    baseUrl: "https://res.cloudinary.com/carkid0/image/upload",
    // Transformation defaults
    defaultTransforms: {
      quality: "auto",
      format: "auto",
      fetch_format: "auto",
    },
  },

  // Responsive breakpoints for images
  breakpoints: {
    mobile: 320,
    mobileLarge: 480,
    tablet: 768,
    tabletLarge: 1024,
    desktop: 1280,
    desktopLarge: 1920,
  },

  // Image dimensions by context
  dimensions: {
    vehicleCard: {
      mobile: { width: 280, height: 210 },
      tablet: { width: 320, height: 240 },
      desktop: { width: 380, height: 285 },
    },
    vehicleDetail: {
      mobile: { width: 480, height: 360 },
      tablet: { width: 640, height: 480 },
      desktop: { width: 960, height: 720 },
    },
    thumbnail: {
      width: 120,
      height: 90,
    },
    heroImage: {
      mobile: { width: 480, height: 640 },
      tablet: { width: 768, height: 576 },
      desktop: { width: 1920, height: 1080 },
    },
  },

  // Quality presets
  quality: {
    thumbnail: 70,
    card: 75,
    detail: 85,
    hero: 90,
  },
};

/**
 * Generate Cloudinary transformation URL
 * @param imagePath - Cloudinary path (e.g., "fleet/vehicles/mercedes-g63")
 * @param options - Transformation options
 */
export function generateCloudinaryUrl(
  imagePath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif" | "jpg";
    crop?: "fill" | "fit" | "thumb";
    gravity?: "auto" | "center" | "face";
  } = {}
): string {
  const {
    width = 800,
    height = 600,
    quality = 75,
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  const transforms = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
    `g_${gravity}`,
  ].join(",");

  return `${IMAGE_CONFIG.cloudinary.baseUrl}/${transforms}/${imagePath}`;
}

/**
 * Generate srcset for responsive images
 * @param imagePath - Cloudinary path
 * @param sizes - Array of pixel densities or widths
 */
export function generateSrcSet(
  imagePath: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string {
  return sizes
    .map(
      (size) =>
        `${generateCloudinaryUrl(imagePath, {
          width: size,
          height: Math.round(size * 0.75),
        })} ${size}w`
    )
    .join(", ");
}

/**
 * Get image placeholder (blurhash or LQIP)
 * In production, generate blurhash server-side for better performance
 */
export function getImagePlaceholder(
  imagePath: string
): { blurUrl: string; aspectRatio: number } {
  // Low-quality image placeholder (8x6 pixels, heavily blurred)
  const blurUrl = generateCloudinaryUrl(imagePath, {
    width: 8,
    height: 6,
    quality: 20,
    format: "auto",
  });

  return {
    blurUrl,
    aspectRatio: 4 / 3, // Default 4:3 ratio for vehicle images
  };
}

/**
 * Image file paths organized by tier and brand
 * All paths should point to Cloudinary or public CDN
 */
export const VEHICLE_IMAGE_PATHS = {
  "eco-gig": {
    innoson: {
      "ivm-ex02": ["fleet/eco-gig/innoson/white-ivm", "fleet/eco-gig/innoson/yellow-ivm"],
    },
    wuling: {
      "bingo-ev": ["fleet/eco-gig/wuling/blue-bingo", "fleet/eco-gig/wuling/green-bingo"],
    },
    toyota: {
      "corolla-classic": [
        "fleet/eco-gig/toyota/white-corolla-2010",
        "fleet/eco-gig/toyota/grey-corolla-2010",
        "fleet/eco-gig/toyota/red-corolla-2014",
      ],
    },
    vw: {
      "polo-vivo": ["fleet/eco-gig/vw/polo-vivo-silver", "fleet/eco-gig/vw/polo-vivo-black"],
    },
  },
  elite: {
    saglev: {
      "s5-sedan": ["fleet/elite/saglev/black-s5-ev", "fleet/elite/saglev/white-s5-ev"],
    },
    toyota: {
      "landcruiser-v8": [
        "fleet/elite/toyota/black-landcruiser-v8",
        "fleet/elite/toyota/pearl-landcruiser-v8",
      ],
    },
    mercedes: {
      "g63-amg": ["fleet/elite/mercedes/black-g63", "fleet/elite/mercedes/silver-g63"],
    },
    porsche: {
      "911-carrera": ["fleet/elite/porsche/red-911-carrera", "fleet/elite/porsche/black-911-carrera"],
    },
    bmw: {
      "7-series": ["fleet/elite/bmw/silver-7-series", "fleet/elite/bmw/black-7-series"],
    },
    tesla: {
      "model-3": ["fleet/elite/tesla/pearl-model3", "fleet/elite/tesla/midnight-model3"],
    },
  },
  "heavy-haul": {
    scania: {
      "r450": ["fleet/heavy-haul/scania/white-r450", "fleet/heavy-haul/scania/grey-r450"],
    },
    mercedes: {
      actros: ["fleet/heavy-haul/mercedes/white-actros", "fleet/heavy-haul/mercedes/blue-actros"],
    },
    ford: {
      "f150-lightning": [
        "fleet/heavy-haul/ford/blue-f150-lightning",
        "fleet/heavy-haul/ford/black-f150-lightning",
      ],
    },
  },
};
