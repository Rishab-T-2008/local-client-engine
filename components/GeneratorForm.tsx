"use client";

import React, { useState } from "react";
import { BusinessInput, BusinessNiche, GeneratedOutput } from "@/lib/types";
import { getCurrencySymbol, formatCurrency } from "@/lib/utils";
import { ALL_CURRENCIES } from "@/lib/currencies";
import { Sparkles, Utensils, HeartPulse, Stethoscope, Wrench, Plus, X, ArrowRight, Loader2, Coins, Globe } from "lucide-react";

interface GeneratorFormProps {
  onGenerate: (output: GeneratedOutput, input: BusinessInput) => void;
  isLoading?: boolean;
}

const PRESETS: Array<{ label: string; niche: BusinessNiche; data: BusinessInput }> = [
  {
    label: "☕ Austin Specialty Coffee",
    niche: "hospitality",
    data: {
      businessName: "South Congress Roasters",
      niche: "hospitality",
      specificType: "Specialty Coffee Roastery & Cafe",
      location: "Austin, TX",
      targetPriceAnchor: 2500,
      targetPriceFloor: 800,
      currency: "USD",
      keyServices: ["Nitro Cold Brew", "Single-Origin Pour Over", "Pastry Catering", "Bean Subscription"],
    },
  },
  {
    label: "✨ Beverly Hills MedSpa",
    niche: "wellness",
    data: {
      businessName: "Lumière Aesthetics & Skin",
      niche: "wellness",
      specificType: "Luxury Medical Spa & Laser Clinic",
      location: "Beverly Hills, CA",
      targetPriceAnchor: 3200,
      targetPriceFloor: 1200,
      currency: "USD",
      keyServices: ["HydraFacial Glow", "Laser Skin Resurfacing", "Botox & Dermal Fillers", "VIP Membership"],
    },
  },
  {
    label: "🦷 Miami Family Dental",
    niche: "clinics",
    data: {
      businessName: "Biscayne Bay Dental Care",
      niche: "clinics",
      specificType: "Modern Cosmetic & Family Dentistry",
      location: "Miami, FL",
      targetPriceAnchor: 2800,
      targetPriceFloor: 950,
      currency: "USD",
      keyServices: ["Invisalign Clear Aligners", "Emergency Toothache Relief", "Teeth Whitening", "Pediatric Exams"],
    },
  },
  {
    label: "⚡ Dallas Emergency HVAC",
    niche: "general_services",
    data: {
      businessName: "Apex Heating & Air Conditioning",
      niche: "general_services",
      specificType: "Residential & Commercial HVAC Services",
      location: "Dallas, TX",
      targetPriceAnchor: 2400,
      targetPriceFloor: 850,
      currency: "USD",
      keyServices: ["24/7 AC Repair", "Furnace Installation", "Duct Cleaning", "Seasonal Tune-Up"],
    },
  },
];

