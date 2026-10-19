# MISSION SPECIFICATION: The Local Client Engine (Whop Membership SaaS)

## 1. PROJECT OVERVIEW
Build an interactive Next.js application that allows freelance developers and agency operators to generate custom AI prompts, complete site roadmaps, and 3-tier pricing pitch scripts for local businesses (cafes, clinics, salons, gyms).

The application must include:
- A public landing page optimized for conversion (selling to US/EU freelance buyers).
- A gated subscriber dashboard checking active membership access (Whop OAuth / API).
- An interactive prompt & roadmap assembler generating structured Markdown outputs.
- A 1-click clipboard export for all deliverables.

---

## 2. REPOSITORY & FILE STRUCTURE

local-client-engine/
├── app/
│   ├── api/
│   │   ├── generate/route.ts        # Dynamic prompt & roadmap generator
│   │   ├── webhook/whop/route.ts    # Whop membership event listener
│   │   └── auth/callback/route.ts   # Whop OAuth handler
│   ├── dashboard/
│   │   ├── page.tsx                 # Protected user dashboard
│   │   └── generator/page.tsx       # Multi-step generation workflow
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # High-converting marketing landing page
├── components/
│   ├── GeneratorForm.tsx            # Form inputs (business niche, name, services, price floor)
│   ├── RoadmapViewer.tsx            # Formatted Markdown preview with syntax highlighting
│   ├── PitchDeckView.tsx            # 3-Tier pricing script and phone pitch display
│   ├── ExportActions.tsx            # Copy to clipboard & .md file downloader
│   └── WhopAuthButton.tsx           # Login with Whop button
├── lib/
│   ├── templates/
│   │   ├── hospitality.ts           # Cafe, bakery, restobar schemas
│   │   ├── wellness.ts              # Salon, spa, personal care schemas
│   │   ├── clinics.ts               # Dental, aesthetic, physio schemas
│   │   └── basePrompts.ts           # Reusable system instruction scaffolds
│   ├── whop.ts                      # Whop API SDK & license key verification
│   ├── types.ts                     # Input & output TypeScript interfaces
│   └── utils.ts
├── public/
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json

---

## 3. CORE LOGIC & DATA CONTRACTS

### Input Interface (`lib/types.ts`)
```typescript
export interface BusinessInput {
  businessName: string;
  niche: 'hospitality' | 'wellness' | 'clinics' | 'general_services';
  specificType: string;         // e.g., "Specialty Coffee Roastery"
  location: string;             // e.g., "Austin, TX"
  targetPriceAnchor: number;    // e.g., 2500
  targetPriceFloor: number;     // e.g., 800
  keyServices: string[];        // e.g., ["Cold Brew", "Catering", "Pastries"]
}

export interface GeneratedOutput {
  systemPrompt: string;         // Ready for Cursor / Antigravity / Claude
  siteMapMarkdown: string;      // 5-page structured architecture
  pitchScriptMarkdown: string;  // Anchor / Target / Floor script with objection handling
}
```

### Prompt Assembly Engine (`app/api/generate/route.ts`)

The generator must construct three clean deliverables based on user input without requiring a third-party LLM API key for every run (deterministic template rendering with variable interpolation):

1. **The System Prompt:** Formatted as an instruction for coding agents to scaffold the client's site.
2. **The Sitemap & Features Table:** Outlining Mobile-First CTAs, WhatsApp/Booking triggers, and SEO schema tags.
3. **The Acquisition & Pitch Script:** Custom-calculated Anchor ($2,500), Target ($1,500), and Floor ($750) pricing with word-for-word closing lines.

---

## 4. PHASED ANTIGRAVITY EXECUTION PLAN

### Phase 1: Foundation & Scaffolding
- Initialize Next.js 14+ (App Router), Tailwind CSS, Lucide-React, and TypeScript.
- Create `/lib/templates/` containing modular string-template generators for Hospitality, Wellness, and Clinics.
- Verify production build runs cleanly with `npm run build`.

### Phase 2: Generator Engine & State Management
- Build `GeneratorForm.tsx` with responsive inputs, category dropdowns, and dynamic tag inputs for services.
- Connect the form to `/api/generate` and verify the payload produces valid, readable Markdown for all 3 categories.
- Build `RoadmapViewer.tsx` and `PitchDeckView.tsx` with tabbed navigation and 1-click clipboard copy buttons.

### Phase 3: Whop Gating Layer
- Integrate `@whop-apps/sdk` or implement standard license-key validation in middleware.
- Protect `/dashboard` routes so unauthenticated requests redirect to the Whop checkout page.
- Add mock developer mode toggle (`DEV_BYPASS_ENABLED=false`) in `.env.example` for local testing.

### Phase 4: Landing Page & Polish
- Implement a dark-mode, high-converting landing page on `/` highlighting:
  - "Build & Sell $1,500 Local Business Websites in Under 2 Hours"
  - Interactive preview demo of the generator output.
  - Pricing cards ($29 Starter Pack vs. $19/mo Pro Membership).
- Test browser layout and mobile responsiveness.

