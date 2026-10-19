"use client";

import React from "react";
import Link from "next/link";
import WhopAuthButton from "@/components/WhopAuthButton";
import { Sparkles, Layers, DollarSign, ArrowRight, ShieldCheck, Zap, TrendingUp, Users, FileText, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Local Client Engine</span>
              <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SUBSCRIBER PORTAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/generator"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Generator Run</span>
            </Link>
            <WhopAuthButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-slate-900/60 shadow-2xl relative overflow-hidden glow-indigo">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Whop Verified Access • Unlimited Agency License</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to land your next $1,500 local business client?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 mb-6">
              Generate AI agent scaffolding instructions, mobile-first 5-page site roadmaps, and 3-tier value pricing pitch scripts with custom objection handlers.
            </p>
            <Link
              href="/dashboard/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Prompt & Roadmap Generator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Agency Metrics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pitches Generated</span>
              <FileText className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">24</div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+6 this week</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Deal Size</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">$1,500</div>
            <div className="text-xs text-slate-400 mt-1">
              Target tier close rate: 71%
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Build Turnaround</span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">&lt; 2 Hours</div>
            <div className="text-xs text-slate-400 mt-1">
              Using Cursor & Antigravity agents
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Whop Tier</span>
              <Users className="h-4 w-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white">Pro Agency</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>All templates unlocked</span>
            </div>
          </div>
        </div>

        {/* Niche Template Categories Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Pre-Loaded Niche Modules</h2>
              <p className="text-xs text-slate-400">Select any industry to start drafting a custom pitch.</p>
            </div>
            <Link
              href="/dashboard/generator"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Open Full Studio →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                  ☕
                </div>
                <h3 className="text-base font-bold text-white">Hospitality & Dining</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Cafes, bakeries, restobars, and roasteries. Includes digital menu filters, mobile sticky reservation triggers, catering funnels, and Restaurant Schema.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">Anchor: $2,500</span>
                <Link
                  href="/dashboard/generator"
                  className="text-xs font-semibold text-indigo-400 hover:text-white inline-flex items-center gap-1"
                >
                  <span>Build Hospitality</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-105 transition-transform">
                  ✨
                </div>
                <h3 className="text-base font-bold text-white">Wellness & Beauty</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Salons, spas, medspas, and fitness studios. Features treatment duration pricing, transformation gallery, stylist calendar integrations, and recurring VIP membership cards.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">Anchor: $3,200</span>
                <Link
                  href="/dashboard/generator"
                  className="text-xs font-semibold text-indigo-400 hover:text-white inline-flex items-center gap-1"
                >
                  <span>Build Wellness</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  🦷
                </div>
                <h3 className="text-base font-bold text-white">Clinics & Healthcare</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Dental, aesthetic, physio, and chiropractic. Includes high-trust doctor bios, insurance verification badges, emergency floating dialers, and MedicalClinic SEO Schema.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">Anchor: $2,800</span>
                <Link
                  href="/dashboard/generator"
                  className="text-xs font-semibold text-indigo-400 hover:text-white inline-flex items-center gap-1"
                >
                  <span>Build Clinic</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

