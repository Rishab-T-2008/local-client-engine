# 🚀 ClientCloser AI — Autonomous Agency OS & Proposal Engine

> **The plug-and-play AI system that turns cold local-business URLs into signed $3,000 proposals in 60 seconds.**

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%20Flash-blue?logo=google)](https://aistudio.google.com/)
[![Built with Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Sold on Dodo Payments](https://img.shields.io/badge/Get%20Access-Dodo%20Payments%20%2449%2Fmo-ea580c)](https://dodopayments.com)

---

## ✨ What This Is (Not "A Code Repository")

This is a **fully operational AI Agency Operating System** — a commercial SaaS web app that lives in your browser and runs the entire client acquisition & project management workflow of a freelance web agency, powered by Google Gemini AI.

**You paste a local business URL. It builds your entire sales pipeline in under 60 seconds.**

---

## 🎥 See It In Action

> **[▶ Watch the 30-Second Demo](https://www.loom.com/share/YOUR_LOOM_LINK_HERE)**
>
> *Type in any local business URL → instant CRO audit, 3-tier proposal, cold outreach kit, and scope protection clause.*

---

## 💼 The 3 Core Modules

### 1. 🔍 AI Lead Audit & Closer Engine
Paste any prospect's website URL. The system scrapes the live site, analyzes it with Gemini AI, and generates:

- **Conversion Score** — a 0–100 CRO grade backed by actual page content
- **3 Specific Audit Weaknesses** — with impact ratings and exact fixes (based on *their* real site, not generic advice)
- **Full Outreach Kit** — cold email subject + body, Instagram DM, and a Loom video script — all written and ready to send
- **3-Tier Proposal** — Starter One-Time, Growth Monthly Retainer, and Full Studio Scale packages with prices and deliverables
- **Scope Shield Clause** — a contract paragraph that protects you from scope creep before the project starts

### 2. 🛡️ Scope Creep Shield
Paste what your original scope was and what the client is now asking for. The AI tells you:

- `IN SCOPE` or `OUT OF SCOPE (UPSELL OPPORTUNITY)`
- Estimated extra hours + suggested upsell price (based on your hourly rate)
- A ready-to-copy diplomatic reply that charges for the extra work **without ruining the relationship**

### 3. 🏗️ Architect & Prompt Studio
A full project build studio for:
- Generating technical roadmaps and sitemaps
- Creating investor-grade pitch decks
- Writing detailed technical specification documents
- One-click export to Markdown, PDF, and Clipboard

---

## 🔐 How The Dodo Payments License Gate Works

This product is sold via **Dodo Payments** (`https://dodopayments.com`). When a customer purchases access:

1. Dodo Payments immediately generates and emails a customer **License Key**.
2. The user inputs their license key on the app's lock screen.
3. The server validates the key against Dodo Payments' validation endpoint (`https://live.dodopayments.com/licenses/validate`).
4. Upon validation, the app signs an HS256 JWT session cookie valid for 7 days.

**Testing / Demo key:** `DEMO-DODO-2026` (also accepts `DEMO-WHOP-2026` for backward compatibility)

---

## ⚡ 3-Step Setup (Buyers)

> You do **not** need to touch any code or config files. Just:

1. **Clone or deploy** this repo (one click on Vercel — see button above)
2. **Open the app** in your browser and paste your Dodo Payments license key to unlock
3. **Paste your free Gemini API key** in the Settings drawer (no `.env` editing required)

That's it. The system is live and generating proposals.

> 🔑 Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/) — it takes 30 seconds.

---

## 💰 Pricing

| Plan | Price | What You Get |
|------|-------|-------------|
| **ClientCloser AI** | **\$49/month** | Full AI Audit Engine + Scope Shield + Architect Studio + Unlimited Prospects |

**[→ Get Instant Access on Dodo Payments](https://dodopayments.com)**

**Why \$49/month?**
- One signed client from a single AI audit = 10–50× ROI in the first week
- Replaces: proposal software (\$30/mo) + cold email tools (\$40/mo) + contract templates (\$20 one-time)
- No per-seat fees. One subscription, unlimited audits.

---

## 🛠️ Self-Hosting / Developer Setup

For developers who want to run this locally or self-host:

### Prerequisites
- Node.js 18+
- A free Google Gemini API key from [aistudio.google.com](https://aistudio.google.com/)

### Installation

```bash
git clone https://github.com/Rishab-T-2008/local-client-engine.git
cd local-client-engine
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Dodo Payments Configuration (live or test)
DODO_PAYMENTS_ENVIRONMENT=live
DODO_PAYMENTS_API_KEY=
DODO_PAYMENTS_WEBHOOK_KEY=

# Master Passkey for Testing & Demo Recording
MASTER_PASSKEY=DEMO-DODO-2026

# Required: Session signing secret (any 32+ char random string)
SESSION_SECRET=your_super_secret_32_char_string_here

# Required: Your Gemini AI key (free at aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Enable dev bypass in non-production
DEV_BYPASS_ENABLED=true
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — enter `DEMO-DODO-2026` to unlock.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 App Router |
| **AI** | Google Gemini 3.8 / 2.5 Flash (via REST API) |
| **Auth** | JWT (HS256 via `jose`) + HttpOnly cookies |
| **Payments & Licensing** | Dodo Payments License Validation API |
| **Styling** | Tailwind CSS (dark mode) |
| **Icons** | Lucide React |
| **Scraping** | Native `fetch` + `AbortController` |
| **Deploy** | Vercel / any Node.js host |

---

## 📁 Project Structure

```
/app
  /api
    /dodo-verify/route.ts   — Dodo Payments license gate + JWT session
    /whop-verify/route.ts   — Compatible verify route handler
    /engine/route.ts        — AI lead audit (live scrape + Gemini)
    /scope-shield/route.ts  — Scope creep classifier
  page.tsx                  — Main SaaS UI (Dodo lock screen + 3 tabs)
/components
  GeneratorForm.tsx         — Architect Studio input form
  RoadmapViewer.tsx         — Sitemap/roadmap viewer
  PitchDeckView.tsx         — AI pitch deck display
  ExportActions.tsx         — Export to MD/PDF/clipboard
/lib
  types.ts                  — Shared TypeScript types
middleware.ts               — Auth middleware
```

---

## 🔒 Security

- All API keys stored server-side only (never exposed to the browser)
- Buyers paste their Gemini key into a Settings drawer — stored in `localStorage` on their device only
- License validation happens server-side with verified cryptographic signatures
- No logging of prospect data or client messages

---

## 📄 License

Commercial product. All rights reserved. Unauthorized redistribution is prohibited.

---

*Built for freelance web agencies. Powered by Google Gemini AI & Dodo Payments.*
