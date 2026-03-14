/* ════════════════════════════════════════════════════════════════
   Niche Configuration System

   Each niche is a config object that controls:
   - Theme (colors, gradients, branding)
   - Feature flags (which modules are enabled)
   - Destinations (which cities this niche serves)
   - Categories (activity categories for this niche)
   - Supported languages
   - Default settings
   ════════════════════════════════════════════════════════════════ */

export interface NicheFeatures {
  groupBooking: boolean;
  votingSystem: boolean;
  countdownTimer: boolean;
  expenseSplitting: boolean;
  guestList: boolean;
  profilePage: boolean;
  aiSchedule: boolean;
}

export interface NicheTheme {
  /** Tailwind color prefix, e.g. 'pink' → bg-pink-500, text-pink-700 */
  primary: string;
  /** Secondary accent color prefix */
  accent: string;
  /** Gradient classes for hero sections */
  heroGradient: string;
  /** Gradient for buttons and CTAs */
  ctaGradient: string;
  /** App name displayed in the UI */
  appName: string;
  /** Tagline shown on landing/header */
  tagline: Record<string, string>;
  /** Description for SEO / meta */
  description: Record<string, string>;
}

export interface CategoryColor {
  bg: string;
  border: string;
  text: string;
  badge: string;
  dot: string;
  light: string;
}

export interface NicheConfig {
  /** Unique niche identifier */
  id: string;
  /** Display name for the niche */
  name: Record<string, string>;
  /** Which destinations are available */
  destinations: string[];
  /** Enabled features */
  features: NicheFeatures;
  /** Visual theme */
  theme: NicheTheme;
  /** Activity categories for this niche */
  categories: string[];
  /** Color scheme per activity category (key = category name) */
  categoryColors: Record<string, CategoryColor>;
  /** Default currency */
  defaultCurrency: string;
  /** Supported languages (ISO codes) */
  supportedLanguages: string[];
  /** Default language */
  defaultLanguage: string;
  /** Minimum group size */
  minGroupSize: number;
  /** Default group size */
  defaultGroupSize: number;
}

/* ── Birthday Celebrations niche ── */

export const birthdayConfig: NicheConfig = {
  id: 'birthday',
  name: {
    en: 'Birthday Celebrations',
    fr: 'Célébrations d\'Anniversaire',
  },
  destinations: ['casablanca', 'marrakech'],
  features: {
    groupBooking: true,
    votingSystem: true,
    countdownTimer: true,
    expenseSplitting: true,
    guestList: true,
    profilePage: true,
    aiSchedule: true,
  },
  theme: {
    primary: 'amber',
    accent: 'orange',
    heroGradient: 'from-amber-500 via-orange-500 to-rose-500',
    ctaGradient: 'from-amber-500 to-orange-500',
    appName: 'QTRIP',
    tagline: {
      en: 'Celebrate in style',
      fr: 'Célébrez avec panache',
    },
    description: {
      en: 'Plan unforgettable birthday celebrations in Casablanca and Marrakech. Fine dining, rooftop parties, and cultural experiences.',
      fr: 'Organisez des anniversaires inoubliables à Casablanca et Marrakech. Gastronomie, rooftops et expériences culturelles.',
    },
  },
  categories: [
    'Fine Dining',
    'Nightlife & Bars',
    'Culture & Sightseeing',
    'Wellness & Spa',
    'Group Experiences',
    'Food & Drink',
  ],
  categoryColors: {
    'Fine Dining':           { bg: 'bg-amber-50',   border: 'border-amber-300',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400',   light: 'bg-amber-50/60' },
    'Nightlife & Bars':      { bg: 'bg-fuchsia-50', border: 'border-fuchsia-300', text: 'text-fuchsia-700', badge: 'bg-fuchsia-100 text-fuchsia-700', dot: 'bg-fuchsia-400', light: 'bg-fuchsia-50/60' },
    'Culture & Sightseeing': { bg: 'bg-violet-50',  border: 'border-violet-300',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700',   dot: 'bg-violet-400',  light: 'bg-violet-50/60' },
    'Wellness & Spa':        { bg: 'bg-teal-50',    border: 'border-teal-300',    text: 'text-teal-700',    badge: 'bg-teal-100 text-teal-700',       dot: 'bg-teal-400',    light: 'bg-teal-50/60' },
    'Group Experiences':     { bg: 'bg-orange-50',   border: 'border-orange-300',  text: 'text-orange-700',  badge: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-400',  light: 'bg-orange-50/60' },
    'Food & Drink':          { bg: 'bg-rose-50',    border: 'border-rose-300',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700',       dot: 'bg-rose-400',    light: 'bg-rose-50/60' },
  },
  defaultCurrency: 'EUR',
  supportedLanguages: ['en', 'fr'],
  defaultLanguage: 'en',
  minGroupSize: 2,
  defaultGroupSize: 6,
};

/* ── Active niche ── */
// Change this to switch niches. In the future this could come from
// an env variable, subdomain detection, or a database lookup.
export const activeNiche: NicheConfig = birthdayConfig;
