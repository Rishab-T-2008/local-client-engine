"use client";

import React, { useState } from "react";
import { PricingBreakdown } from "@/lib/types";
import { formatCurrency, getCurrencySymbol } from "@/lib/utils";
import { Copy, Check, DollarSign, PhoneCall, ShieldAlert, Sparkles, Coins } from "lucide-react";

interface PitchDeckViewProps {
  pitchScriptMarkdown: string;
  pricing?: PricingBreakdown;
  businessName: string;
}

export default function PitchDeckView({
  pitchScriptMarkdown,
  pricing,
  businessName,
}: PitchDeckViewProps) {
  const [copied, setCopied] = useState(false);

  const currency = pricing?.currency || "USD";
  const currencySymbol = pricing?.currencySymbol || getCurrencySymbol(currency);
  const anchor = pricing?.anchorPrice || (currency === "INR" ? 150000 : 2500);
  const target = pricing?.targetPrice || (currency === "INR" ? 92000 : 1500);
  const floor = pricing?.floorPrice || (currency === "INR" ? 45000 : 800);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pitchScriptMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              3-Tier Pricing Pitch & Objection Handling
            </h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-medium flex items-center gap-1">
            <Coins className="h-3 w-3" />
            <span>Currency: {currency} ({currencySymbol})</span>
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied Pitch</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Full Script</span>
            </>
          )}
        </button>
      </div>

      {/* Pricing Cards Ribbon */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Floor */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Floor Tier ({currency})</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium">Quick Cash</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">{formatCurrency(floor, currency)}</div>
              <p className="text-xs text-slate-400 mt-1">1-page high-converting rapid launch with mobile actions.</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              Use when client insists on a budget limit.
            </div>
          </div>

          {/* Target */}
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 to-slate-900/90 relative glow-emerald flex flex-col justify-between">
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
              Target Pitch ({currency})
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Growth Hub</span>
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">{formatCurrency(target, currency)}</div>
              <p className="text-xs text-slate-300 mt-1">Full 5-page bespoke architecture + Local SEO Schema.</p>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
              Target 80% of sales conversations here.
            </div>
          </div>

          {/* Anchor */}
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-slate-900/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Anchor Tier ({currency})</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-medium">VIP Retainer</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">{formatCurrency(anchor, currency)}</div>
              <p className="text-xs text-slate-400 mt-1">Everything + custom booking/ordering & 30-day SEO.</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              Anchors client expectations before pitching Target.
            </div>
          </div>
        </div>
      </div>

      {/* Raw Pitch Script Display */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <PhoneCall className="h-3.5 w-3.5 text-indigo-400" />
            <span>Word-for-word closing script with objection responses:</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 overflow-x-auto leading-relaxed">
            {pitchScriptMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
}

