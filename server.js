// NOTE: This is an in-process test harness used by scratch/*.js test scripts (no external deps, fast startup). It mirrors the real app's logic for testing but is NOT started by npm run dev/build/start — the actual app runs through Next.js (see package.json). Do not deploy this file directly.
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;

// Currency Metadata & Formatting
const CURRENCY_DATA = {
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  EUR: { symbol: "€", name: "Euro", locale: "en-US" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-US" },
  CAD: { symbol: "CA$", name: "Canadian Dollar", locale: "en-US" },
  AUD: { symbol: "A$", name: "Australian Dollar", locale: "en-US" }
};

function getCurrencyInfo(code) {
  const c = (code || "USD").toUpperCase();
  return CURRENCY_DATA[c] || { symbol: "$", name: c, locale: "en-US" };
}

function calculateTierPricing(anchor, floor, currency = "USD") {
  const curr = (currency || "USD").toUpperCase();
  const info = getCurrencyInfo(curr);

  const defaultAnchor = 2500;
  const defaultFloor = 800;
  const minAnchor = 1000;
  const minDiff = 200;
  const roundStep = 50;

  const safeAnchor = Math.max(Number(anchor) || defaultAnchor, minAnchor);
  const safeFloor = Math.min(Number(floor) || defaultFloor, safeAnchor - minDiff);
  const rawTarget = safeFloor + (safeAnchor - safeFloor) * 0.45;
  const target = Math.round(rawTarget / roundStep) * roundStep;

  return {
    anchorPrice: safeAnchor,
    targetPrice: target,
    floorPrice: safeFloor,
    currency: curr,
    currencySymbol: info.symbol,
    currencyName: info.name
  };
}

function formatCurrency(amount, currency = "USD") {
  const curr = (currency || "USD").toUpperCase();
  const info = getCurrencyInfo(curr);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return info.symbol + Number(amount).toLocaleString();
  }
}

function generateObjections(pricing) {
  const curr = pricing.currency || "USD";
  return `### High-Converting Objection Handling Scripts

#### 1. "We already have an active Instagram / Facebook page and that's enough."
> **Agency Response:**
> *"Instagram is amazing for discovery, but over 64% of high-intent local buyers check Google Search or Google Maps when they are ready to spend money today. Social media algorithms bury your pricing, hours, and contact details. A dedicated, fast site gives Google the exact Local Schema signals needed to rank your business at the top of local map packs and turns casual scrollers into direct booked appointments without taking 30% platform cuts."*

#### 2. "${formatCurrency(pricing.targetPrice, curr)} (${curr}) is a bit high for our budget right now."
> **Agency Response:**
> *"I completely respect that. If we stripped out the automated multi-step booking integration and custom multi-page photography gallery, we can deploy our foundational Launch Tier today for just **${formatCurrency(pricing.floorPrice, curr)} (${curr})**. That still includes the complete mobile-optimized site, direct click-to-call, Google Business Schema integration, and our 14-day turnaround. Would that work better for your cash flow this month?"*

#### 3. "Can you just email me some information and samples?"
> **Agency Response:**
> *"I'd be glad to send over our portfolio deck, but because every local business in our area has distinct competitors on Google Maps, I actually put together a live interactive sandbox preview specifically for your brand. Can we take 5 minutes tomorrow at 10 AM on Zoom or over coffee so I can show you how this will rank in your neighborhood?"*`;
}

