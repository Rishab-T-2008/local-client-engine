import { BusinessInput, PricingBreakdown } from "../types";
import { formatCurrency } from "../utils";
import { generateBaseAgentDirectives, generateObjectionHandling, TemplateResult } from "./basePrompts";

export function generateWellnessTemplate(input: BusinessInput, pricing: PricingBreakdown): TemplateResult {
  const serviceItems = input.keyServices.length > 0
    ? input.keyServices.map((s) => `- ${s}`).join("\n")
    : "- Signature Hair Styling & Color Services\n- Luxury Facial & Skin Rejuvenation\n- VIP Membership & Day Spa Packages";

  const systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${input.businessName}
${generateBaseAgentDirectives(input)}

### Niche Persona: Wellness, Beauty & Fitness
Target Business: ${input.specificType}
Location: ${input.location}

### Specific Wellness Functional Requirements:
1. **Interactive Treatment / Class Schedule Explorer**:
   - Tabbed filtering for service categories (e.g. Hair, Skin, Massage, VIP Packages).
   - Display duration in minutes (e.g., "60 min"), starting price, and one-click "Book Service" button.
2. **Before & After Transformation Gallery**:
   - Interactive slider or split comparison card showing real results with client testimonials.
3. **Stylist / Practitioner Spotlight**:
   - Bio cards with certifications, specialties, and individual calendar booking triggers.
4. **Mobile Sticky Action Bar**:
   - Floating persistent bar on mobile viewport:
     - [Book Appointment / Trial Session] (Vibrant accent button)
     - [Direct SMS / WhatsApp Consultation: text prompt]
     - [Directions & Parking]
5. **Structured Data Implementation**:
   - BeautySalon, DaySpa, or HealthClub JSON-LD schema with \`priceRange\`, \`openingHoursSpecification\`, \`telephone\`, and \`aggregateRating\`.

### Component Directory Blueprint:
\`\`\`
components/
├── navigation/WellnessNavbar.tsx (Sticky clean header with Book Now CTA)
├── hero/WellnessHero.tsx (Editorial typography, serene aesthetic, instant booking CTA)
├── treatments/TreatmentMenu.tsx (Category-based pricing grid with duration tags)
├── transformations/BeforeAfterGallery.tsx (Interactive comparison component)
├── specialists/SpecialistRoster.tsx (Practitioner bio cards & direct links)
├── booking/BookingEmbedModal.tsx (Clean iframe wrapper or custom consultation form)
└── footer/WellnessFooter.tsx (Location details, parking tips, cancellation policy)
\`\`\`
`;

  const siteMapMarkdown = `# Production Site Roadmap: ${input.businessName}
**Niche**: Wellness & Personal Care (${input.specificType})  
**Target Market**: ${input.location}  
**Architecture**: 5-Page High-Conversion Next.js Architecture

---

## 1. Five-Page Structured Architecture

### Page 1: \`/index\` (Home / Flagship Experience)
- **Hero Section**: Elegant editorial aesthetic, headline highlighting premium self-care in ${input.location}.
- **Quick Action Bar (Mobile Sticky)**: Prominent "Book Appointment" and "Call or Text Us" buttons.
- **Top Treatments Showcase**: Instant visual overview of the 3 most popular services.
- **Client Results & Reviews**: Google Reviews rating badge with 5-star testimonials.
- **First-Time Client Welcome Offer**: Subtle banner offering 15% off first treatment or complimentary consultation.

### Page 2: \`/services\` (Treatments, Pricing & Packages)
- **Comprehensive Service Menu**: Filterable by category, duration, and price points.
- **Add-On Upgrades**: Suggestions for complementary treatments (e.g., scalp massage, collagen mask).
- **Direct Booking Triggers**: Links straight into booking software (Fresha, Vagaro, Square Appointments, or Mindbody).

### Page 3: \`/team\` (Specialists & Practitioners)
- **Specialist Profiles**: Professional portraits, credentials, artistic style, and background.
- **Direct Portfolio Links**: Instagram handle links for each stylist/therapist.
- **Dedicated Booking Link**: "Book with [Name]" button passing therapist ID.

### Page 4: \`/results\` (Transformations & Client Stories)
- **Visual Transformation Grid**: Filterable by treatment category with before/after photos.
- **Client Video & Quote Testimonials**: Real local social proof.
- **FAQ Section**: Preparing for appointments, aftercare instructions, cancellation policies.

### Page 5: \`/membership\` (VIP Club, Gift Cards & Contact)
- **Monthly Membership Tiers**: Recurring client retention plan (e.g. 2 visits/mo + 10% off retail products).
- **Digital Gift Card Purchase**: One-click link to gift voucher purchase.
- **Studio Location & Hours**: Embedded Google Map, free parking instructions, and arrival guidelines.

---

## 2. Features & Technical Specification Matrix

| Feature | Implementation Specification | Conversion Impact |
| :--- | :--- | :--- |
| **Mobile Sticky Booking Bar** | Bottom fixed flex widget with calendar trigger | Eliminates bounce rate for clients booking on phone |
| **BeautySalon / DaySpa JSON-LD** | Verified schema tags in head | Secures Google Local Pack visibility in ${input.location} |
| **Interactive Service Grid** | Instant category switching with zero reloads | Reduces client hesitation by clarifying pricing & duration |
| **Two-Way Text / WhatsApp CTA** | Direct \`sms:\` or \`wa.me\` trigger | Captures clients with quick questions who dislike phone calls |
| **VIP Membership Matrix** | Tier comparison cards with recurring benefits | Increases lifetime customer value (LTV) by 2.4x |
`;

  const pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${input.businessName}
**Niche**: Wellness & Personal Care (${input.specificType})  
**Target Market**: ${input.location}  

---

## 1. Three-Tier Value Pricing Matrix

| Tier Name | Price | Core Deliverables | Ideal Client Scenario |
| :--- | :--- | :--- | :--- |
| **1. Fast-Track Solo Starter** | **${formatCurrency(pricing.floorPrice)}** (Floor) | 1-Page High-Aesthetic Landing Page, Mobile Sticky "Book Now" bar, Treatment Price List, Google Maps embed, 7-day turnaround | Solo artist/stylist needing immediate online credibility |
| **2. Signature Booking & Glow System** | **${formatCurrency(pricing.targetPrice)}** (Target - Recommended) | Complete 5-Page Next.js Architecture, Interactive Treatment Explorer, Specialist Roster, Before/After Gallery, Local SEO Schema | Established salon or boutique studio looking to fill mid-week slow slots |
| **3. VIP Studio & Client Retainer Suite** | **${formatCurrency(pricing.anchorPrice)}** (Anchor) | Everything in Signature System + Recurring VIP Membership Portal, Automated SMS Review Requester, Full Local Map Pack SEO optimization, Custom Photography Direction | Premier multi-chair salon or luxury medspa ready to dominate the local market |

---

## 2. Cold Call / In-Person Pitch Script (Quiet Mornings: Tuesday/Wednesday 10:00 AM)

**Setting**: Speak with the salon/spa owner or lead coordinator during quiet mid-week hours.

> **Agency Pitcher:**
> *"Hi [Owner Name], my name is [Your Name], I'm a local digital developer here in [City]. First off, congratulations on ${input.businessName}—your client reviews and styling work look incredible.*
> 
> *The reason I'm reaching out is that I was analyzing local beauty and wellness searches in ${input.location}. Right now, over 80% of salon bookings happen on mobile phones, often late at night when people are lying in bed.*
> 
> *When potential clients look up '${input.specificType} in ${input.location}', they want three things immediately: transparent pricing with service durations, proof of transformations, and a frictionless way to book right now without calling during business hours.*
> 
> *I put together a mobile-first prototype for ${input.businessName} with a sticky 1-tap booking flow and an interactive service menu that eliminates phone tag.*
> 
> *I'd love to text you a quick 60-second interactive link so you can tap through it on your phone. What's the best mobile number or email for you?"*

---

## 3. The Anchor-to-Target Closing Sequence

> **Agency Pitcher:**
> *"Normally, our comprehensive VIP Retainer & Studio Suite runs at **${formatCurrency(pricing.anchorPrice)}**.*
> 
> *However, looking at your immediate goals, your main focus is making sure your appointment book stays packed Tuesday through Sunday without wasting hours responding to Instagram DMs.*
> 
> *Our **Signature Booking & Glow System** at **${formatCurrency(pricing.targetPrice)}** gives you everything you need: the complete 5-page bespoke design, the interactive treatment menu with booking integrations, the transformation showcase, and full Google Local search setup.*
> 
> *If this brings in just 4 or 5 new regular clients over the next 60 days, the entire platform has paid for itself. Would you like to review the color palette and layout tomorrow at 11 AM?"*

---

${generateObjectionHandling(pricing)}
`;

  return { systemPrompt, siteMapMarkdown, pitchScriptMarkdown };
}

