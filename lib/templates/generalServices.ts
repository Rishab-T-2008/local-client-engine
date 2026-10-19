import { BusinessInput, PricingBreakdown } from "../types";
import { formatCurrency } from "../utils";
import { generateBaseAgentDirectives, generateObjectionHandling, TemplateResult } from "./basePrompts";

export function generateGeneralServicesTemplate(input: BusinessInput, pricing: PricingBreakdown): TemplateResult {
  const serviceItems = input.keyServices.length > 0
    ? input.keyServices.map((s) => `- ${s}`).join("\n")
    : "- Professional On-Site Estimates & Consultations\n- Full-Service Maintenance & Installation\n- Emergency Service Calls";

  const systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${input.businessName}
${generateBaseAgentDirectives(input)}

### Niche Persona: Local Professional Services
Target Business: ${input.specificType}
Location: ${input.location}

### Specific Functional Requirements:
1. **Instant Quote & Estimate Calculator**:
   - Multi-step service selector allowing homeowners/clients to choose project scope, zip code, and get a quick consultation callback.
2. **Emergency / Direct Dispatch Sticky Bar**:
   - Floating persistent mobile bar with:
     - [Get Free Estimate / Book Service]
     - [Call Dispatch: tel:...]
     - [Service Area Map / Zip Checker]
3. **Trust & Proof Badges**:
   - License #, Insured & Bonded badge, BBB rating, and Google Reviews aggregate.
4. **Structured Data Implementation**:
   - ProfessionalService or HomeAndConstructionBusiness JSON-LD schema with \`areaServed\`, \`openingHoursSpecification\`, and \`telephone\`.

### Component Directory Blueprint:
\`\`\`
components/
├── navigation/ServiceNavbar.tsx (Clean header with 24/7 phone number & Free Estimate CTA)
├── hero/ServiceHero.tsx (High-urgency hero with instant quote request form)
├── services/ServiceGrid.tsx (Clear breakdown of core services and pricing tiers)
├── trust/LicenseBadges.tsx (Licensed, bonded, insured trust badges)
├── reviews/LocalReviewsSlider.tsx (Verified customer testimonials with neighborhood names)
├── quote/QuoteRequestModal.tsx (Multi-step lead capture funnel)
└── footer/ServiceFooter.tsx (Service areas by zip code, emergency phone, legal)
\`\`\`
`;

  const siteMapMarkdown = `# Production Site Roadmap: ${input.businessName}
**Niche**: Professional Services (${input.specificType})  
**Target Market**: ${input.location}  
**Architecture**: 5-Page High-Conversion Next.js Architecture

---

## 1. Five-Page Structured Architecture

### Page 1: \`/index\` (Home / Conversion Hub)
- **Hero Section**: High-urgency headline with fast turnaround guarantee and "Get Free Estimate" CTA.
- **Mobile Quick Action Bar**: Click-to-call direct dispatcher and instant estimate request button.
- **Core Services Matrix**: Overview of top requested jobs and transparent pricing ranges.
- **Service Area Map**: Neighborhoods and zip codes served in ${input.location}.
- **Trust Proof**: "Licensed, Bonded & Insured" verification bar and 5-star Google review snippets.

### Page 2: \`/services\` (Services & Solutions)
- **Service Catalog**: Detailed breakdown of commercial and residential offerings.
- **Process Walkthrough**: 3-step customer journey: 1) Instant quote, 2) On-time arrival, 3) Guaranteed satisfaction.
- **Pricing Guide**: Transparent starting rates eliminating client sticker shock.

### Page 3: \`/projects\` (Completed Work & Case Studies)
- **Project Showcase**: Before & after photos of recent work completed in ${input.location}.
- **Customer Stories**: Case studies highlighting quick turnaround and reliable communication.

### Page 4: \`/service-areas\` (Local SEO Landing Pages)
- **Suburbs & Zip Codes**: Targeted pages for nearby suburbs to capture long-tail Google searches.
- **Same-Day Service Guarantee**: Clear policy for urgent repair/service requests.

### Page 5: \`/contact\` (Free Quote & Emergency Dispatch)
- **Direct Dispatch Hotline**: 24/7 or daytime phone number with instant click-to-call.
- **Detailed Quote Form**: Upload photo/description of the job for an accurate preliminary quote.
- **Business Hours & Headquarters**: Physical address and office hours.

---

## 2. Features & Technical Specification Matrix

| Feature | Implementation Specification | Conversion Impact |
| :--- | :--- | :--- |
| **Mobile Direct Dispatch Bar** | Fixed bottom tap-to-call bar | Captures urgent clients searching with high purchase intent |
| **Local Service Schema** | ProfessionalService JSON-LD in head | Maximizes Google 3-Pack rank across target zip codes |
| **Interactive Estimate Request** | Multi-step client lead form | Generates 3x more qualified leads than standard contact forms |
| **Zip Code Checker** | Client-side search input | Confirms immediate service availability for local homeowners |
| **Verified Guarantee Badge** | 100% Satisfaction or Money Back badge | Eliminates hesitation for first-time customers |
`;

  const pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${input.businessName}
**Niche**: Professional Services (${input.specificType})  
**Target Market**: ${input.location}  

---

## 1. Three-Tier Value Pricing Matrix

| Tier Name | Price | Core Deliverables | Ideal Client Scenario |
| :--- | :--- | :--- | :--- |
| **1. Fast Lead Starter** | **${formatCurrency(pricing.floorPrice)}** (Floor) | 1-Page High-Conversion Lead Page, Tap-to-Call Emergency Bar, Core Services Overview, Google Maps embed | Solo operator wanting more phone calls this week |
| **2. Regional Growth & Dispatch Hub** | **${formatCurrency(pricing.targetPrice)}** (Target - Recommended) | Complete 5-Page Next.js Architecture, Multi-Step Free Estimate Funnel, Service Areas Map, ProfessionalService Schema | Established company wanting to scale job bookings without relying on HomeAdvisor/Angi lead fees |
| **3. Market Domination Suite** | **${formatCurrency(pricing.anchorPrice)}** (Anchor) | Everything in Regional Growth + Suburb SEO Landing Pages, Automated Review Request Pipeline, Instant SMS Dispatch webhook | Multi-truck crew or growing business ready to become the dominant provider in the region |

---

## 2. Cold Call / Direct Pitch Script

**Setting**: Call or visit the business owner or office manager.

> **Agency Pitcher:**
> *"Hi [Owner Name], my name is [Your Name], I run a local web development agency here in [Area].*
> 
> *I was looking at service businesses in ${input.location}, and I saw ${input.businessName} has great ratings. But I noticed that when someone in our town searches for '${input.specificType} near me' on their phone, lead aggregator sites like Angi and Thumbtack take the top spots and charge you $60 to $120 for shared leads.*
> 
> *We built a rapid mobile site prototype designed specifically for ${input.businessName} with a 1-tap call button, an interactive estimate calculator, and local Google Map Pack schema.*
> 
> *It's designed to generate exclusive inbound phone calls and estimate requests directly to your phone—with zero middleman fees.*
> 
> *I can text you a 60-second interactive preview link right now. What's the best mobile number for you?"*

---

## 3. The Anchor-to-Target Closing Sequence

> **Agency Pitcher:**
> *"Our premier Market Domination Suite is **${formatCurrency(pricing.anchorPrice)}**, which includes suburb landing pages and SMS dispatch.*
> 
> *However, to get direct leads rolling into your schedule immediately, our **Regional Growth & Dispatch Hub** at **${formatCurrency(pricing.targetPrice)}** delivers the entire 5-page setup, the mobile tap-to-call bar, and your multi-step quote request system.*
> 
> *Just one or two typical jobs from this site will pay off the entire project. Would you like us to start building your live preview this week?"*

---

${generateObjectionHandling(pricing)}
`;

  return { systemPrompt, siteMapMarkdown, pitchScriptMarkdown };
}