export default function GeneratorForm({ onGenerate, isLoading = false }: GeneratorFormProps) {
  const [formData, setFormData] = useState<BusinessInput>({
    businessName: "South Congress Roasters",
    niche: "hospitality",
    specificType: "Specialty Coffee Roastery & Cafe",
    location: "Austin, TX",
    targetPriceAnchor: 2500,
    targetPriceFloor: 800,
    currency: "USD",
    keyServices: ["Nitro Cold Brew", "Single-Origin Pour Over", "Pastry Catering"],
  });

  const [serviceTagInput, setServiceTagInput] = useState("");
  const [loadingInternal, setLoadingInternal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCurrencyHint, setShowCurrencyHint] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");

  const activeCurrency = formData.currency || "USD";
  const activeSymbol = getCurrencySymbol(activeCurrency);

  const filteredCurrencies = ALL_CURRENCIES.filter((c) => {
    const q = currencySearch.trim().toLowerCase();
    if (!q) return true;
    return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  const handleCurrencyChange = (newCurrency: string) => {
    setFormData({ ...formData, currency: newCurrency });
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFormData({ ...preset.data });
    setErrorMessage(null);
  };

  const handleAddService = () => {
    const trimmed = serviceTagInput.trim();
    if (trimmed && !formData.keyServices.includes(trimmed)) {
      setFormData({
        ...formData,
        keyServices: [...formData.keyServices, trimmed],
      });
      setServiceTagInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddService();
    }
  };

  const handleRemoveService = (service: string) => {
    setFormData({
      ...formData,
      keyServices: formData.keyServices.filter((s) => s !== service),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.location) {
      setErrorMessage("Please enter both Business Name and Location.");
      return;
    }

    setErrorMessage(null);
    setLoadingInternal(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate deliverables");
      }

      const result = await res.json();
      onGenerate(result.data, formData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating deliverables";
      setErrorMessage(msg);
    } finally {
      setLoadingInternal(false);
    }
  };

  const isBusy = isLoading || loadingInternal;

  const nicheIcons: Record<BusinessNiche, React.ReactNode> = {
    hospitality: <Utensils className="h-4 w-4" />,
    wellness: <HeartPulse className="h-4 w-4" />,
    clinics: <Stethoscope className="h-4 w-4" />,
    general_services: <Wrench className="h-4 w-4" />,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Presets Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Quick Client Presets
          </label>
          <span className="text-[11px] text-indigo-400">1-click autofill</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left px-3 py-2 rounded-xl text-xs font-medium border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-slate-300 transition-all truncate"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Business Niche Select */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Target Business Niche
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: "hospitality", name: "Hospitality" },
              { id: "wellness", name: "Wellness" },
              { id: "clinics", name: "Clinics" },
              { id: "general_services", name: "Services" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFormData({ ...formData, niche: item.id })}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                formData.niche === item.id
                  ? "border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md shadow-indigo-500/10"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {nicheIcons[item.id]}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Business Name & Specific Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Business Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="e.g. Blue Bottle Coffee"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Specific Business Type
          </label>
          <input
            type="text"
            value={formData.specificType}
            onChange={(e) => setFormData({ ...formData, specificType: e.target.value })}
            placeholder="e.g. Specialty Coffee & Micro-Bakery"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Location / Target Market <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g. Austin, TX or Brooklyn, NY"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Target Pricing Sliders / Inputs & Currency Selector */}
      <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-indigo-400" />
            <span>Pricing Currency</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setShowCurrencyHint(true);
              setCurrencySearch("");
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-500/40 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 flex items-center gap-1.5 transition-all shadow"
          >
            <span>🌐 Choose Currency:</span>
            <span className="font-mono text-emerald-400 font-bold">{activeCurrency} ({activeSymbol})</span>
          </button>
        </div>

        {/* Dynamic Currency Choice Prompt */}
        {showCurrencyHint && (
          <div className="p-3 rounded-xl border border-indigo-500/40 bg-indigo-950/40 text-indigo-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-indigo-400" />
                <span>Please choose your currency for this price:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowCurrencyHint(false);
                  setCurrencySearch("");
                }}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div>
              <input
                type="text"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                placeholder="Search currency (code or name)…"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                autoFocus
              />
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1 pt-1 pr-1">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      handleCurrencyChange(c.code);
                      setShowCurrencyHint(false);
                      setCurrencySearch("");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all ${
                      activeCurrency === c.code
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <span>
                      <span className="font-mono font-bold text-white">{c.code}</span> — {c.name}
                    </span>
                    <span className="font-mono text-emerald-400 ml-2">({c.symbol})</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-3 text-slate-400 text-xs">
                  No currencies match &quot;{currencySearch}&quot;
                </div>
              )}
            </div>
          </div>
        )}

        <select
          value={activeCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-all"
        >
          {ALL_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.symbol}) — {c.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label
              onClick={() => {
                setShowCurrencyHint(true);
                setCurrencySearch("");
              }}
              className="block text-xs font-medium text-slate-300 mb-1 cursor-pointer hover:text-indigo-300 transition-colors"
              title="Click to choose currency"
            >
              Anchor Tier Price ({activeCurrency} {activeSymbol})
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={formData.targetPriceAnchor}
              onClick={() => {
                setShowCurrencyHint(true);
                setCurrencySearch("");
              }}
              onChange={(e) => setFormData({ ...formData, targetPriceAnchor: Number(e.target.value) })}
              title="Click to choose currency"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              High-end package anchor ({formatCurrency(formData.targetPriceAnchor, activeCurrency)})
            </p>
          </div>

          <div>
            <label
              onClick={() => {
                setShowCurrencyHint(true);
                setCurrencySearch("");
              }}
              className="block text-xs font-medium text-slate-300 mb-1 cursor-pointer hover:text-indigo-300 transition-colors"
              title="Click to choose currency"
            >
              Floor Tier Price ({activeCurrency} {activeSymbol})
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={formData.targetPriceFloor}
              onClick={() => {
                setShowCurrencyHint(true);
                setCurrencySearch("");
              }}
              onChange={(e) => setFormData({ ...formData, targetPriceFloor: Number(e.target.value) })}
              title="Click to choose currency"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Walk-away base floor ({formatCurrency(formData.targetPriceFloor, activeCurrency)})
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>* Currency selected is used in all pitch scripts.</span>
          <button
            type="button"
            onClick={() => {
              setShowCurrencyHint(true);
              setCurrencySearch("");
            }}
            className="text-indigo-400 hover:text-indigo-300 underline font-medium"
          >
            Choose Currency →
          </button>
        </div>
      </div>

      {/* Key Services Dynamic Tag Input */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Key Services / Specialties (Press Enter or Add)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={serviceTagInput}
            onChange={(e) => setServiceTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a service (e.g. Cold Brew On Tap)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddService}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 inline-flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>

        {formData.keyServices.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {formData.keyServices.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 border border-slate-700/60 text-slate-300"
              >
                <span>{service}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveService(service)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isBusy}
        className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
      >
        {isBusy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating Custom Prompts & Roadmap...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate Client Deliverables</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