function generateDeliverables(input) {
  const pricing = calculateTierPricing(input.targetPriceAnchor, input.targetPriceFloor, input.currency || "USD");

  const name = input.businessName || "Local Business";
  const niche = input.niche || "hospitality";
  const type = input.specificType || "Boutique Service Provider";
  const loc = input.location || "United States";
  const services = (input.keyServices && input.keyServices.length > 0)
    ? input.keyServices
    : ["Flagship Offerings", "Specialized Services", "Direct Consultations"];
  const serviceList = services.map(s => `- ${s}`).join("\n");

  let systemPrompt = "";
  let siteMapMarkdown = "";
  let pitchScriptMarkdown = "";

  if (niche === "hospitality") {
    systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${name}
You are an elite Senior Full-Stack Next.js 14+ Developer and Conversion Rate Optimization specialist.
Your objective is to scaffold, build, and deliver a production-ready, mobile-first website for "${name}", a ${type} located in ${loc}.

### Core Tech Stack:
- Next.js 14+ (App Router with TypeScript)
- Tailwind CSS with semantic dark/light tokens
- Lucide React for crisp iconography
- JSON-LD Schema.org Restaurant structured data

### Primary Deliverables:
1. High-converting Hero Section with sticky Mobile Quick-Action Bar (Reserve Table, Call Direct, Directions).
2. Filterable Digital Menu with dietary tags (GF, Vegan, Dairy-Free).
3. B2B / Private Event Catering lead inquiry magnet.
4. Google Review proof badges (4.9★ rating).
5. Fast-load Local SEO Schema with coordinates and opening hours.

### Services:
${serviceList}`;

    siteMapMarkdown = `# Production Site Roadmap: ${name}
**Niche**: Hospitality (${type}) | **Target Market**: ${loc}
**Architecture**: 5-Page High-Conversion Next.js Setup

## 1. Five-Page Structured Architecture
- \`/index\` (Home): Hero video showcase, mobile quick-action bar (Order/Reserve/Call), Google Reviews 4.9★ slider, live hours status.
- \`/menu\` (Digital Menu): Instant category filter (Brunch, Beverages, Desserts), allergen badges, 1-click Toast/Square ordering link.
- \`/story\` (Our Heritage): Founding ethos in ${loc}, locally roasted/sourced ingredients, head barista spotlight.
- \`/catering\` (Private Events): Multi-tiered platter packages, guest headcount estimator, corporate inquiry form.
- \`/contact\` (Hours & Parking): Embedded Google Maps, parking stalls, direct click-to-call, live WhatsApp chat.

## 2. Features & Technical Specification Matrix
| Feature | Implementation | Conversion Impact |
| :--- | :--- | :--- |
| **Mobile Sticky Action Bar** | Fixed viewport bottom flex container | +38% click-to-call & table bookings |
| **LocalBusiness JSON-LD** | Dynamic schema script in <head> | High rank in Google 3-Pack Map Results |
| **Digital Fast-Load Menu** | Client-side tag filtering | Eliminates frustrating PDF downloads |
| **Google Review Slider** | Micro-interaction carousel | Solves first-time diner trust barrier |`;

    pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${name}
**Niche**: Hospitality (${type}) | **Target**: ${loc}

## 1. Three-Tier Value Pricing Matrix (${pricing.currency})
| Tier Name | Price (${pricing.currency}) | Core Deliverables |
| :--- | :--- | :--- |
| **1. Rapid Launch Starter** | **${formatCurrency(pricing.floorPrice, pricing.currency)}** (Floor) | 1-Page High-Speed Landing Page, Mobile Sticky Call/Directions Bar, Digital Menu, Google Maps embed |
| **2. Growth Menu & Booking Hub** | **${formatCurrency(pricing.targetPrice, pricing.currency)}** (Target - Rec.) | Complete 5-Page Site, Filterable Digital Menu, Catering Lead Funnel, Local SEO Schema |
| **3. VIP Dine & Order Suite** | **${formatCurrency(pricing.anchorPrice, pricing.currency)}** (Anchor) | Everything in Growth + Custom Online Ordering integration, VIP SMS Club, 30-Day Managed SEO |

## 2. Cold Walk-in / Phone Script (Slow Hours: 2:00 PM – 4:00 PM)
> *"Hi there, my name is [Your Name], I'm a local developer here in ${loc}. I love ${name} and noticed your stellar ratings.*
> *I did a quick test of your mobile search presence. Right now, over 70% of hungry locals search on smartphones. Most competitor sites force patrons to pinch-to-zoom on PDFs.*
> *We built a prototype for ${name} with a 1-tap call button, an interactive mobile menu, and catering lead capture.*
> *I put together a 60-second video demo showing how this will bring in an extra 15-20 catering orders every month. Who is the best person to text or email that link to?"*

## 3. Anchor-to-Target Closing Sequence
> *"Our full VIP Suite is typically **${formatCurrency(pricing.anchorPrice, pricing.currency)} (${pricing.currency})**.*
> *However, to get your catering and weekend bookings packed immediately, our **Growth Menu & Booking Hub** at **${formatCurrency(pricing.targetPrice, pricing.currency)} (${pricing.currency})** delivers the entire 5-page site and Google Maps schema in 10 business days.*
> *Can we get the kickoff details started today?"*

---
${generateObjections(pricing)}`;
  } else if (niche === "wellness") {
    systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${name}
You are an elite Senior Full-Stack Next.js 14+ Developer and CRO specialist.
Build a production-ready, mobile-first website for "${name}", a ${type} located in ${loc}.

### Core Tech Stack:
- Next.js 14+ (App Router with TypeScript)
- Tailwind CSS with serene, editorial beauty styling
- BeautySalon / DaySpa JSON-LD Schema
- Stylist booking integrations (Fresha, Mindbody, Acuity)

### Primary Deliverables:
1. Treatment catalog with duration in minutes and starting rates.
2. Before & After transformation gallery.
3. Stylist & practitioner bio cards.
4. Mobile sticky "Book Appointment" persistent action bar.

### Services:
${serviceList}`;

    siteMapMarkdown = `# Production Site Roadmap: ${name}
**Niche**: Wellness & Beauty (${type}) | **Target Market**: ${loc}
**Architecture**: 5-Page High-Conversion Next.js Setup

## 1. Five-Page Structured Architecture
- \`/index\` (Home): Serene editorial hero, instant Book Appointment CTA, Before/After preview, Google Review badge.
- \`/services\` (Treatments & Pricing): Duration tags (e.g. 60 min), transparent pricing, add-on treatments, direct booking embed.
- \`/team\` (Practitioners): Stylist bio portraits, credentials, Instagram links, individual calendar booking.
- \`/results\` (Transformations): Interactive before/after split sliders, client video testimonials, prep/aftercare guide.
- \`/membership\` (VIP Club & Gift Cards): Monthly recurring pamper packages, digital gift vouchers, location & parking.

## 2. Features & Technical Specification Matrix
| Feature | Implementation | Conversion Impact |
| :--- | :--- | :--- |
| **Mobile Sticky Booking Bar** | Bottom fixed viewport button | Eliminates booking bounce rate for late-night mobile shoppers |
| **BeautySalon JSON-LD** | Schema in head | Maximizes Google Local Pack rank in ${loc} |
| **Treatment Pricing Grid** | Filterable duration & rates | Cuts down phone inquiries by 60% |`;

    pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${name}
**Niche**: Wellness & Beauty (${type}) | **Target**: ${loc}

## 1. Three-Tier Value Pricing Matrix (${pricing.currency})
| Tier Name | Price (${pricing.currency}) | Core Deliverables |
| :--- | :--- | :--- |
| **1. Fast-Track Solo Starter** | **${formatCurrency(pricing.floorPrice, pricing.currency)}** (Floor) | 1-Page High-Aesthetic Site, Sticky Book Now Bar, Treatment Price List, Google Maps |
| **2. Signature Booking & Glow** | **${formatCurrency(pricing.targetPrice, pricing.currency)}** (Target - Rec.) | Complete 5-Page Site, Interactive Treatment Explorer, Specialist Roster, Before/After Gallery |
| **3. VIP Studio & Retainer** | **${formatCurrency(pricing.anchorPrice, pricing.currency)}** (Anchor) | Everything + Recurring VIP Club, Automated SMS Review Requester, Local Map Pack SEO |

## 2. Cold Outreach Script (Tuesday/Wednesday Mornings 10:00 AM)
> *"Hi [Owner Name], my name is [Your Name], I'm a local developer in ${loc}. Congratulations on ${name}—your client transformations look stunning.*
> *Over 80% of salon bookings happen on phones late at night. When potential clients look up '${type} in ${loc}', they want 3 things: clear pricing with treatment times, real transformation proof, and instant booking without phone tag.*
> *We built a prototype for ${name} with a 1-tap booking flow. I'd love to text you a 60-second interactive link. What's the best cell number for you?"*

---
${generateObjections(pricing)}`;
  } else if (niche === "clinics") {
    systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${name}
You are an elite Senior Full-Stack Developer specializing in high-trust healthcare platforms.
Build a production-ready website for "${name}", a ${type} located in ${loc}.

### Core Tech Stack:
- Next.js 14+ (App Router with TypeScript)
- Tailwind CSS with crisp slate & cyan trust tokens
- MedicalClinic / Dentist JSON-LD Schema
- HIPAA-friendly patient intake request workflows

### Primary Deliverables:
1. Emergency / Same-Day Consultation sticky mobile dialer.
2. Doctor credentials, board certifications, and university affiliations.
3. Insurance carriers accepted ticker with instant search.
4. New patient intake paperwork downloads.

### Services:
${serviceList}`;

    siteMapMarkdown = `# Production Site Roadmap: ${name}
**Niche**: Clinics & Healthcare (${type}) | **Target Market**: ${loc}
**Architecture**: 5-Page High-Conversion Next.js Setup

## 1. Five-Page Structured Architecture
- \`/index\` (Practice Overview): Reassuring clinical hero, 4.9★ Google rating, emergency click-to-call, insurance ticker.
- \`/treatments\` (Procedures): Indications, recovery timelines, pain-free technology highlights, procedure consultation CTA.
- \`/doctors\` (Meet the Physicians): Education, board certifications, personal notes for nervous patients, hospital affiliations.
- \`/patients\` (Patient Center): Online intake forms, accepted insurance plans, 0% financing options, first-visit roadmap.
- \`/contact\` (Hours & Emergency): Interactive Google Map, parking guide, after-hours emergency line, consultation form.

## 2. Features & Technical Specification Matrix
| Feature | Implementation | Conversion Impact |
| :--- | :--- | :--- |
| **Emergency Tap-to-Call** | High-contrast mobile sticky dialer | Converts urgent high-value patients in 15 seconds |
| **MedicalClinic Schema** | Structured JSON-LD | Dominates Google Maps searches for "doctor near me" |
| **Insurance Badges** | Carrier logo matrix | Overcomes the #1 patient hesitation to booking |`;

    pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${name}
**Niche**: Clinics & Healthcare (${type}) | **Target**: ${loc}

## 1. Three-Tier Value Pricing Matrix (${pricing.currency})
| Tier Name | Price (${pricing.currency}) | Core Deliverables |
| :--- | :--- | :--- |
| **1. Modern Practice Foundation** | **${formatCurrency(pricing.floorPrice, pricing.currency)}** (Floor) | 1-Page Authority Page, Emergency Call button, Core Procedures List, Insurance Badges |
| **2. Clinical Growth Hub** | **${formatCurrency(pricing.targetPrice, pricing.currency)}** (Target - Rec.) | 5-Page Site, Multi-Step Appointment Request, Doctor Profiles, Insurance Directory, Medical Schema |
| **3. Premier Clinic Authority** | **${formatCurrency(pricing.anchorPrice, pricing.currency)}** (Anchor) | Everything + Digital Intake Form Integration, Patient Video Showcase, Local Map Pack Campaign |


## 2. Cold Phone Script (8:30 AM or 12:30 PM)
> *"Hi [Practice Manager Name], my name is [Your Name], I'm a healthcare web specialist based in ${loc}.*
> *A single new patient in your specialty has an average lifetime value between $1,500 and $4,500.*
> *When patients search for '${type} in ${loc}' on phones, they need immediate phone access, insurance clarity, and trust.*
> *We developed a modern clinical website framework for ${name} with an emergency tap-to-call bar and insurance intake funnel. If this brings just 2 new patients this month, it pays for itself. What is the best email to send a 90-second walkthrough?"*

---
${generateObjections(pricing)}`;
  } else {
    // General Services
    systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${name}
You are an elite Senior Full-Stack Next.js 14+ Developer and Conversion Rate Optimization specialist.
Build a production-ready, mobile-first website for "${name}", a ${type} located in ${loc}.

### Core Tech Stack:
- Next.js 14+ (App Router with TypeScript)
- Tailwind CSS with bold, authoritative trades & service tokens
- ProfessionalService / HomeAndConstructionBusiness JSON-LD Schema
- Multi-step instant estimate and quote calculators

### Primary Deliverables:
1. 24/7 Direct Dispatch / Emergency Tap-to-Call sticky mobile bar.
2. Multi-step Free Estimate request funnel.
3. Service area zip code checker.
4. "Licensed, Bonded & Insured" verification badges and Google Reviews slider.

### Services:
${serviceList}`;

    siteMapMarkdown = `# Production Site Roadmap: ${name}
**Niche**: Professional Services (${type}) | **Target Market**: ${loc}
**Architecture**: 5-Page High-Conversion Next.js Setup

## 1. Five-Page Structured Architecture
- \`/index\` (Conversion Hub): High-urgency hero with fast turnaround guarantee, 24/7 tap-to-call, zip code checker, licensed & insured proof.
- \`/services\` (Service Catalog): Comprehensive residential & commercial service matrix with transparent starting prices.
- \`/projects\` (Completed Work): High-resolution before & after project galleries in ${loc}, homeowner case studies.
- \`/service-areas\` (Local SEO Suburbs): Dedicated landing pages targeting local zip codes and neighboring towns to rank on Google.
- \`/contact\` (Free Quote & Dispatch): Photo upload for quick preliminary estimate, direct dispatch hotline, address.

## 2. Features & Technical Specification Matrix
| Feature | Implementation | Conversion Impact |
| :--- | :--- | :--- |
| **Mobile Direct Dispatch Bar** | Fixed viewport bottom tap-to-call bar | Captures emergency high-intent home repair calls |
| **Local Service Schema** | ProfessionalService JSON-LD in head | Maximizes Google 3-Pack rank across target zip codes |
| **Interactive Estimate Request** | Multi-step client lead form | Generates 3x more qualified leads than standard contact forms |`;


    pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${name}
**Niche**: Professional Services (${type}) | **Target**: ${loc}

## 1. Three-Tier Value Pricing Matrix (${pricing.currency})
- **Floor Tier (${formatCurrency(pricing.floorPrice, pricing.currency)} ${pricing.currency})**: 1-Page High-Conversion Lead Page, Tap-to-Call Emergency Bar, Google Maps.
- **Target Tier (${formatCurrency(pricing.targetPrice, pricing.currency)} ${pricing.currency})**: Complete 5-Page Site, Multi-Step Free Estimate Funnel, Service Areas Map, Local Schema.
- **Anchor Tier (${formatCurrency(pricing.anchorPrice, pricing.currency)} ${pricing.currency})**: Everything + Suburb SEO Pages, Automated Review Request Pipeline, Instant SMS Dispatch.


---
${generateObjections(pricing)}`;
  }

  return {
    systemPrompt,
    siteMapMarkdown,
    pitchScriptMarkdown,
    pricing,
  };
}

// HTML Shell Generator
function renderHTML(title, content) {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              500: '#6366f1',
              600: '#4f46e5',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #090d16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .glow-indigo { box-shadow: 0 0 50px -10px rgba(99, 102, 241, 0.25); }
    .glow-emerald { box-shadow: 0 0 50px -10px rgba(16, 185, 129, 0.25); }
    pre { white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
  <!-- Top Navigation -->
  <header class="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
          ⚡
        </div>
        <span class="text-base font-bold text-white tracking-tight">Local Client Engine</span>
      </a>

      <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
        <a href="/" class="hover:text-white transition-colors">Home</a>
        <a href="/dashboard" class="hover:text-white transition-colors">Subscriber Dashboard</a>
        <a href="/dashboard/generator" class="hover:text-white transition-colors text-indigo-400 font-bold">Studio Generator</a>
      </nav>

      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Whop Pro Subscriber</span>
        </div>
        <a href="/dashboard/generator" class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all">
          Open Generator
        </a>
      </div>
    </div>
  </header>

  <div class="flex-1">
    ${content}
  </div>

  <!-- Global Footer -->
  <footer class="mt-auto border-t border-slate-800/80 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="text-indigo-400 font-bold">⚡ The Local Client Engine</span>
        <span>• Whop Membership SaaS</span>
      </div>
      <div class="flex items-center gap-6">
        <a href="/dashboard" class="hover:text-slate-300">Dashboard</a>
        <a href="/dashboard/generator" class="hover:text-slate-300">Studio Generator</a>
        <a href="https://whop.com" target="_blank" class="hover:text-slate-300">Whop App Store</a>
      </div>
    </div>
  </footer>

  <!-- Universal Currency Chooser Modal -->
  <div id="currencyModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <span class="text-2xl">🌐</span>
          <div>
            <h3 class="text-base font-bold text-white">Choose Your Currency</h3>
            <p id="currencyModalSubtitle" class="text-xs text-slate-400">Please choose the currency to use for pricing:</p>
          </div>
        </div>
        <button onclick="closeCurrencyModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg font-bold">✕</button>
      </div>

      <div class="grid grid-cols-2 gap-2.5">
        <button onclick="handleCurrencyModalSelect('USD')" class="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all">
          <div>
            <div class="text-xs font-bold text-white">USD ($)</div>
            <div class="text-[10px] text-slate-400">US Dollar</div>
          </div>
          <span class="text-xs font-mono font-bold text-indigo-400">$</span>
        </button>

        <button onclick="handleCurrencyModalSelect('INR')" class="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all">
          <div>
            <div class="text-xs font-bold text-white">INR (₹)</div>
            <div class="text-[10px] text-slate-400">Indian Rupee</div>
          </div>
          <span class="text-xs font-mono font-bold text-indigo-400">₹</span>
        </button>

        <button onclick="handleCurrencyModalSelect('EUR')" class="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all">
          <div>
            <div class="text-xs font-bold text-white">EUR (€)</div>
            <div class="text-[10px] text-slate-400">Euro</div>
          </div>
          <span class="text-xs font-mono font-bold text-indigo-400">€</span>
        </button>

        <button onclick="handleCurrencyModalSelect('GBP')" class="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all">
          <div>
            <div class="text-xs font-bold text-white">GBP (£)</div>
            <div class="text-[10px] text-slate-400">British Pound</div>
          </div>
          <span class="text-xs font-mono font-bold text-indigo-400">£</span>
        </button>

        <button onclick="handleCurrencyModalSelect('CAD')" class="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all">
          <div>
            <div class="text-xs font-bold text-white">CAD (CA$)</div>
            <div class="text-[10px] text-slate-400">Canadian Dollar</div>
          </div>
          <span class="text-xs font-mono font-bold text-indigo-400">CA$</span>
        </button>

        <button onclick="handleCurrencyModalSelect('AUD')" class="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all">
          <div>
            <div class="text-xs font-bold text-white">AUD (A$)</div>
            <div class="text-[10px] text-slate-400">Australian Dollar</div>
          </div>
          <span class="text-xs font-mono font-bold text-indigo-400">A$</span>
        </button>
      </div>

      <div class="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400">
        💡 All price tags, pitch matrices, and closing scripts will automatically calculate in the selected currency.
      </div>
    </div>
  </div>

  <!-- Global Floating Toast Notification -->
  <div id="globalToast" class="fixed bottom-6 right-6 px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-white text-xs font-medium shadow-2xl transition-all duration-300 opacity-0 pointer-events-none z-50 flex items-center gap-2">
    <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
    <span id="globalToastText">Notification</span>
  </div>

  <script>
    let currencyModalContext = null;

    function openCurrencyModal(msg, context) {
      const modal = document.getElementById('currencyModal');
      const subtitle = document.getElementById('currencyModalSubtitle');
      if (subtitle && msg) subtitle.innerText = msg;
      currencyModalContext = context || null;
      if (modal) modal.classList.remove('hidden');
    }

    function closeCurrencyModal() {
      const modal = document.getElementById('currencyModal');
      if (modal) modal.classList.add('hidden');
    }

    function showGlobalToast(msg) {
      const toast = document.getElementById('globalToast');
      const toastText = document.getElementById('globalToastText');
      if (toast && toastText) {
        toastText.innerText = msg;
        toast.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          toast.classList.add('opacity-0', 'pointer-events-none');
        }, 3000);
      }
    }

    const PLAN_PRICING = {
      USD: { starter: '$29', starterBtn: 'Get Starter ($29)', pro: '$19', proBtn: 'Start Pro Membership ($19/mo)' },
      INR: { starter: '₹2,499', starterBtn: 'Get Starter (₹2,499)', pro: '₹1,599', proBtn: 'Start Pro Membership (₹1,599/mo)' },
      EUR: { starter: '€27', starterBtn: 'Get Starter (€27)', pro: '€18', proBtn: 'Start Pro Membership (€18/mo)' },
      GBP: { starter: '£23', starterBtn: 'Get Starter (£23)', pro: '£15', proBtn: 'Start Pro Membership (£15/mo)' },
      CAD: { starter: 'CA$39', starterBtn: 'Get Starter (CA$39)', pro: 'CA$26', proBtn: 'Start Pro Membership (CA$26/mo)' },
      AUD: { starter: 'A$45', starterBtn: 'Get Starter (A$45)', pro: 'A$29', proBtn: 'Start Pro Membership (A$29/mo)' }
    };

    const DEMO_PRICING = {
      USD: { floor: '$800', target: '$1,500', anchor: '$2,500', sym: '$' },
      INR: { floor: '₹45,000', target: '₹92,000', anchor: '₹1,50,000', sym: '₹' },
      EUR: { floor: '€750', target: '€1,500', anchor: '€2,400', sym: '€' },
      GBP: { floor: '£700', target: '£1,400', anchor: '£2,200', sym: '£' },
      CAD: { floor: 'CA$1,100', target: 'CA$2,050', anchor: 'CA$3,200', sym: 'CA$' },
      AUD: { floor: 'A$1,200', target: 'A$2,250', anchor: 'A$3,500', sym: 'A$' }
    };

    function handleCurrencyModalSelect(curr) {
      closeCurrencyModal();

      // If on generator page
      const currSelect = document.getElementById('currency');
      if (currSelect) {
        currSelect.value = curr;
        if (typeof handleCurrencyChange === 'function') {
          handleCurrencyChange(curr);
        }
        showGlobalToast('✓ Currency set to ' + curr);
        return;
      }

      // If on landing page
      updateLandingPageCurrency(curr);
      showGlobalToast('✓ Currency set to ' + curr + '! Redirecting to Studio...');
      if (currencyModalContext === 'starter' || currencyModalContext === 'pro') {
        setTimeout(() => {
          window.location.href = '/dashboard/generator?currency=' + curr;
        }, 700);
      }
    }

    function updateLandingPageCurrency(curr) {
      const plan = PLAN_PRICING[curr] || PLAN_PRICING.USD;
      const starterPriceEl = document.getElementById('starterPrice');
      const starterBtnEl = document.getElementById('starterBtn');
      const proPriceEl = document.getElementById('proPrice');
      const proBtnEl = document.getElementById('proBtn');

      if (starterPriceEl) starterPriceEl.innerHTML = plan.starter + ' <span class="text-xs text-slate-400 font-normal">one-time</span>';
      if (starterBtnEl) starterBtnEl.innerText = plan.starterBtn;
      if (proPriceEl) proPriceEl.innerHTML = plan.pro + ' <span class="text-xs text-slate-400 font-normal">/ month</span>';
      if (proBtnEl) proBtnEl.innerText = plan.proBtn;

      // Update demo pricing
      const demo = DEMO_PRICING[curr] || DEMO_PRICING.USD;
      const demoFloor = document.getElementById('demoFloor');
      const demoTarget = document.getElementById('demoTarget');
      const demoAnchor = document.getElementById('demoAnchor');
      const demoCurrBadge = document.getElementById('demoCurrBadge');

      if (demoFloor) demoFloor.innerText = demo.floor;
      if (demoTarget) demoTarget.innerText = demo.target;
      if (demoAnchor) demoAnchor.innerText = demo.anchor;
      if (demoCurrBadge) demoCurrBadge.innerText = curr + ' (' + demo.sym + ')';

      document.querySelectorAll('.lp-curr-btn').forEach(btn => {
        if (btn.getAttribute('data-curr') === curr) {
          btn.className = 'lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white border border-indigo-500 shadow';
        } else {
          btn.className = 'lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-slate-800';
        }
      });
    }

    function handlePriceButtonClick(plan) {
      openCurrencyModal('Please choose your currency for this ' + (plan === 'starter' ? 'Starter Pack' : 'Pro Membership') + ' price:', plan);
    }
  </script>
</body>
</html>`;
}

// Pages
function renderLandingPage() {
  const content = `
  <!-- Hero -->
  <section class="relative pt-16 pb-16 px-4 sm:px-6 overflow-hidden text-center">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
        <span>✨ Whop Membership SaaS for Web Developers & Agency Operators</span>
      </div>

      <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
        Build & Sell <span class="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">$1,500 Local Websites</span> in Under 2 Hours
      </h1>

      <p class="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Stop pitching custom code from scratch. Generate AI coding agent system prompts, full 5-page site roadmaps, and high-ticket 3-tier closing pitch scripts for cafes, clinics, and salons in 30 seconds.
      </p>

      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="/dashboard/generator" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 transition-all">
          <span>🚀 Launch Client Generator Now</span>
        </a>
        <a href="/dashboard" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200">
          <span>View Subscriber Dashboard →</span>
        </a>
      </div>

      <div class="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        <div class="flex items-center gap-1.5"><span class="text-emerald-400">✓</span> Tested on Cursor, Claude 3.5 & Antigravity</div>
        <div class="flex items-center gap-1.5"><span class="text-emerald-400">✓</span> 3-Tier Anchor Pricing Script</div>
        <div class="flex items-center gap-1.5"><span class="text-emerald-400">✓</span> Google Local Schema JSON-LD Included</div>
      </div>
    </div>
  </section>

  <!-- Live Demo Output Box -->
  <section class="py-12 px-4 sm:px-6 bg-slate-950/60 border-y border-slate-800">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="text-center space-y-2">
        <span class="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Instant Deliverable Demo</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-white">What The Engine Builds In 30 Seconds</h2>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-emerald-400 uppercase">Preset: South Congress Roasters (Austin, TX)</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="openCurrencyModal('Please choose the currency for these demo pitch tiers:', 'demo')" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-all flex items-center gap-1.5 shadow">
              <span>🌐 Choose Currency:</span>
              <span id="demoCurrBadge" class="text-emerald-400 font-mono font-bold">USD ($)</span>
            </button>
            <a href="/dashboard/generator" class="text-xs font-bold text-indigo-400 hover:text-indigo-300">Open Full Studio →</a>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div onclick="openCurrencyModal('Please choose the currency for these demo pitch tiers:', 'demo')" class="cursor-pointer p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-400 uppercase">Floor Tier</span>
              <span class="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Choose Currency ⚙</span>
            </div>
            <div id="demoFloor" class="text-2xl font-bold text-white mt-1">$800</div>
            <p class="text-[11px] text-slate-400 mt-1">1-Page Rapid Launch + Mobile Sticky Bar</p>
          </div>
          <div onclick="openCurrencyModal('Please choose the currency for these demo pitch tiers:', 'demo')" class="cursor-pointer p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 glow-emerald hover:border-emerald-400 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-emerald-400 uppercase">Target Tier (Recommended)</span>
              <span class="text-[10px] text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">Choose Currency ⚙</span>
            </div>
            <div id="demoTarget" class="text-2xl font-bold text-white mt-1">$1,500</div>
            <p class="text-[11px] text-emerald-300/80 mt-1">5-Page Next.js Architecture + Digital Menu + Schema</p>
          </div>
          <div onclick="openCurrencyModal('Please choose the currency for these demo pitch tiers:', 'demo')" class="cursor-pointer p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-400 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-indigo-400 uppercase">Anchor Tier</span>
              <span class="text-[10px] text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">Choose Currency ⚙</span>
            </div>
            <div id="demoAnchor" class="text-2xl font-bold text-white mt-1">$2,500</div>
            <p class="text-[11px] text-slate-400 mt-1">Full VIP Suite + Online Ordering + 30-Day SEO</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Cards -->
  <section class="py-16 px-4 sm:px-6">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold text-white">Whop Membership Pricing</h2>
        <p class="text-xs text-slate-400">Close just one $1,500 client and you've paid for your membership for the next 6 years.</p>
        
        <!-- Live Currency Switcher Bar -->
        <div class="flex flex-wrap items-center justify-center gap-1.5 pt-3">
          <span class="text-xs text-slate-400 mr-1.5 flex items-center gap-1"><span>🌐</span> Pricing Currency:</span>
          <button onclick="handleCurrencyModalSelect('USD')" data-curr="USD" class="lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white border border-indigo-500 shadow">USD ($)</button>
          <button onclick="handleCurrencyModalSelect('INR')" data-curr="INR" class="lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-slate-800">INR (₹)</button>
          <button onclick="handleCurrencyModalSelect('EUR')" data-curr="EUR" class="lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-slate-800">EUR (€)</button>
          <button onclick="handleCurrencyModalSelect('GBP')" data-curr="GBP" class="lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-slate-800">GBP (£)</button>
          <button onclick="handleCurrencyModalSelect('CAD')" data-curr="CAD" class="lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-slate-800">CAD (CA$)</button>
          <button onclick="handleCurrencyModalSelect('AUD')" data-curr="AUD" class="lp-curr-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-slate-800">AUD (A$)</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-white">Starter Pack</h3>
            <div id="starterPrice" onclick="handlePriceButtonClick('starter')" class="cursor-pointer text-3xl font-extrabold text-white mt-2 hover:text-indigo-300 transition-colors" title="Click to choose currency">
              $29 <span class="text-xs text-slate-400 font-normal">one-time</span>
            </div>
            <ul class="mt-4 space-y-2 text-xs text-slate-300">
              <li>✓ 10 Full Deliverable Generations</li>
              <li>✓ Hospitality & Wellness Modules</li>
              <li>✓ 3-Tier Pitch Script & Objection Pack</li>
              <li>✓ 1-Click Markdown Clipboard Export</li>
            </ul>
          </div>
          <button onclick="handlePriceButtonClick('starter')" id="starterBtn" class="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-center text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2">
            <span>Get Starter ($29)</span>
          </button>
        </div>

        <div class="p-6 rounded-2xl border border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 to-slate-900/80 glow-indigo flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center">
              <h3 class="text-base font-bold text-white">Pro Membership</h3>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">RECOMMENDED</span>
            </div>
            <div id="proPrice" onclick="handlePriceButtonClick('pro')" class="cursor-pointer text-3xl font-extrabold text-white mt-2 hover:text-indigo-300 transition-colors" title="Click to choose currency">
              $19 <span class="text-xs text-slate-400 font-normal">/ month</span>
            </div>
            <ul class="mt-4 space-y-2 text-xs text-slate-200">
              <li>✓ <strong>Unlimited</strong> AI Deliverable Generations</li>
              <li>✓ All Niche Modules (Clinics, MedSpas, Trades)</li>
              <li>✓ Private Whop Agency Mastermind Discord</li>
              <li>✓ Continuous SEO Schema & Prompt Updates</li>
            </ul>
          </div>
          <button onclick="handlePriceButtonClick('pro')" id="proBtn" class="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-center text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2">
            <span>Start Pro Membership ($19/mo)</span>
          </button>
        </div>
      </div>
    </div>
  </section>`;

  return renderHTML("Local Client Engine | Build & Sell $1,500 Local Websites", content);
}

function renderDashboardPage() {
  const content = `
  <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
    <div class="p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-slate-900/60 shadow-2xl glow-indigo">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
          <span>✓ Whop Verified Access • Pro Agency License</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Agency Operations Dashboard
        </h1>
        <p class="text-sm sm:text-base text-slate-300 mt-2 mb-6">
          Generate AI agent scaffolding instructions, mobile-first 5-page site roadmaps, and 3-tier value pricing pitch scripts with custom objection handlers.
        </p>
        <a href="/dashboard/generator" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 transition-all">
          <span>🚀 Launch Prompt & Roadmap Generator</span>
        </a>
      </div>
    </div>

    <!-- Agency Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pitches Generated</div>
        <div class="text-3xl font-extrabold text-white mt-1">24</div>
        <div class="text-xs text-emerald-400 mt-1">↑ +6 this week</div>
      </div>
      <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Deal Size</div>
        <div class="text-3xl font-extrabold text-white mt-1">$1,500</div>
        <div class="text-xs text-slate-400 mt-1">Target tier close rate: 71%</div>
      </div>
      <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Build Turnaround</div>
        <div class="text-3xl font-extrabold text-white mt-1">&lt; 2 Hours</div>
        <div class="text-xs text-slate-400 mt-1">Using Cursor & Antigravity</div>
      </div>
      <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Whop Plan</div>
        <div class="text-2xl font-bold text-white mt-1">Pro Agency</div>
        <div class="text-xs text-emerald-400 mt-1">✓ Unlimited Generations</div>
      </div>
    </div>

    <!-- Niche Cards -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-white">Pre-Loaded Niche Modules</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
          <div>
            <div class="text-2xl mb-2">☕</div>
            <h3 class="text-base font-bold text-white">Hospitality & Dining</h3>
            <p class="text-xs text-slate-400 mt-1">Cafes, bakeries, restobars. Includes digital menus, catering funnels, and Restaurant Schema.</p>
          </div>
          <a href="/dashboard/generator?niche=hospitality" class="mt-4 text-xs font-semibold text-indigo-400 hover:text-white">Build Hospitality Pitch →</a>
        </div>

        <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
          <div>
            <div class="text-2xl mb-2">✨</div>
            <h3 class="text-base font-bold text-white">Wellness & Beauty</h3>
            <p class="text-xs text-slate-400 mt-1">Salons, spas, medspas. Includes treatment duration pricing, transformation gallery, and BeautySalon schema.</p>
          </div>
          <a href="/dashboard/generator?niche=wellness" class="mt-4 text-xs font-semibold text-indigo-400 hover:text-white">Build Wellness Pitch →</a>
        </div>

        <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
          <div>
            <div class="text-2xl mb-2">🦷</div>
            <h3 class="text-base font-bold text-white">Clinics & Healthcare</h3>
            <p class="text-xs text-slate-400 mt-1">Dental, aesthetic, physio clinics. High-trust credentials, insurance badges, and MedicalClinic schema.</p>
          </div>
          <a href="/dashboard/generator?niche=clinics" class="mt-4 text-xs font-semibold text-indigo-400 hover:text-white">Build Clinic Pitch →</a>
        </div>
      </div>
    </div>
  </main>`;

  return renderHTML("Subscriber Dashboard | Local Client Engine", content);
}

function renderGeneratorPage() {
  const content = `
  <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Interactive Generation Studio</span>
        <h1 class="text-2xl font-bold text-white">Prompt, Roadmap & Pitch Assembler</h1>
      </div>
      <div id="topExportBar" class="hidden flex-wrap items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <button onclick="copyFullBundle()" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow">
          📋 Copy Full Bundle
        </button>
        <button onclick="downloadMarkdown()" class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 bg-slate-800 text-slate-200">
          ⬇ Download .md
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Generator Form (5 cols) -->
      <div class="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Presets</label>
            <span class="text-[11px] text-indigo-400">1-click fill</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="loadPreset('coffee')" class="text-left px-3 py-2 rounded-xl text-xs border border-slate-800 bg-slate-950 hover:border-indigo-500 text-slate-300 truncate">
              ☕ Austin Coffee Roasters
            </button>
            <button onclick="loadPreset('medspa')" class="text-left px-3 py-2 rounded-xl text-xs border border-slate-800 bg-slate-950 hover:border-indigo-500 text-slate-300 truncate">
              ✨ Beverly Hills MedSpa
            </button>
            <button onclick="loadPreset('dental')" class="text-left px-3 py-2 rounded-xl text-xs border border-slate-800 bg-slate-950 hover:border-indigo-500 text-slate-300 truncate">
              🦷 Miami Dental Care
            </button>
            <button onclick="loadPreset('hvac')" class="text-left px-3 py-2 rounded-xl text-xs border border-slate-800 bg-slate-950 hover:border-indigo-500 text-slate-300 truncate">
              ⚡ Dallas HVAC & Plumbing
            </button>
          </div>
        </div>

        <form id="genForm" onsubmit="handleGenerate(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Niche</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button type="button" onclick="selectNiche('hospitality')" id="niche-hospitality" class="niche-btn p-2 rounded-xl text-xs font-semibold border border-indigo-500 bg-indigo-600/20 text-indigo-300">
                ☕ Hospitality
              </button>
              <button type="button" onclick="selectNiche('wellness')" id="niche-wellness" class="niche-btn p-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-400">
                ✨ Wellness
              </button>
              <button type="button" onclick="selectNiche('clinics')" id="niche-clinics" class="niche-btn p-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-400">
                🦷 Clinics
              </button>
              <button type="button" onclick="selectNiche('general_services')" id="niche-general_services" class="niche-btn p-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-400">
                ⚡ Services
              </button>
            </div>
            <input type="hidden" id="niche" value="hospitality">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Business Name *</label>
              <input type="text" id="businessName" required value="South Congress Roasters" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Specific Type</label>
              <input type="text" id="specificType" value="Specialty Coffee Roastery & Cafe" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Location / City *</label>
            <input type="text" id="location" required value="Austin, TX" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500">
          </div>

          <!-- Currency & Pricing Configuration -->
          <div class="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pricing Currency
              </label>
              <button type="button" onclick="openCurrencyModal('Please choose your pricing currency for Anchor & Floor:');" class="px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-500/40 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 flex items-center gap-1.5 transition-all shadow">
                <span>🌐 Choose Currency</span>
                <span id="currencyBadge" class="font-mono text-emerald-400">USD ($)</span>
              </button>
            </div>

            <select id="currency" onchange="handleCurrencyChange(this.value)" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500">
              <option value="USD" selected>USD ($) — United States Dollar</option>
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="CAD">CAD (CA$) — Canadian Dollar</option>
              <option value="AUD">AUD (A$) — Australian Dollar</option>
            </select>

            <div class="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label id="anchorLabel" class="block text-xs font-medium text-slate-300 mb-1 cursor-pointer hover:text-indigo-400" onclick="openCurrencyModal('Please choose the currency for Anchor & Floor pricing:');">
                  Anchor Price (USD $)
                </label>
                <input type="number" id="targetPriceAnchor" value="2500" min="50" step="50" onclick="openCurrencyModal('Please choose the currency for Anchor & Floor pricing:');" title="Click to choose currency" class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer">
                <span class="text-[10px] text-slate-500">VIP package anchor</span>
              </div>
              <div>
                <label id="floorLabel" class="block text-xs font-medium text-slate-300 mb-1 cursor-pointer hover:text-indigo-400" onclick="openCurrencyModal('Please choose the currency for Anchor & Floor pricing:');">
                  Floor Price (USD $)
                </label>
                <input type="number" id="targetPriceFloor" value="800" min="25" step="25" onclick="openCurrencyModal('Please choose the currency for Anchor & Floor pricing:');" title="Click to choose currency" class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer">
                <span class="text-[10px] text-slate-500">Base walk-away price</span>
              </div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>* Currency selected is used in all pitch scripts.</span>
              <button type="button" onclick="openCurrencyModal('Please choose the currency for Anchor & Floor pricing:');" class="text-indigo-400 hover:text-indigo-300 underline">
                Choose Currency →
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Key Services (comma separated)</label>
            <input type="text" id="keyServices" value="Nitro Cold Brew, Single-Origin Pour Over, Pastry Catering" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500">
          </div>

          <button type="submit" id="submitBtn" class="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 transition-all">
            ✨ Generate Client Deliverables
          </button>
        </form>
      </div>

      <!-- Right Column: Output Viewer (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <div id="outputTabs" class="hidden flex items-center justify-between p-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <div class="flex items-center gap-2">
            <button onclick="switchTab('roadmap')" id="tab-roadmap" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow">
              🗺 5-Page Architecture
            </button>
            <button onclick="switchTab('pitch')" id="tab-pitch" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
              💰 3-Tier Pitch Script
            </button>
            <button onclick="switchTab('prompt')" id="tab-prompt" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
              🤖 AI Agent System Prompt
            </button>
          </div>
          <button onclick="copyCurrentTab()" class="px-2.5 py-1 rounded-lg text-xs border border-slate-700 bg-slate-800 text-slate-300 hover:text-white">
            Copy Section
          </button>
        </div>

        <div id="emptyState" class="h-[550px] rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div class="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl">
            ⚡
          </div>
          <h3 class="text-lg font-bold text-white">Client Engine Ready</h3>
          <p class="text-xs text-slate-400 max-w-sm">Select a preset on the left or enter your client's details, then click "Generate Client Deliverables".</p>
        </div>

        <div id="outputContainer" class="hidden space-y-4">
          <!-- Pricing Ribbon (when pitch is active) -->
          <div id="pricingRibbon" class="grid grid-cols-3 gap-3"></div>

          <!-- Code/Markdown View -->
          <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl">
            <pre id="outputPre" class="text-xs font-mono text-slate-200 leading-relaxed max-h-[600px] overflow-y-auto"></pre>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    let currentData = null;
    let currentTab = 'roadmap';

    const presets = {
      coffee: {
        niche: 'hospitality',
        businessName: 'South Congress Roasters',
        specificType: 'Specialty Coffee Roastery & Cafe',
        location: 'Austin, TX',
        targetPriceAnchor: 2500,
        targetPriceFloor: 800,
        keyServices: 'Nitro Cold Brew, Single-Origin Pour Over, Pastry Catering'
      },
      medspa: {
        niche: 'wellness',
        businessName: 'Lumière Aesthetics & Skin',
        specificType: 'Luxury Medical Spa & Laser Clinic',
        location: 'Beverly Hills, CA',
        targetPriceAnchor: 3200,
        targetPriceFloor: 1200,
        keyServices: 'HydraFacial Glow, Laser Skin Resurfacing, Botox, VIP Membership'
      },
      dental: {
        niche: 'clinics',
        businessName: 'Biscayne Bay Dental Care',
        specificType: 'Modern Cosmetic & Family Dentistry',
        location: 'Miami, FL',
        targetPriceAnchor: 2800,
        targetPriceFloor: 950,
        keyServices: 'Invisalign Clear Aligners, Emergency Relief, Teeth Whitening'
      },
      hvac: {
        niche: 'general_services',
        businessName: 'Apex Heating & Air',
        specificType: 'Residential & Commercial HVAC Services',
        location: 'Dallas, TX',
        targetPriceAnchor: 2400,
        targetPriceFloor: 850,
        keyServices: '24/7 AC Repair, Furnace Installation, Duct Cleaning'
      }
    };

    function loadPreset(key) {
      const p = presets[key];
      selectNiche(p.niche);
      document.getElementById('businessName').value = p.businessName;
      document.getElementById('specificType').value = p.specificType;
      document.getElementById('location').value = p.location;
      document.getElementById('targetPriceAnchor').value = p.targetPriceAnchor;
      document.getElementById('targetPriceFloor').value = p.targetPriceFloor;
      document.getElementById('keyServices').value = p.keyServices;
      handleGenerate(new Event('submit'));
    }

    function selectNiche(niche) {
      document.getElementById('niche').value = niche;
      document.querySelectorAll('.niche-btn').forEach(b => {
        b.className = 'niche-btn p-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-400';
      });
      const active = document.getElementById('niche-' + niche);
      if (active) {
        active.className = 'niche-btn p-2 rounded-xl text-xs font-semibold border border-indigo-500 bg-indigo-600/20 text-indigo-300';
      }
    }

    function handleCurrencyChange(curr) {
      const symbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$' };
      const sym = symbols[curr] || '$';
      document.getElementById('anchorLabel').innerText = 'Anchor Price (' + curr + ' ' + sym + ')';
      document.getElementById('floorLabel').innerText = 'Floor Price (' + curr + ' ' + sym + ')';
      document.getElementById('currencyBadge').innerText = curr + ' (' + sym + ')';

      const anchorEl = document.getElementById('targetPriceAnchor');
      const floorEl = document.getElementById('targetPriceFloor');
      if (curr === 'INR' && Number(anchorEl.value) <= 5000) {
        anchorEl.value = 150000;
        floorEl.value = 45000;
      } else if (curr !== 'INR' && Number(anchorEl.value) >= 20000) {
        anchorEl.value = 2500;
        floorEl.value = 800;
      }
      handleGenerate(new Event('submit'));
    }

    async function handleGenerate(e) {
      if (e) e.preventDefault();
      const payload = {
        businessName: document.getElementById('businessName').value,
        niche: document.getElementById('niche').value,
        specificType: document.getElementById('specificType').value,
        location: document.getElementById('location').value,
        targetPriceAnchor: Number(document.getElementById('targetPriceAnchor').value),
        targetPriceFloor: Number(document.getElementById('targetPriceFloor').value),
        currency: document.getElementById('currency').value,
        keyServices: document.getElementById('keyServices').value.split(',').map(s => s.trim()).filter(Boolean)
      };

      const btn = document.getElementById('submitBtn');
      btn.innerText = 'Generating Deliverables...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        currentData = json.data;
        renderOutput();
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        btn.innerText = '✨ Generate Client Deliverables';
        btn.disabled = false;
      }
    }

    function renderOutput() {
      if (!currentData) return;
      document.getElementById('emptyState').classList.add('hidden');
      document.getElementById('outputTabs').classList.remove('hidden');
      document.getElementById('outputContainer').classList.remove('hidden');
      document.getElementById('topExportBar').classList.remove('hidden');

      const ribbon = document.getElementById('pricingRibbon');
      if (currentData.pricing) {
        const sym = currentData.pricing.currencySymbol || '$';
        const curr = currentData.pricing.currency || 'USD';
        ribbon.innerHTML = \`
          <div onclick="openCurrencyModal('Please choose the currency for your client deliverables:');" class="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-indigo-500/50 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-slate-400 uppercase">Floor Price (\${curr})</span>
              <span class="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Change ⚙</span>
            </div>
            <div class="text-xl font-bold text-white mt-0.5">\${sym}\${currentData.pricing.floorPrice.toLocaleString()}</div>
          </div>
          <div onclick="openCurrencyModal('Please choose the currency for your client deliverables:');" class="cursor-pointer p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-emerald-400 uppercase">Target (\${curr}) (Recommended)</span>
              <span class="text-[10px] text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">Change ⚙</span>
            </div>
            <div class="text-xl font-bold text-white mt-0.5">\${sym}\${currentData.pricing.targetPrice.toLocaleString()}</div>
          </div>
          <div onclick="openCurrencyModal('Please choose the currency for your client deliverables:');" class="cursor-pointer p-3 rounded-xl border border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400 transition-all group">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-indigo-400 uppercase">Anchor Price (\${curr})</span>
              <span class="text-[10px] text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">Change ⚙</span>
            </div>
            <div class="text-xl font-bold text-white mt-0.5">\${sym}\${currentData.pricing.anchorPrice.toLocaleString()}</div>
          </div>
        \`;
      }

      switchTab(currentTab);
    }

    function switchTab(tab) {
      currentTab = tab;
      ['roadmap', 'pitch', 'prompt'].forEach(t => {
        const b = document.getElementById('tab-' + t);
        if (t === tab) {
          b.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow';
        } else {
          b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white';
        }
      });

      const pre = document.getElementById('outputPre');
      if (tab === 'roadmap') pre.textContent = currentData.siteMapMarkdown;
      if (tab === 'pitch') pre.textContent = currentData.pitchScriptMarkdown;
      if (tab === 'prompt') pre.textContent = currentData.systemPrompt;
    }

    function showToast(msg) {
      let toast = document.getElementById('toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-white text-xs font-semibold shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-none';
        document.body.appendChild(toast);
      }
      toast.innerHTML = '<span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span><span>' + msg + '</span>';
      toast.classList.remove('translate-y-4', 'opacity-0', 'pointer-events-none');
      setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0', 'pointer-events-none');
      }, 2500);
    }

    function safeCopy(text, label) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(label + ' copied to clipboard!');
        }).catch(() => fallbackCopy(text, label));
      } else {
        fallbackCopy(text, label);
      }
    }

    function fallbackCopy(text, label) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast(label + ' copied to clipboard!');
      } catch (e) {
        prompt('Copy your deliverables below (Ctrl+C / Cmd+C):', text);
      }
      document.body.removeChild(ta);
    }

    function copyCurrentTab() {
      const pre = document.getElementById('outputPre');
      safeCopy(pre.textContent, 'Current section');
    }

    function copyFullBundle() {
      if (!currentData) return;
      const b = \`=============================================
LOCAL CLIENT ENGINE DELIVERABLE BUNDLE
=============================================

1. AI AGENT SYSTEM PROMPT:
---------------------------------------------
\${currentData.systemPrompt}

2. 5-PAGE SITE ROADMAP & MATRIX:
---------------------------------------------
\${currentData.siteMapMarkdown}

3. 3-TIER PITCH SCRIPT & OBJECTIONS:
---------------------------------------------
\${currentData.pitchScriptMarkdown}
\`;
      safeCopy(b, 'Full Deliverable Bundle');
    }

    function downloadMarkdown() {
      if (!currentData) return;
      const b = \`# Client Deliverables Pack\\n\\n\${currentData.siteMapMarkdown}\\n\\n\${currentData.pitchScriptMarkdown}\\n\\n\${currentData.systemPrompt}\`;
      const blob = new Blob([b], { type: 'text/markdown;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'local-client-deliverables.md';
      a.click();
      showToast('Downloaded local-client-deliverables.md');
    }

    // Auto-generate on first page load & support URL ?niche= and ?currency= parameters
    window.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const urlCurrency = params.get('currency');
      if (urlCurrency && ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD'].includes(urlCurrency.toUpperCase())) {
        document.getElementById('currency').value = urlCurrency.toUpperCase();
        handleCurrencyChange(urlCurrency.toUpperCase());
      }

      const urlNiche = params.get('niche');
      if (urlNiche) {
        if (urlNiche === 'wellness') loadPreset('medspa');
        else if (urlNiche === 'clinics') loadPreset('dental');
        else if (urlNiche === 'general_services') loadPreset('hvac');
        else loadPreset('coffee');
      } else {
        handleGenerate(new Event('submit'));
      }
    });
  </script>`;

  return renderHTML("Interactive Generator Studio | Local Client Engine", content);
}

// Session & Auth Utilities
const SESSION_COOKIE_NAME = "whop_session";
const SESSION_TTL_SECONDS = 86400;

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64").toString("utf-8");
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set (32+ chars) — no fallback is provided. " +
      "Generate one with: openssl rand -base64 32"
    );
  }
  return secret;
}

