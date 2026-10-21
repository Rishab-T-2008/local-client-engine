# 🚀 Freelance Client OS — AI Agency Operating System

> **The plug-and-play AI system that turns cold local-business URLs into signed proposals in 60 seconds.**

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue?logo=google)](https://aistudio.google.com/)
[![Built with Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Sold on Whop](https://img.shields.io/badge/Get%20Access-Whop%20%2449%2Fmo-7c3aed)](https://whop.com)

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

## 🔐 How The License Gate Works

This product is sold on Whop. When a buyer purchases access, they receive a Whop license key. They paste it into the app's lock screen, which validates against the Whop API and unlocks all features for the duration of their subscription.

**Testing / demo key:** `DEMO-WHOP-2026`

---

## ⚡ 3-Step Setup (Buyers)

> You do **not** need to touch any code or config files. Just:

1. **Clone or deploy** this repo (one click on Vercel — see button above)
2. **Open the app** in your browser and paste your Whop license key to unlock
3. **Paste your free Gemini API key** in the Settings drawer (no `.env` editing required)

That's it. The system is live and generating proposals.

> 🔑 Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/) — it takes 30 seconds.

---

## 💰 Pricing

| Plan | Price | What You Get |
|------|-------|-------------|
| **Freelance Client OS** | **\$49/month** | Full AI Audit Engine + Scope Shield + Architect Studio + Unlimited Prospects |

**[→ Get Instant Access on Whop](https://whop.com)**

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
# Required: Your Gemini AI key (free at aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# Required: Session signing secret (any 32+ char random string)
SESSION_SECRET=your_super_secret_32_char_string_here

# Demo/master bypass key (set to whatever you want for testing)
MASTER_PASSKEY=DEMO-WHOP-2026

# Optional: Your Whop API key (leave blank for auto-pass mode during dev)
WHOP_API_KEY=

# Optional: Enable dev bypass (skip Whop auth in local dev)
DEV_BYPASS_ENABLED=true
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — enter `DEMO-WHOP-2026` to unlock.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 App Router |
| **AI** | Google Gemini 2.5 Flash (via REST API) |
| **Auth** | JWT (HS256 via `jose`) + HttpOnly cookies |
| **License Gate** | Whop V2 API |
| **Styling** | Tailwind CSS (dark mode) |
| **Icons** | Lucide React |
| **Scraping** | Native `fetch` + `AbortController` |
| **Deploy** | Vercel / any Node.js host |

---

## 📁 Project Structure

```
/app
  /api
    /whop-verify/route.ts   — License gate + JWT session
    /engine/route.ts        — AI lead audit (scrape + Gemini)
    /scope-shield/route.ts  — Scope creep classifier
  page.tsx                  — Main SaaS UI (lock screen + 3 tabs)
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
- Buyers paste their Gemini key into a Settings drawer — it is stored in `localStorage` on their device only
- `whop_session` cookie is `httpOnly`, `SameSite=Strict`, `Secure` in production
- No logging of prospect data or client messages

---

## 🤝 Support

Purchased on Whop? Join the community or message support directly on your Whop dashboard.

---

## 📄 License

Commercial product. All rights reserved. Unauthorized redistribution is prohibited.

---

*Built with ❤️ for freelance web agencies. Powered by Google Gemini AI.*
