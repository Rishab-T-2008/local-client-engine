export type BusinessNiche = 'hospitality' | 'wellness' | 'clinics' | 'general_services';

export interface BusinessInput {
  businessName: string;
  niche: BusinessNiche;
  specificType: string;         // e.g., "Specialty Coffee Roastery"
  location: string;             // e.g., "Austin, TX"
  targetPriceAnchor: number;    // e.g., 2500
  targetPriceFloor: number;     // e.g., 800
  currency?: string;            // e.g., "USD", "INR", "EUR", "GBP"
  keyServices: string[];        // e.g., ["Cold Brew", "Catering", "Pastries"]
}

export interface PricingBreakdown {
  anchorPrice: number;
  targetPrice: number;
  floorPrice: number;
  currency: string;
  currencySymbol: string;
}

export interface GeneratedOutput {
  systemPrompt: string;         // Ready for Cursor / Antigravity / Claude
  siteMapMarkdown: string;      // 5-page structured architecture
  pitchScriptMarkdown: string;  // Anchor / Target / Floor script with objection handling
  pricing?: PricingBreakdown;
}

export interface WhopUser {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  hasAccess: boolean;
  membershipPlan?: string;
  validUntil?: string;
}

