import { BusinessInput, PricingBreakdown } from "../types";
import { formatCurrency } from "../utils";
import { generateBaseAgentDirectives, generateObjectionHandling, TemplateResult } from "./basePrompts";

export function generateHospitalityTemplate(input: BusinessInput, pricing: PricingBreakdown): TemplateResult {
  const serviceItems = input.keyServices.length > 0
    ? input.keyServices.map((s) => `- ${s}`).join("\n")
    : "- Artisanal Coffee & Espresso\n- Fresh Baked Pastries & Daily Specials\n- Private Event Catering";

  const systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${input.businessName}
${generateBaseAgentDirectives(input)}

### Niche Persona: Hospitality & Food & Beverage
Target Business: ${input.specificType}
Location: ${input.location}

### Specific Hospitality Functional Requirements:
1. **Interactive Digital Menu Component**:
   - Filterable tabs (e.g. All Day, Brunch, Beverages, Catering).
   - Dietary badges: Vegan (VG), Gluten-Free (GF), Dairy-Free (DF), Nut-Free.
   - High-contrast typography so patrons can read the menu in low ambient lighting or direct sunlight.
2. **Mobile Sticky Action Bar**:
   - Floating persistent footer on mobile viewport with 3 primary triggers:
     - [Reserve a Table / Order Ahead] (Primary highlight button)
     - [Call Direct: tel:+1...]
     - [Google Maps Directions: geo-link]
3. **Event / Catering Lead Magnet**:
   - Multi-step inquiry form collecting Guest Count, Date, Catering Package, and Dietary notes.
4. **Structured Data Implementation**:
   - Insert \`Restaurant\` or \`CafeOrCoffeeShop\` JSON-LD schema into \`<head>\` containing \`servesCuisine\`, \`priceRange\`, \`openingHoursSpecification\`, \`hasMenu\`, and \`address\`.

### Component Directory Blueprint:
\`\`\`
components/
├── navigation/Navbar.tsx (Desktop nav + mobile slide-out drawer)
├── hero/HospitalityHero.tsx (High-impact photography with instant Reserve/Order CTA)
├── menu/DigitalMenu.tsx (Client-side category filter with price & allergen badges)
├── social/InstagramGrid.tsx (Curated visual showcase of dishes & ambiance)
├── reviews/GoogleReviewsScroller.tsx (Star rating badges + verified customer quotes)
├── catering/CateringInquiryModal.tsx (Lead capture form with server action handler)
└── footer/HospitalityFooter.tsx (Opening hours, address, live Google Maps link, legal)
\`\`\`
`;

  const siteMapMarkdown = `# Production Site Roadmap: ${input.businessName}
**Niche**: Hospitality (${input.specificType})  
**Target Market**: ${input.location}  
**Architecture**: 5-Page High-Conversion Next.js Architecture

---

## 1. Five-Page Structured Architecture

### Page 1: \`/index\` (Home / Flagship Showcase)
- **Hero Section**: High-resolution video/photo background featuring signature offerings. Bold value proposition emphasizing atmosphere and quality in ${input.location}.
- **Quick Action Bar (Mobile Sticky)**: Immediate triggers: "Order Online", "Reserve a Table", "Get Directions".
- **Signature Highlights**: Carousel showcasing the top 3-4 customer favorites.
- **Social Proof & Google Rating**: Live badge "Rated 4.9/5 stars on Google with 250+ reviews".
- **Live Atmosphere & Hours Widget**: Dynamic "Open Now until 9 PM" badge based on visitor's current timezone.

### Page 2: \`/menu\` (Digital Interactive Menu)
- **Category Filter**: Instant switching between drinks, entrees, baked goods, and seasonal specials.
- **Menu Card Details**: High-resolution imagery, pricing, ingredient breakdown, and allergen icons.
- **Direct Order Links**: Seamless integration with local POS/ordering providers (Toast, Square, or Direct WhatsApp).
- **PDF Download**: One-click download button for offline or print-ready menus.

### Page 3: \`/story\` (Heritage, Ingredients & Team)
- **Founding Story**: Warm narrative highlighting the passion, craftsmanship, and local roots in ${input.location}.
- **Locally Sourced Ingredients**: Interactive spotlight map showing local farms and ethical suppliers.
- **Team & Head Chef/Barista Spotlight**: Humanizing photos and bio cards building community connection.

### Page 4: \`/catering\` (Private Events & B2B Catering)
- **Catering Tier Matrix**: Dropdown packages for Office Lunches, Weddings, Birthday Celebrations.
- **Smart Estimation Calculator**: Interactive slider for number of guests calculating estimated platter quantities.
- **Instant Inquiry Funnel**: Name, Date, Headcount, Budget Range with direct submission to owner's inbox.

### Page 5: \`/contact\` (Hours, Location & Parking)
- **Interactive Map**: Embedded Google Maps with one-click navigation launch.
- **Parking & Transit Info**: Clear instructions for parking stalls, bike racks, and public transit stops.
- **Direct Contact Box**: Phone click-to-call, WhatsApp chat widget, and email contact form.

---

## 2. Features & Technical Specification Matrix

| Feature | Implementation Specification | Conversion Impact |
| :--- | :--- | :--- |
| **Mobile Sticky Action Bar** | Fixed viewport bottom flex container with \`z-50\` | Increases click-to-call and reservation rate by ~38% |
| **LocalBusiness JSON-LD** | Dynamic schema script in \`app/layout.tsx\` | Ranks business higher on Google 3-Pack Map Results |
| **Digital Fast-Load Menu** | Zero-dependency client filtering | Eliminates frustrating PDF downloads for mobile diners |
| **WhatsApp / SMS Ping** | Pre-filled inquiry link (\`wa.me\` or \`sms:\`) | High response rate for immediate party bookings |
| **Google Review Slider** | Micro-interaction carousel with verified badge | Solves trust barrier for first-time walk-ins |
`;

  const pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${input.businessName}
**Niche**: Hospitality (${input.specificType})  
**Target Market**: ${input.location}  

---

## 1. Three-Tier Value Pricing Matrix

| Tier Name | Price | Core Deliverables | Ideal Client Scenario |
| :--- | :--- | :--- | :--- |
| **1. Rapid Launch Starter** | **${formatCurrency(pricing.floorPrice)}** (Floor) | 1-Page Long-Form Landing Page, Mobile Sticky Call/Directions Bar, Digital Menu section, Google Maps embed, 7-day turnaround | Client has tight budget or currently has zero web presence |
| **2. Growth Menu & Booking Hub** | **${formatCurrency(pricing.targetPrice)}** (Target - Recommended) | Complete 5-Page Next.js site, Filterable Interactive Menu, Catering Lead Inquiry Funnel, Google Reviews integration, Local SEO Schema | Established venue wanting to increase direct bookings & catering orders |
| **3. VIP Dine & Digital Order Suite** | **${formatCurrency(pricing.anchorPrice)}** (Anchor) | Everything in Growth Hub + Custom Online Ordering integration, VIP Email/SMS Loyalty capture, Professional Copywriting, 30-Day Managed Local SEO tune-up | Busy high-end cafe or restobar seeking to bypass 30% third-party app commissions |

---

## 2. Cold Walk-in / Phone Script (Slow Hours: 2:00 PM – 4:30 PM)

**Setting**: Walk into the venue or call when the lunch rush has subsided. Ask for the owner or general manager.

> **Agency Pitcher:**
> *"Hi there, my name is [Your Name]. I live right here in [Local Area], and I noticed ${input.businessName} has an incredible reputation in ${input.location}.*
> 
> *The reason I stopped in is I did a quick test of your mobile search presence compared to [Local Competitor 1] and [Local Competitor 2]. Right now, when people search on Google for '${input.specificType} near me', over 70% of potential customers are browsing on smartphones.*
> 
> *Most restaurant sites force users to pinch-to-zoom on a clunky PDF menu or wait 6 seconds for heavy images to load. We built a high-speed digital prototype specifically for ${input.businessName} that features an instant tap-to-call button, a mobile-ready interactive menu, and direct catering lead capture.*
> 
> *I don't expect a decision today—I'd just love to send you a 60-second video demo showing how this will capture an extra 15-20 catering inquiries and direct table bookings every month. Who is the best person to text or email that preview link to?"*

---

## 3. The Anchor-to-Target Closing Sequence

> **Agency Pitcher:**
> *"When we deploy custom digital systems for premier dining brands, our comprehensive VIP Suite runs at **${formatCurrency(pricing.anchorPrice)}**.*
> 
> *However, based on our conversation, what you really need right now is to capture high-margin weekend diners and secure corporate catering leads without overcomplicating your staff's workflow.*
> 
> *That is why our **Growth Menu & Booking Hub** at **${formatCurrency(pricing.targetPrice)}** is the perfect fit. We build the full 5-page architecture, set up the interactive menu and catering forms, configure your Google Local SEO Schema, and have you live within 10 business days.*
> 
> *Can we get the kickoff details started today so you have this capturing revenue by next weekend?"*

---

${generateObjectionHandling(pricing)}
`;

  return { systemPrompt, siteMapMarkdown, pitchScriptMarkdown };
}