// Fail closed immediately on module load if SESSION_SECRET is unset or invalid
getSessionSecret();

function createSessionToken(user) {
  const secret = getSessionSecret();
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url || "",
    hasAccess: user.hasAccess,
    membershipPlan: user.membershipPlan || "",
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;
  try {
    const secret = getSessionSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Membership Revocation Store
const revokedUsers = new Map();
const membershipStore = {
  markRevoked(userId, revokedAtSeconds = Math.floor(Date.now() / 1000)) {
    if (userId) revokedUsers.set(userId, revokedAtSeconds);
  },
  markActive(userId) {
    if (userId) revokedUsers.delete(userId);
  },
  isRevoked(userId, sinceIssuedAtSeconds) {
    if (!userId) return false;
    const revokedAt = revokedUsers.get(userId);
    if (revokedAt === undefined) return false;
    if (sinceIssuedAtSeconds !== undefined) {
      return revokedAt >= sinceIssuedAtSeconds;
    }
    return true;
  }
};

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length >= 2) {
      list[parts[0].trim()] = decodeURIComponent(parts.slice(1).join("=").trim());
    }
  });
  return list;
}

function getDevMockUser() {
  return {
    id: "user_dev_agency_pro",
    username: "AgencyProBuilder",
    email: "operator@localclientengine.com",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    hasAccess: true,
    membershipPlan: "Pro Membership ($19/mo)",
  };
}

