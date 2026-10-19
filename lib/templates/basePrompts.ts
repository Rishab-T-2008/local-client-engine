import { BusinessInput, PricingBreakdown } from "../types";
import { formatCurrency } from "../utils";

export interface TemplateResult {
  systemPrompt: string;
  siteMapMarkdown: string;
  pitchScriptMarkdown: string;
}

export function generateBaseAgentDirectives(input: BusinessInput): string {
  const serviceList = input.keyServices.length > 0
    ? input.keyServices.join(", ")
    : "Primary local service offerings";

  return `You are an elite Senior Full-Stack Next.js 14+ Developer and Conversion Rate Optimization (CRO) specialist.
Your objective is to scaffold, build, and deliver a production-ready, ultra-fast, mobile-first website for "${input.businessName}", a ${input.specificType} located in ${input.location}.

### Core Tech Stack:
- Next.js 14+ (App Router with TypeScript)
- Tailwind CSS with semantic dark/light tokens
- Lucide React for crisp iconography
- Framer Motion for subtle, high-converting micro-interactions
- JSON-LD Schema.org LocalBusiness structured data

### Primary Deliverables:
1. High-converting Hero Section with sticky Mobile Quick-Action Bar (Call Now, Book / Order, Directions).
2. Key Service Showcase targeting: ${serviceList}.
3. Social proof section featuring Google Review ratings, local badges, and testimonials.
4. Frictionless inquiry / booking funnel with instant feedback states.
5. Automated Local SEO Schema (GeoCoordinates, openingHoursSpecification, telephone, areaServed).

### Strict Design Guidelines:
- Performance: 95+ Mobile Google Lighthouse target. Zero render-blocking assets.
- Mobile-First: 70%+ of local customer traffic arrives via mobile phones. Tap targets must be at least 48x48px.
- Typography & Polish: Premium typography hierarchy, generous whitespace, subtle border glows.`;
}

export function generateObjectionHandling(pricing: PricingBreakdown): string {
  return `### High-Converting Objection Handling Scripts

#### 1. "We already have an active Instagram / Facebook page and that's enough."
> **Agency Response:**
> *"Instagram is amazing for discovery, but over 64% of high-intent local buyers check Google Search or Google Maps when they are ready to spend money today. Social media algorithms bury your pricing, hours, and contact details. A dedicated, fast site gives Google the exact Local Schema signals needed to rank your business at the top of local map packs and turns casual scrollers into direct booked appointments without taking 30% platform cuts."*

#### 2. "${formatCurrency(pricing.targetPrice, pricing.currency)} is a bit high for our budget right now."
> **Agency Response:**
> *"I completely respect that. If we stripped out the automated multi-step booking integration and custom multi-page photography gallery, we can deploy our foundational Launch Tier today for just **${formatCurrency(pricing.floorPrice, pricing.currency)}**. That still includes the complete mobile-optimized site, direct click-to-call, Google Business Schema integration, and our 14-day turn-around. Would that work better for your cash flow this month?"*


#### 3. "Can you just email me some information and samples?"
> **Agency Response:**
> *"I'd be glad to send over our portfolio deck, but because every local business in our area has distinct competitors on Google Maps, I actually put together a live interactive sandbox preview specifically for your brand. Can we take 5 minutes tomorrow at 10 AM on Zoom or over coffee so I can show you how this will rank in your neighborhood?"*`;
}

