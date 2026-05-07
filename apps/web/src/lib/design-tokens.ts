/**
 * CarKid0 Design Tokens - Ultra Premium Minimal
 * 60/30/10 Color Rule: 60% white, 30% neutral, 10% accent
 */

export const designTokens = {
  // === COLOR SYSTEM ===
  colors: {
    // Primary (60% usage)
    white: '#FFFFFF',
    black: '#000000',
    
    // Neutrals (30% usage) - 5-shade gray scale
    gray: {
      50: '#F9FAFB',   // Backgrounds
      100: '#F3F4F6',  // Subtle backgrounds
      200: '#E5E7EB',  // Borders
      500: '#6B7280',  // Text secondary
      900: '#111827',  // Text primary
    },
    
    // Accent (10% usage) - Single premium color
    accent: {
      primary: '#0F172A',    // Deep slate (primary accent)
      secondary: '#1E293B',  // Lighter slate
      soft: '#F1F5F9',      // Accent background
    },
    
    // Semantic colors
    semantic: {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
  },

  // === TYPOGRAPHY SYSTEM ===
  typography: {
    fontFamily: {
      display: ['Outfit', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
    },
    
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '48px',
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.2,    // Headings
      normal: 1.4,   // Body text
      relaxed: 1.6,  // Large text
    },
    
    letterSpacing: {
      tight: '-0.02em',  // Headings
      normal: '0',       // Body
      wide: '0.05em',    // Uppercase text
    },
  },

  // === SPACING SYSTEM (8px grid) ===
  spacing: {
    0: '0px',
    1: '8px',
    2: '16px',
    3: '24px',
    4: '32px',
    5: '40px',
    6: '48px',
    8: '64px',
    10: '80px',
    12: '96px',
    16: '128px',
    20: '160px',
    24: '192px',
  },

  // === SHADOWS (Minimal) ===
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },

  // === BORDERS ===
  borders: {
    width: {
      none: '0',
      thin: '1px',
      thick: '2px',
    },
    
    radius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      full: '9999px',
    },
    
    color: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      dark: '#9CA3AF',
    },
  },

  // === ANIMATIONS (Micro-interactions only) ===
  animations: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    
    easing: {
      linear: 'linear',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // === BREAKPOINTS ===
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // === Z-INDEX SCALE ===
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// === COMPONENT VARIANTS ===
export const componentVariants = {
  button: {
    size: {
      sm: {
        height: '32px',
        padding: '0 16px',
        fontSize: designTokens.typography.fontSize.sm,
      },
      md: {
        height: '40px',
        padding: '0 24px',
        fontSize: designTokens.typography.fontSize.base,
      },
      lg: {
        height: '48px',
        padding: '0 32px',
        fontSize: designTokens.typography.fontSize.lg,
      },
    },
    
    variant: {
      primary: {
        backgroundColor: designTokens.colors.accent.primary,
        color: designTokens.colors.white,
        border: 'none',
      },
      secondary: {
        backgroundColor: designTokens.colors.gray[100],
        color: designTokens.colors.gray[900],
        border: `1px solid ${designTokens.colors.borders.color.light}`,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: designTokens.colors.gray[900],
        border: 'none',
      },
    },
  },

  input: {
    size: {
      sm: {
        height: '32px',
        padding: '0 12px',
        fontSize: designTokens.typography.fontSize.sm,
      },
      md: {
        height: '40px',
        padding: '0 16px',
        fontSize: designTokens.typography.fontSize.base,
      },
      lg: {
        height: '48px',
        padding: '0 20px',
        fontSize: designTokens.typography.fontSize.lg,
      },
    },
  },

  card: {
    padding: {
      sm: designTokens.spacing[3],
      md: designTokens.spacing[4],
      lg: designTokens.spacing[6],
    },
    
    variant: {
      default: {
        backgroundColor: designTokens.colors.white,
        border: `1px solid ${designTokens.colors.borders.color.light}`,
        borderRadius: designTokens.borders.radius.lg,
        boxShadow: designTokens.shadows.sm,
      },
      elevated: {
        backgroundColor: designTokens.colors.white,
        border: 'none',
        borderRadius: designTokens.borders.radius.xl,
        boxShadow: designTokens.shadows.md,
      },
    },
  },
} as const;

// === UTILITY FUNCTIONS ===
export const utils = {
  // Get color with opacity
  withOpacity: (color: string, opacity: number) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },
  
  // Responsive value helper
  responsive: (values: Record<string, string | number>) => {
    return Object.entries(values)
      .map(([breakpoint, value]) => {
        if (breakpoint === 'base') return value;
        return `@media (min-width: ${designTokens.breakpoints[breakpoint as keyof typeof designTokens.breakpoints]}) { ${value} }`;
      })
      .join(' ');
  },
  
  // Focus ring utility
  focusRing: {
    outline: `2px solid ${designTokens.colors.accent.primary}`,
    outlineOffset: '2px',
  },
} as const;

// === DESIGN PRINCIPLES ===
export const designPrinciples = {
  whitespace: {
    description: '40% of layout should be empty space',
    implementation: 'Use generous padding and margins',
  },
  
  colorUsage: {
    description: '60% white, 30% neutral, 10% accent',
    implementation: 'Primarily white backgrounds, gray text, minimal accent usage',
  },
  
  typography: {
    description: '2 font families maximum',
    implementation: 'Outfit for headings, Inter for body text',
  },
  
  interactions: {
    description: 'Micro-interactions only, 200ms maximum',
    implementation: 'Subtle hover states, no heavy animations',
  },
  
  accessibility: {
    description: 'WCAG AA compliance minimum',
    implementation: '48px minimum touch targets, proper contrast ratios',
  },
} as const;

export type DesignTokens = typeof designTokens;
export type ComponentVariants = typeof componentVariants;