function isDevBypassEnabled() {
  return process.env.DEV_BYPASS_ENABLED === "true" && process.env.NODE_ENV !== "production";
}

// Request Handler
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost:3000"}`);
  const pathname = parsedUrl.pathname;
  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies[SESSION_COOKIE_NAME];

  // Verify session and revocation status
  let userSession = null;
  if (sessionToken) {
    const verified = verifySessionToken(sessionToken);
    if (verified && verified.userId && verified.hasAccess) {
      if (!membershipStore.isRevoked(verified.userId, verified.iat)) {
        userSession = verified;
      }
    }
  }

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, whop-signature");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/whop-verify or /api/dodo-verify
  if ((pathname === "/api/whop-verify" || pathname === "/api/dodo-verify") && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    if (userSession && userSession.hasAccess) {
      res.end(JSON.stringify({
        authenticated: true,
        licenseKey: userSession.licenseKey || "ACTIVE",
        tier: userSession.tier || "PRO",
        username: userSession.username || "Studio Pro Member",
        provider: userSession.provider || "dodo",
      }));
    } else {
      res.end(JSON.stringify({ authenticated: false }));
    }
    return;
  }

  // POST /api/whop-verify or /api/dodo-verify
  if ((pathname === "/api/whop-verify" || pathname === "/api/dodo-verify") && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      let reqBody = {};
      try { reqBody = JSON.parse(body || "{}"); } catch {}
      const { licenseKey } = reqBody;
      if (!licenseKey || typeof licenseKey !== "string" || !licenseKey.trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Please enter a valid Dodo Payments license key." }));
        return;
      }
      const trimmedKey = licenseKey.trim();
      const masterPasskey = process.env.MASTER_PASSKEY || "DEMO-DODO-2026";
      let isValid = false;
      if (
        trimmedKey === "DEMO-DODO-2026" ||
        trimmedKey === "DEMO-WHOP-2026" ||
        trimmedKey === masterPasskey
      ) {
        isValid = true;
      } else if (
        trimmedKey.startsWith("dodo_") ||
        trimmedKey.startsWith("lic_") ||
        trimmedKey.startsWith("whop_") ||
        trimmedKey.startsWith("pass_") ||
        trimmedKey.length >= 12
      ) {
        isValid = true;
      }
      if (!isValid) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid license key." }));
        return;
      }
      const mockUser = {
        id: `dodo_${trimmedKey.slice(0, 16)}`,
        username: (trimmedKey === "DEMO-DODO-2026" || trimmedKey === "DEMO-WHOP-2026") ? "Demo Agency Operator" : "Studio Pro Member",
        email: "subscriber@dodopayments.member",
        hasAccess: true,
        membershipPlan: "Freelance Studio OS (PRO)",
        licenseKey: trimmedKey,
        tier: "PRO",
      };
      const token = createSessionToken(mockUser);
      const isProd = process.env.NODE_ENV === "production";
      const SEVEN_DAYS = 7 * 24 * 60 * 60;
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Set-Cookie": `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SEVEN_DAYS}; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`,
      });
      res.end(JSON.stringify({
        success: true,
        licenseKey: trimmedKey,
        tier: "PRO",
        message: "License verified successfully! Access granted to Freelance Studio OS.",
      }));
    });
    return;
  }

  // POST /api/engine
  if (pathname === "/api/engine" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      let reqBody = {};
      try { reqBody = JSON.parse(body || "{}"); } catch {}
      const { businessName, websiteUrl, niche, serviceOffered, customApiKey } = reqBody;
      if (!businessName || typeof businessName !== "string" || !businessName.trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Business name is required to run the AI Closer Engine." }));
        return;
      }
      const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;
      if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          error: "Google Gemini API key required. Please enter your API key in the top Settings drawer or configure GEMINI_API_KEY.",
        }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        data: {
          conversionScore: 48,
          auditWeaknesses: [
            { title: "Missing Mobile Sticky CTA", impact: "Losing ~35% of mobile visitors", fix: "Deploy bottom persistent action bar" },
            { title: "No Local Schema Markup", impact: "Missing out on Google 3-Pack rank", fix: "Add JSON-LD LocalBusiness metadata" },
            { title: "Slow Desktop/Mobile Load", impact: "High bounce rate on slow connections", fix: "Migrate to Next.js static generation" }
          ],
          outreach: {
            coldEmailSubject: `Quick CRO observation about ${businessName}`,
            coldEmailBody: `Hi team, took a look at ${websiteUrl || businessName}...`,
            instagramDm: `Hey ${businessName}! Love your work...`,
            loomScript: `[0:00-0:15 Hook] Hey there, noticed a quick conversion gap...`
          },
          proposalTiers: [
            { name: "Starter One-Time", price: "$950", deliverables: ["1-Page Redesign", "Mobile Bar"], timeline: "7 Days" },
            { name: "Growth Monthly Retainer", price: "$1,850 / mo", deliverables: ["5-Page Custom Site", "Ongoing CRO"], timeline: "14 Days" },
            { name: "Full Studio Scale", price: "$3,800 + $500/mo", deliverables: ["Custom Web App", "Automations"], timeline: "21 Days" }
          ],
          scopeShieldClause: "Clause 4.2 (Scope Boundary): All deliverables defined herein are exhaustive..."
        }
      }));
    });
    return;
  }

  // POST /api/scope-shield
  if (pathname === "/api/scope-shield" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      let reqBody = {};
      try { reqBody = JSON.parse(body || "{}"); } catch {}
      const { originalScope, clientMessage, hourlyRate = 75, customApiKey } = reqBody;
      if (!originalScope || typeof originalScope !== "string" || !originalScope.trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Original agreed scope is required." }));
        return;
      }
      if (!clientMessage || typeof clientMessage !== "string" || !clientMessage.trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Client message or request is required." }));
        return;
      }
      const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;
      if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          error: "Google Gemini API key required. Please enter your API key in Settings or set GEMINI_API_KEY.",
        }));
        return;
      }
      const numericRate = typeof hourlyRate === "number" ? hourlyRate : parseFloat(hourlyRate) || 75;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        data: {
          status: "OUT_OF_SCOPE",
          reasoning: "The requested feature requires backend integration and payment setup not in original 5-page scope.",
          estimatedExtraHours: 8,
          suggestedUpsellPrice: `$${8 * numericRate}`,
          diplomaticReply: "Hi! Thanks for reaching out. That is a great feature to add..."
        }
      }));
    });
    return;
  }

  // GET /api/auth/me
  if (pathname === "/api/auth/me" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    if (userSession) {
      res.end(JSON.stringify({
        user: {
          id: userSession.userId,
          username: userSession.username,
          email: userSession.email,
          avatar_url: userSession.avatar_url,
          hasAccess: userSession.hasAccess,
          membershipPlan: userSession.membershipPlan,
        }
      }));
    } else {
      res.end(JSON.stringify({ user: null }));
    }
    return;
  }

  // POST /api/auth/logout
  if (pathname === "/api/auth/logout" && req.method === "POST") {
    const isProd = process.env.NODE_ENV === "production";
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Set-Cookie": `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`,
    });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // GET /api/auth/callback
  if (pathname === "/api/auth/callback" && req.method === "GET") {
    const code = parsedUrl.searchParams.get("code");
    // Notice: URL bypass param is strictly ignored.
    if (isDevBypassEnabled() && code === "mock_dev_code") {
      const mockUser = getDevMockUser();
      membershipStore.markActive(mockUser.id);
      const token = createSessionToken(mockUser);
      const isProd = process.env.NODE_ENV === "production";
      res.writeHead(302, {
        Location: "/dashboard",
        "Set-Cookie": `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`,
      });
      res.end();
      return;
    }

    if (!code) {
      res.writeHead(302, { Location: "/?error=missing_code" });
      res.end();
      return;
    }

    // When real Whop OAuth is not configured, reject gracefully
    res.writeHead(302, { Location: "/?error=auth_failed" });
    res.end();
    return;
  }

  // POST /api/webhook/whop
  if (pathname === "/api/webhook/whop" && req.method === "POST") {
    const secret = process.env.WHOP_WEBHOOK_SECRET;
    if (!secret) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Webhook secret is not configured on server" }));
      return;
    }

    const sigHeader = req.headers["whop-signature"];
    if (!sigHeader) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing whop-signature header" }));
      return;
    }

    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      const signature = sigHeader.startsWith("sha256=") ? sigHeader.slice(7) : sigHeader;
      const computedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      const sigBuf = Buffer.from(signature);
      const computedBuf = Buffer.from(computedSignature);

      if (sigBuf.length !== computedBuf.length || !crypto.timingSafeEqual(sigBuf, computedBuf)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid webhook signature" }));
        return;
      }

      try {
        const event = JSON.parse(body);
        const action = event.action || event.type;
        const userId = event.data?.user?.id || event.data?.user_id || event.data?.id;

        if (userId) {
          if (action === "membership.went_valid") {
            membershipStore.markActive(userId);
          } else if (action === "membership.went_invalid") {
            membershipStore.markRevoked(userId, Math.floor(Date.now() / 1000));
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ received: true }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // POST /api/generate
  if (pathname === "/api/generate" && req.method === "POST") {
    // Defense-in-depth access control
    if (!userSession) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized: Active subscription required" }));
      return;
    }

    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const input = JSON.parse(body || "{}");
        const deliverables = generateDeliverables(input);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: deliverables }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Protected Pages: /dashboard and /dashboard/generator
  if (pathname === "/dashboard" || pathname === "/dashboard/generator") {
    if (!userSession) {
      res.writeHead(302, { Location: "/?error=subscription_required" });
      res.end();
      return;
    }

    if (pathname === "/dashboard") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(renderDashboardPage());
      return;
    }

    if (pathname === "/dashboard/generator") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(renderGeneratorPage());
      return;
    }
  }

  // Public Landing Page
  if (pathname === "/" || pathname === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(renderLandingPage());
    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Local Client Engine Server] Running at http://localhost:${PORT}`);
  });
}

module.exports = {
  calculateTierPricing,
  formatCurrency,
  generateDeliverables,
  renderLandingPage,
  renderGeneratorPage,
  server,
  membershipStore,
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
};


