"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WhopAuthButton from "@/components/WhopAuthButton";
import {
  Sparkles,
  Zap,
  Layers,
  DollarSign,
  Terminal,
  ShieldCheck,
  Check,
  ArrowRight,
  ChevronRight,
  Code2,
  TrendingUp,
  Star,
  Copy,
  ExternalLink,
  Coins,
  Globe,
  X,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"prompt" | "roadmap" | "pitch">("pitch");
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Choose Your Currency");
  const [targetPlan, setTargetPlan] = useState<string | null>(null);

  const PLAN_PRICING: Record<string, { starter: string; starterBtn: string; pro: string; proBtn: string }> = {
    USD: { starter: "$29", starterBtn: "Get Starter ($29)", pro: "$19", proBtn: "Start Pro Membership ($19/mo)" },
    INR: { starter: "₹2,499", starterBtn: "Get Starter (₹2,499)", pro: "₹1,599", proBtn: "Start Pro Membership (₹1,599/mo)" },
    EUR: { starter: "€27", starterBtn: "Get Starter (€27)", pro: "€18", proBtn: "Start Pro Membership (€18/mo)" },
    GBP: { starter: "£23", starterBtn: "Get Starter (£23)", pro: "£15", proBtn: "Start Pro Membership (£15/mo)" },
    CAD: { starter: "CA$39", starterBtn: "Get Starter (CA$39)", pro: "CA$26", proBtn: "Start Pro Membership (CA$26/mo)" },
    AUD: { starter: "A$45", starterBtn: "Get Starter (A$45)", pro: "A$29", proBtn: "Start Pro Membership (A$29/mo)" },
  };

  const DEMO_PRICING: Record<string, { floor: string; target: string; anchor: string; sym: string }> = {
    USD: { floor: "$800", target: "$1,500", anchor: "$2,500", sym: "$" },
    INR: { floor: "₹45,000", target: "₹92,000", anchor: "₹1,50,000", sym: "₹" },
    EUR: { floor: "€750", target: "€1,500", anchor: "€2,400", sym: "€" },
    GBP: { floor: "£700", target: "£1,400", anchor: "£2,200", sym: "£" },
    CAD: { floor: "CA$1,100", target: "CA$2,050", anchor: "CA$3,200", sym: "CA$" },
    AUD: { floor: "A$1,200", target: "A$2,250", anchor: "A$3,500", sym: "A$" },
  };

  const handlePriceButtonClick = (plan: "starter" | "pro" | "demo") => {
    setTargetPlan(plan);
    setModalTitle(
      plan === "demo"
        ? "Please choose your currency for these demo pitch tiers:"
        : `Please choose your currency for this ${plan === "starter" ? "Starter Pack" : "Pro Membership"} price:`
    );
    setShowCurrencyModal(true);
  };

  const handleCurrencySelect = (curr: string) => {
    setCurrency(curr);
    setShowCurrencyModal(false);
    if (targetPlan === "starter" || targetPlan === "pro") {
      router.push(`/dashboard/generator?currency=${curr}`);
    }
  };

  const sampleDeliverables = {
    pitch: `### 3-Tier Value Pricing Matrix (Target Client: Austin Coffee Roasters)
- Floor Tier ($800): 1-Page Rapid Landing Page + Mobile Sticky Bar (Directions / Call Direct)
- Target Tier ($1,500): 5-Page Next.js Architecture + Digital Filterable Menu + Catering Inquiry Funnel
- Anchor Tier ($2,500): Complete VIP Suite + Toast/Square Ordering Integration + 30-Day Local SEO Tune-up

Closing Line: "Normally, our full VIP Suite runs at $2,500. But for Austin Coffee Roasters, our $1,500 Growth Hub gives you the complete 5-page site with Google Local Map schema and our mobile-first menu. If this brings in just 10 new catering orders this month, the entire site pays for itself. Shall we get the kickoff agreement sent over today?"`,
    prompt: `You are an elite Senior Full-Stack Next.js 14+ Developer and Conversion Rate Optimization specialist.
Scaffold a production-ready website for "South Congress Roasters", a Specialty Coffee Roastery in Austin, TX.
Tech Stack: Next.js 14+ App Router, Tailwind CSS, Lucide React, LocalBusiness JSON-LD Schema.
Key Features: Sticky Mobile Quick-Action Bar (Order Ahead, Call, Directions), Digital Menu with allergen tags, B2B Catering Lead Magnet.`,
    roadmap: `# 5-Page Architecture: South Congress Roasters
/index     -> Hero showcase, sticky quick-action bar, Google Review slider (4.9★)
/menu      -> Interactive digital menu with filterable categories & dietary tags
/story     -> Heritage, single-origin sourcing map, barista team spotlight
/catering  -> B2B corporate catering packages & guest headcount calculator
/contact   -> Google Maps embed, transit directions, real-time open/closed status`,
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(sampleDeliverables[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">Local Client Engine</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/generator"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors hidden sm:inline-block"
            >
              Open Studio
            </Link>
            <WhopAuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Whop Membership SaaS for Freelancers & Agency Operators</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Build & Sell <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">$1,500 Local Websites</span> in Under 2 Hours
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop pitching custom code from scratch. Generate AI coding agent system prompts, full 5-page site roadmaps, and high-ticket 3-tier closing pitch scripts for cafes, clinics, and salons in 30 seconds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/generator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Client Generator Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 transition-all hover:border-slate-600"
            >
              <span>See Live Sample Output</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Tested on Cursor, Claude 3.5 & Antigravity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>3-Tier Anchor Pricing Script</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Google Local Schema JSON-LD Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Sandbox */}
      <section id="demo" className="py-16 px-4 sm:px-6 bg-slate-950/40 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Instant Deliverable Output
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              What the Engine Builds for You
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Every client profile generates three production-ready assets ready to copy into your workflow.
            </p>
          </div>

          {/* Interactive Output Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Tab Bar */}
            <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("pitch")}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "pitch"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>3-Tier Pitch Script ({DEMO_PRICING[currency]?.target || "$1,500"} Target)</span>
                </button>

                <button
                  onClick={() => setActiveTab("prompt")}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "prompt"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>AI Agent System Prompt</span>
                </button>

                <button
                  onClick={() => setActiveTab("roadmap")}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "roadmap"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>5-Page Site Architecture</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePriceButtonClick("demo")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors shadow-sm"
                >
                  <Globe className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Currency: <strong className="text-emerald-400 font-mono">{currency} ({DEMO_PRICING[currency]?.sym})</strong></span>
                </button>

                <button
                  onClick={handleCopyPreview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy Sample</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Box */}
            <div className="p-6 bg-slate-950/60">
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[380px]">
                {sampleDeliverables[activeTab]}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Built for Speed & Revenue
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Entire Agency Playbook in One Engine
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              No more guessing what to say to local owners or spending weeks custom coding simple multi-page marketing sites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">AI Agent Scaffolding Prompts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pre-engineered prompts formatted directly for Cursor, Antigravity, and Claude. Instructs the AI agent to output Next.js 14 App Router code with sticky mobile CTAs and Local Schema.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">3-Tier Pricing Pitch Scripts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates your $2,500 Anchor, $1,500 Target, and $800 Floor packages automatically. Includes word-for-word closing lines and battle-tested objection handling scripts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">5-Page High-Conversion Roadmaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean markdown blueprints with features matrix, Google Review proof widgets, and WhatsApp/Call buttons that convince local owners to sign within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Whop Membership Access
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Invest in Your Agency Pipeline
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Close just one $1,500 client and you've paid for your membership for the next 6 years.
            </p>

            {/* Quick Currency Selector Toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
              <span className="text-xs text-slate-400 mr-1.5 flex items-center gap-1">
                <Coins className="h-3.5 w-3.5 text-indigo-400" />
                <span>Pricing Currency:</span>
              </span>
              {["USD", "INR", "EUR", "GBP", "CAD", "AUD"].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    currency === curr
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {curr} ({DEMO_PRICING[curr]?.sym})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Starter Pack */}
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Starter Pack</h3>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">One-Time</span>
                </div>
                <div
                  onClick={() => handlePriceButtonClick("starter")}
                  className="mt-4 flex items-baseline gap-1 cursor-pointer hover:text-indigo-300 transition-colors"
                  title="Click to choose currency"
                >
                  <span className="text-4xl font-extrabold text-white">
                    {PLAN_PRICING[currency]?.starter || "$29"}
                  </span>
                  <span className="text-xs text-slate-400">lifetime starter access</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Perfect for freelance developers building their first 5 local clients.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>10 Full Deliverable Generations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Hospitality & Wellness Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>3-Tier Pitch Script & Objection Pack</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>1-Click Markdown Clipboard Export</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePriceButtonClick("starter")}
                className="mt-8 w-full py-3 rounded-xl font-semibold text-xs border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-center transition-all flex items-center justify-center gap-2"
              >
                <span>{PLAN_PRICING[currency]?.starterBtn || "Get Starter Pack ($29)"}</span>
              </button>
            </div>

            {/* Pro Membership */}
            <div className="p-8 rounded-3xl border border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900/90 relative glow-indigo flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                Agency Choice
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Pro Membership</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active Access</span>
                </div>
                <div
                  onClick={() => handlePriceButtonClick("pro")}
                  className="mt-4 flex items-baseline gap-1 cursor-pointer hover:text-indigo-300 transition-colors"
                  title="Click to choose currency"
                >
                  <span className="text-4xl font-extrabold text-white">
                    {PLAN_PRICING[currency]?.pro || "$19"}
                  </span>
                  <span className="text-xs text-slate-400">/ month • Cancel anytime</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">For operators scaling a recurring monthly web agency pipeline.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Unlimited</strong> AI Deliverable Generations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>All Niche Modules (Clinics, MedSpas, Trades)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Private Whop Agency Mastermind Discord</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Continuous SEO Schema & Prompt Updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Priority Support & Custom Niche Requests</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePriceButtonClick("pro")}
                className="mt-8 w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-center shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <span>{PLAN_PRICING[currency]?.proBtn || "Join Pro Membership ($19/mo)"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Globe className="h-5 w-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Choose Your Currency</h3>
                  <p className="text-xs text-slate-400">{modalTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { code: "USD", name: "US Dollar", sym: "$" },
                { code: "INR", name: "Indian Rupee", sym: "₹" },
                { code: "EUR", name: "Euro", sym: "€" },
                { code: "GBP", name: "British Pound", sym: "£" },
                { code: "CAD", name: "Canadian Dollar", sym: "CA$" },
                { code: "AUD", name: "Australian Dollar", sym: "A$" },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCurrencySelect(c.code)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all group"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{c.code} ({c.sym})</div>
                    <div className="text-[10px] text-slate-400">{c.name}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400 group-hover:scale-110 transition-transform">
                    {c.sym}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400">
              💡 All price tags, pitch matrices, and closing scripts will automatically calculate in the selected currency.
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about the engine and deliverables.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <h4 className="text-sm font-semibold text-white">Do I need an OpenAI or Anthropic API key to run this?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No. The engine runs deterministic variable interpolation with deep local business heuristics. Generation is instant and costs $0 in API credits.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <h4 className="text-sm font-semibold text-white">Which coding agents work best with the system prompt?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The generated system prompt is specifically tuned for Cursor Agent, Google Antigravity, Claude 3.5 Sonnet, and OpenAI o1/o3-mini.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <h4 className="text-sm font-semibold text-white">How does Whop membership verification work?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We integrate with Whop OAuth and the memberships API. For local development, setting <code className="text-indigo-400">DEV_BYPASS_ENABLED=true</code> in your server environment unlocks full Pro features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="text-slate-400 font-medium">The Local Client Engine © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/dashboard/generator" className="hover:text-slate-300">Generator Studio</Link>
            <a href="https://whop.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              <span>Powered by Whop</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
