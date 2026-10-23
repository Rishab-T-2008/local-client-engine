"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Lock,
  Unlock,
  Key,
  Globe,
  Settings,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Send,
  AlertTriangle,
  ArrowRight,
  Layers,
  DollarSign,
  Terminal,
  FileText,
  Mail,
  Video,
  MessageSquare,
  RefreshCw,
  Sliders,
  X,
  Compass,
  CheckCircle2,
  TrendingUp,
  Cpu,
  LogOut,
  Info
} from "lucide-react";
import { BusinessInput, GeneratedOutput } from "@/lib/types";
import GeneratorForm from "@/components/GeneratorForm";
import RoadmapViewer from "@/components/RoadmapViewer";
import PitchDeckView from "@/components/PitchDeckView";
import ExportActions from "@/components/ExportActions";

interface EngineOutput {
  conversionScore: number;
  auditWeaknesses: Array<{
    title: string;
    impact: string;
    fix: string;
  }>;
  outreach: {
    coldEmailSubject: string;
    coldEmailBody: string;
    instagramDm: string;
    loomScript: string;
  };
  proposalTiers: Array<{
    name: string;
    price: string;
    deliverables: string[];
    timeline: string;
  }>;
  scopeShieldClause: string;
}

interface ScopeShieldOutput {
  status: "IN_SCOPE" | "OUT_OF_SCOPE";
  reasoning: string;
  estimatedExtraHours: number;
  suggestedUpsellPrice: string;
  diplomaticReply: string;
}

export default function FreelanceClientOSPage() {
  // --- Auth & License State ---
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [sessionTier, setSessionTier] = useState<string>("PRO");

  // --- Settings Drawer State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [agencyName, setAgencyName] = useState("Apex Web Studio");
  const [defaultHourlyRate, setDefaultHourlyRate] = useState(85);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // --- Main Tabs ---
  const [activeMainTab, setActiveMainTab] = useState<"audit" | "scope" | "architect">("audit");

  // --- Copy Notification State ---
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // --- Tab 1: AI Lead Audit & Closer State ---
  const [leadBusinessName, setLeadBusinessName] = useState("South Congress Roasters");
  const [leadWebsiteUrl, setLeadWebsiteUrl] = useState("https://austinroasters.com");
  const [leadNiche, setLeadNiche] = useState("Hospitality (Cafe & Roastery)");
  const [leadService, setLeadService] = useState("High-Converting Website Redesign & Mobile CRO");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStepMsg, setAuditStepMsg] = useState("");
  const [auditError, setAuditError] = useState("");
  const [auditResult, setAuditResult] = useState<EngineOutput | null>(null);
  const [outreachTab, setOutreachTab] = useState<"email" | "dm" | "loom">("email");

  // --- Tab 2: Scope Creep Shield State ---
  const [scopeOriginal, setScopeOriginal] = useState(
    "5-Page Next.js website (Home, Menu, About, Catering, Contact). Mobile-responsive layout, Google Maps embed, allergen tags, 2 rounds of design revisions. Excludes custom payment processing, online booking engines, and database systems."
  );
  const [scopeClientMessage, setScopeClientMessage] = useState(
    "Hey! We also need an online table reservation booking system where guests can select dates, pay a $25 deposit via Stripe, and receive automated SMS text confirmations. Can we get this live before Friday's launch?"
  );
  const [scopeHourlyRate, setScopeHourlyRate] = useState(85);
  const [isAnalyzingScope, setIsAnalyzingScope] = useState(false);
  const [scopeError, setScopeError] = useState("");
  const [scopeResult, setScopeResult] = useState<ScopeShieldOutput | null>(null);

  // --- Tab 3: Architect Studio State ---
  const [architectOutput, setArchitectOutput] = useState<GeneratedOutput | null>(null);
  const [architectInput, setArchitectInput] = useState<BusinessInput | null>(null);
  const [architectSubTab, setArchitectSubTab] = useState<"roadmap" | "pitch" | "prompt">("roadmap");

  // Check auth session on mount & load localStorage
  useEffect(() => {
    // Load local storage preferences
    if (typeof window !== "undefined") {
      let storedKey = localStorage.getItem("f_os_gemini_key") || "";
      // Purge revoked/deprecated test keys automatically
      if (
        storedKey.endsWith("ML1uJQ") ||
        (storedKey && storedKey.length < 20) ||
        (storedKey && !storedKey.startsWith("AQ.") && !storedKey.startsWith("AIzaSy"))
      ) {
        localStorage.removeItem("f_os_gemini_key");
        storedKey = "";
      }
      const storedAgency = localStorage.getItem("f_os_agency_name") || "Apex Web Studio";
      const storedRate = localStorage.getItem("f_os_hourly_rate");

      setGeminiApiKey(storedKey);
      setAgencyName(storedAgency);
      if (storedRate) {
        const parsed = parseInt(storedRate, 10);
        if (!isNaN(parsed) && parsed > 0) {
          setDefaultHourlyRate(parsed);
          setScopeHourlyRate(parsed);
        }
      }
    }

    // Check Dodo Payments / Whop session
    fetch("/api/dodo-verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsUnlocked(true);
          setSessionTier(data.tier || "PRO");
        } else {
          setIsUnlocked(false);
        }
      })
      .catch(() => {
        setIsUnlocked(false);
      });
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyLicense = async (e?: React.FormEvent, directKey?: string) => {
    if (e) e.preventDefault();
    const keyToTest = directKey || licenseInput;
    if (!keyToTest.trim()) {
      setLicenseError("Please enter a license key.");
      return;
    }

    setIsVerifying(true);
    setLicenseError("");

    try {
      const res = await fetch("/api/dodo-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: keyToTest.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsUnlocked(true);
        setSessionTier(data.tier || "PRO");
      } else {
        setLicenseError(data.error || "Invalid license key.");
      }
    } catch {
      setLicenseError("Network error checking license. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/dodo-verify", { method: "DELETE" });
    } finally {
      setIsUnlocked(false);
      setLicenseInput("");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("f_os_gemini_key", geminiApiKey.trim());
    localStorage.setItem("f_os_agency_name", agencyName.trim());
    localStorage.setItem("f_os_hourly_rate", defaultHourlyRate.toString());
    setScopeHourlyRate(defaultHourlyRate);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  // --- Run AI Closer Engine (Tab 1) ---
  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadBusinessName.trim()) {
      setAuditError("Please enter the prospect business name.");
      return;
    }

    setIsAuditing(true);
    setAuditError("");
    setAuditStepMsg("Scraping prospect website for mobile, speed, & CRO signals...");

    const stepTimer = setTimeout(() => {
      setAuditStepMsg("Invoking Gemini 2.5 Flash to assemble 3-tier proposals & outreach kit...");
    }, 2800);

    try {
      const res = await fetch("/api/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: leadBusinessName.trim(),
          websiteUrl: leadWebsiteUrl.trim(),
          niche: leadNiche,
          serviceOffered: leadService,
          customApiKey: geminiApiKey.trim() || undefined,
        }),
      });

      clearTimeout(stepTimer);
      const data = await res.json();

      if (!res.ok) {
        setAuditError(data.error || "Failed to analyze website.");
        if (data.error && data.error.includes("Gemini API key")) {
          setIsSettingsOpen(true);
        }
      } else {
        setAuditResult(data.data);
      }
    } catch (err: any) {
      clearTimeout(stepTimer);
      setAuditError(err.message || "Failed to run audit engine.");
    } finally {
      setIsAuditing(false);
      setAuditStepMsg("");
    }
  };

  // --- Run Scope Creep Shield (Tab 2) ---
  const handleRunScopeShield = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scopeOriginal.trim() || !scopeClientMessage.trim()) {
      setScopeError("Please fill in both original scope and the client message.");
      return;
    }

    setIsAnalyzingScope(true);
    setScopeError("");

    try {
      const res = await fetch("/api/scope-shield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalScope: scopeOriginal.trim(),
          clientMessage: scopeClientMessage.trim(),
          hourlyRate: scopeHourlyRate,
          customApiKey: geminiApiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setScopeError(data.error || "Failed to analyze scope.");
        if (data.error && data.error.includes("Gemini API key")) {
          setIsSettingsOpen(true);
        }
      } else {
        setScopeResult(data.data);
      }
    } catch (err: any) {
      setScopeError(err.message || "Failed to evaluate scope.");
    } finally {
      setIsAnalyzingScope(false);
    }
  };

  // --- Preload Prospect into Tab 3 ---
  const handleTransferToArchitect = () => {
    setActiveMainTab("architect");
  };

  // -------------------------------------------------------------
  // 1. RENDER LOADING / AUTH CHECKING
  // -------------------------------------------------------------
  if (isUnlocked === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-spin">
            <RefreshCw className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium tracking-wide text-slate-400">
            Checking Dodo Payments license...
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. RENDER DODO PAYMENTS LICENSE LOCK SCREEN (If Not Unlocked)
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-600/20 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

        {/* Minimal Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">ClientCloser AI</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25">
                DODO EDITION
              </span>
            </div>
          </div>

          <a
            href="https://dodopayments.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Get Access — \$49/mo</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </header>

        {/* Lock Screen Body */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10 max-w-lg mx-auto w-full">
          <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto mb-4">
              <Lock className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1.5 mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Enter Your Dodo Payments License Key
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlock instant access to the AI Prospect Website Auditor, 3-Tier Proposal Closer, and Scope Creep Shield.
              </p>
              <p className="text-[11px] text-emerald-400/80 font-semibold mt-1">
                One signed client = 10× your \$49/mo investment.
              </p>
            </div>

            <form onSubmit={(e) => handleVerifyLicense(e)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dodo Payments License Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={licenseInput}
                    onChange={(e) => {
                      setLicenseInput(e.target.value);
                      if (licenseError) setLicenseError("");
                    }}
                    placeholder="Enter license key or passkey"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                  />
                </div>
                {licenseError && (
                  <p className="text-[11px] text-rose-400 font-medium mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>{licenseError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 via-amber-600 to-indigo-600 hover:from-orange-600 hover:to-indigo-700 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Validating with Dodo Payments...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Unlock ClientCloser AI</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="https://dodopayments.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-orange-400 font-medium transition-colors"
              >
                Don&apos;t have a license yet? Get Instant Access — \$49/mo on Dodo Payments →
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. RENDER UNLOCKED COMMERCIAL SAAS INTERFACE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* ================= TOP NAVBAR ================= */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  ClientCloser AI
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {sessionTier} ACTIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {agencyName} • Dodo Payments Edition
              </span>
            </div>
          </div>

          {/* Tab Navigation Center */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800/90 p-1 rounded-xl">
            <button
              onClick={() => setActiveMainTab("audit")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainTab === "audit"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>AI Lead Audit & Closer</span>
            </button>

            <button
              onClick={() => setActiveMainTab("scope")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainTab === "scope"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Scope Creep Shield</span>
            </button>

            <button
              onClick={() => setActiveMainTab("architect")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainTab === "architect"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Prompt & Architect Studio</span>
            </button>
          </nav>

          {/* Right Controls: Settings & Logout */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
              title="Agency & API Settings"
            >
              <Settings className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
              title="Lock & Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Nav */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/70 bg-slate-950/90 px-2 py-1.5">
          <button
            onClick={() => setActiveMainTab("audit")}
            className={`flex-1 py-1.5 text-center text-[11px] font-semibold rounded-lg ${
              activeMainTab === "audit" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            Audit & Closer
          </button>
          <button
            onClick={() => setActiveMainTab("scope")}
            className={`flex-1 py-1.5 text-center text-[11px] font-semibold rounded-lg ${
              activeMainTab === "scope" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            Scope Shield
          </button>
          <button
            onClick={() => setActiveMainTab("architect")}
            className={`flex-1 py-1.5 text-center text-[11px] font-semibold rounded-lg ${
              activeMainTab === "architect" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            Studio
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ========================================================= */}
        {/* TAB 1: AI LEAD AUDIT & PROPOSAL CLOSER                    */}
        {/* ========================================================= */}
        {activeMainTab === "audit" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Lead Prospect Input Bar */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="h-5 w-5 text-indigo-400" />
                    <span>Prospect Live Website Auditor & Proposal Closer</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scrapes the prospect&apos;s live website, uncovers conversion leaks, and drafts 3-tier proposals with customized cold email & Loom scripts.
                  </p>
                </div>
                <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
                  Engine: <span className="text-indigo-400 font-bold">Gemini 2.5 Flash</span>
                </div>
              </div>

              <form onSubmit={handleRunAudit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Prospect Business Name
                    </label>
                    <input
                      type="text"
                      value={leadBusinessName}
                      onChange={(e) => setLeadBusinessName(e.target.value)}
                      placeholder="e.g. South Congress Roasters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Website URL (Live Scrape)
                    </label>
                    <input
                      type="text"
                      value={leadWebsiteUrl}
                      onChange={(e) => setLeadWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Niche */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Industry / Niche
                    </label>
                    <input
                      type="text"
                      value={leadNiche}
                      onChange={(e) => setLeadNiche(e.target.value)}
                      placeholder="e.g. Specialty Coffee / Wellness / Dental"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Service Pitched */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Service Being Offered
                    </label>
                    <input
                      type="text"
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      placeholder="e.g. Next.js 5-Page Redesign"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {auditError && (
                  <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 flex items-center justify-between text-xs text-rose-300">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{auditError}</span>
                    </div>
                    {auditError.includes("Gemini API key") && (
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(true)}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                      >
                        Open Settings
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-400">
                    {isAuditing && (
                      <span className="text-indigo-400 flex items-center gap-1.5 animate-pulse font-medium">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>{auditStepMsg}</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isAuditing}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-60"
                  >
                    {isAuditing ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Analyzing Prospect...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Run AI Audit & Generate Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Audit Results View */}
            {auditResult && (
              <div className="space-y-6">
                {/* Score & Header Card */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                      Audit Diagnostic • {leadBusinessName}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Current Conversion Health Assessment
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Live crawl uncovered key friction points preventing mobile visitors from calling, booking, or purchasing.
                    </p>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 px-5 py-3.5 rounded-2xl">
                    <div className="text-center">
                      <div className="text-3xl font-black text-rose-400">
                        {auditResult.conversionScore}
                        <span className="text-xs text-slate-500 font-normal">/100</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 block">
                        CRO Score
                      </span>
                    </div>
                    <div className="h-10 w-px bg-slate-800" />
                    <div className="text-left text-xs">
                      <span className="text-amber-400 font-bold block">Critical Gaps</span>
                      <span className="text-slate-400 text-[11px]">Prime Upsell Target</span>
                    </div>
                  </div>
                </div>

                {/* 3 Audit Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {auditResult.auditWeaknesses.map((weakness, i) => (
                    <div
                      key={i}
                      className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white tracking-wide">
                            {weakness.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          <strong className="text-rose-300">Revenue Impact:</strong> {weakness.impact}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                          Our Proposed Fix:
                        </span>
                        <p className="text-[11px] text-slate-300 bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-2">
                          {weakness.fix}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3-Tier Proposal Pricing Deck */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <span>3-Tier Closing Proposal Matrix</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      Anchored pricing strategy ready to paste into client proposals
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {auditResult.proposalTiers.map((tier, idx) => {
                      const isRecommended = idx === 1;
                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl p-6 flex flex-col justify-between relative transition-all ${
                            isRecommended
                              ? "bg-gradient-to-b from-indigo-950/40 to-slate-900/90 border border-indigo-500/50 shadow-xl shadow-indigo-600/10"
                              : "bg-slate-900/60 border border-slate-800"
                          }`}
                        >
                          {isRecommended && (
                            <span className="absolute -top-2.5 right-6 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                              Recommended Close Tier
                            </span>
                          )}

                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-bold text-white">{tier.name}</h4>
                              <div className="text-2xl font-black text-white mt-1">
                                {tier.price}
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Estimated Timeline: {tier.timeline}
                              </span>
                            </div>

                            <ul className="space-y-1.5 pt-2 border-t border-slate-800">
                              {tier.deliverables.map((item, dIdx) => (
                                <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-2">
                                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6 pt-3">
                            <button
                              onClick={() =>
                                handleCopy(
                                  `${tier.name} (${tier.price})\nTimeline: ${tier.timeline}\nDeliverables:\n- ${tier.deliverables.join(
                                    "\n- "
                                  )}`,
                                  `tier_${idx}`
                                )
                              }
                              className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                isRecommended
                                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                              }`}
                            >
                              {copiedKey === `tier_${idx}` ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                                  <span>Copied Package!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy Package Details</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* High-Converting Outreach Kit */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Mail className="h-4 w-4 text-indigo-400" />
                        <span>High-Converting Outreach Kit</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Pre-written with prospect data, weakness callouts, and low-friction calls to action.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setOutreachTab("email")}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          outreachTab === "email" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Cold Email
                      </button>
                      <button
                        onClick={() => setOutreachTab("dm")}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          outreachTab === "dm" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Instagram DM
                      </button>
                      <button
                        onClick={() => setOutreachTab("loom")}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          outreachTab === "loom" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        60s Loom Script
                      </button>
                    </div>
                  </div>

                  {/* Outreach Content */}
                  <div className="mt-4">
                    {outreachTab === "email" && (
                      <div className="space-y-3">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                          <div className="text-xs">
                            <span className="text-slate-500 font-semibold mr-2">Subject:</span>
                            <span className="text-slate-200 font-medium font-mono">
                              {auditResult.outreach.coldEmailSubject}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleCopy(auditResult.outreach.coldEmailSubject, "email_subject")
                            }
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Copy Subject"
                          >
                            {copiedKey === "email_subject" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                            {auditResult.outreach.coldEmailBody}
                          </pre>
                          <button
                            onClick={() => handleCopy(auditResult.outreach.coldEmailBody, "email_body")}
                            className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 shadow"
                          >
                            {copiedKey === "email_body" ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Email</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {outreachTab === "dm" && (
                      <div className="relative">
                        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                          {auditResult.outreach.instagramDm}
                        </pre>
                        <button
                          onClick={() => handleCopy(auditResult.outreach.instagramDm, "dm_text")}
                          className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 shadow"
                        >
                          {copiedKey === "dm_text" ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy DM</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {outreachTab === "loom" && (
                      <div className="relative">
                        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed font-mono">
                          {auditResult.outreach.loomScript}
                        </pre>
                        <button
                          onClick={() => handleCopy(auditResult.outreach.loomScript, "loom_text")}
                          className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 shadow"
                        >
                          {copiedKey === "loom_text" ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Loom Script</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scope Shield Clause & Quick Transfer */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        Contract Protection: Scope Shield Clause
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono italic">
                      &quot;{auditResult.scopeShieldClause}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleCopy(auditResult.scopeShieldClause, "scope_clause")}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
                    >
                      {copiedKey === "scope_clause" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied Clause!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Clause</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleTransferToArchitect}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 whitespace-nowrap"
                    >
                      <span>Open Architect Studio</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SCOPE CREEP SHIELD                                 */}
        {/* ========================================================= */}
        {activeMainTab === "scope" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    <span>The Scope Creep Shield</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Defend your contracts, eliminate unpaid extra revisions, and diplomatically convert out-of-scope requests into high-margin upsells.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Your Hourly Rate:</span>
                  <div className="relative w-24">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="number"
                      value={scopeHourlyRate}
                      onChange={(e) => setScopeHourlyRate(parseInt(e.target.value, 10) || 75)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={handleRunScopeShield} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Scope Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      1. Original Agreed Scope of Work (from Contract or Proposal)
                    </label>
                    <textarea
                      rows={5}
                      value={scopeOriginal}
                      onChange={(e) => setScopeOriginal(e.target.value)}
                      placeholder="Paste deliverables list, agreed milestones, and revision limits..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Incoming Client Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      2. Incoming Client Request / Message (Slack, WhatsApp, Email)
                    </label>
                    <textarea
                      rows={5}
                      value={scopeClientMessage}
                      onChange={(e) => setScopeClientMessage(e.target.value)}
                      placeholder="Paste what the client just asked you to add or change..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                    />
                  </div>
                </div>

                {scopeError && (
                  <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 flex items-center justify-between text-xs text-rose-300">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{scopeError}</span>
                    </div>
                    {scopeError.includes("Gemini API key") && (
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(true)}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                      >
                        Open Settings
                      </button>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isAnalyzingScope}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all disabled:opacity-60"
                  >
                    {isAnalyzingScope ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Evaluating Contract Boundaries...</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Analyze Scope & Defend Contract</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Scope Shield Output */}
            {scopeResult && (
              <div
                className={`rounded-2xl border p-6 shadow-2xl space-y-6 ${
                  scopeResult.status === "OUT_OF_SCOPE"
                    ? "bg-slate-900/90 border-amber-500/40 shadow-amber-500/5"
                    : "bg-slate-900/90 border-emerald-500/40 shadow-emerald-500/5"
                }`}
              >
                {/* Status Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        scopeResult.status === "OUT_OF_SCOPE"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {scopeResult.status === "OUT_OF_SCOPE" ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-md ${
                            scopeResult.status === "OUT_OF_SCOPE"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          {scopeResult.status === "OUT_OF_SCOPE"
                            ? "OUT OF SCOPE — UPSELL OPPORTUNITY"
                            : "IN SCOPE — INCLUDED DELIVERABLE"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{scopeResult.reasoning}</p>
                    </div>
                  </div>

                  {/* Financial Upsell Stats (if out of scope) */}
                  {scopeResult.status === "OUT_OF_SCOPE" && (
                    <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          Estimated Effort
                        </span>
                        <span className="text-base font-bold text-white">
                          +{scopeResult.estimatedExtraHours} hrs
                        </span>
                      </div>
                      <div className="h-8 w-px bg-slate-800" />
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase block font-semibold">
                          Change Order Fee
                        </span>
                        <span className="text-base font-bold text-emerald-400">
                          {scopeResult.suggestedUpsellPrice}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diplomatic Ready-To-Paste Reply */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Diplomatic Client Reply (Copy & Paste to Slack/Email):</span>
                    </span>

                    <button
                      onClick={() => handleCopy(scopeResult.diplomaticReply, "diplomatic_reply")}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow"
                    >
                      {copiedKey === "diplomatic_reply" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-300" />
                          <span>Copied Message!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Reply</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                    {scopeResult.diplomaticReply}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PROMPT & SITE ARCHITECT STUDIO                     */}
        {/* ========================================================= */}
        {activeMainTab === "architect" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Embedded Generator Form */}
            <GeneratorForm
              onGenerate={(outputData, inputData) => {
                setArchitectOutput(outputData);
                setArchitectInput(inputData);
              }}
            />

            {/* Generated Deliverables Display */}
            {architectOutput && architectInput && (
              <div className="space-y-6 mt-8">
                {/* Export Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider font-mono">
                      Generated Deliverable Assets
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {architectInput.businessName} ({architectInput.specificType})
                    </h3>
                  </div>

                  <ExportActions data={architectOutput} businessName={architectInput.businessName} />
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setArchitectSubTab("roadmap")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      architectSubTab === "roadmap"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>5-Page Architecture Roadmap</span>
                  </button>

                  <button
                    onClick={() => setArchitectSubTab("pitch")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      architectSubTab === "pitch"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>3-Tier Closing Deck</span>
                  </button>

                  <button
                    onClick={() => setArchitectSubTab("prompt")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      architectSubTab === "prompt"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span>AI Coding System Prompt</span>
                  </button>
                </div>

                {/* Sub Tab Content */}
                {architectSubTab === "roadmap" && (
                  <RoadmapViewer
                    siteMapMarkdown={architectOutput.siteMapMarkdown}
                    systemPrompt={architectOutput.systemPrompt}
                    businessName={architectInput.businessName}
                  />
                )}

                {architectSubTab === "pitch" && (
                  <PitchDeckView
                    pitchScriptMarkdown={architectOutput.pitchScriptMarkdown}
                    pricing={architectOutput.pricing}
                    businessName={architectInput.businessName}
                  />
                )}

                {architectSubTab === "prompt" && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-indigo-400" />
                        <span>Ready-to-Run System Instruction (Cursor / Claude / Antigravity)</span>
                      </span>

                      <button
                        onClick={() => handleCopy(architectOutput.systemPrompt, "system_prompt_direct")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5"
                      >
                        {copiedKey === "system_prompt_direct" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-300" />
                            <span>Copied System Prompt!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Full Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                      {architectOutput.systemPrompt}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= ZERO-CODE SETTINGS DRAWER ================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">ClientCloser AI Settings</h3>
                <span className="text-[11px] text-slate-400">Zero-code browser storage (no .env required)</span>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Agency Brand Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Agency / Freelancer Brand Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. Apex Web Studio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Default Hourly Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Default Hourly Rate ($ USD)
                </label>
                <input
                  type="number"
                  value={defaultHourlyRate}
                  onChange={(e) => setDefaultHourlyRate(parseInt(e.target.value, 10) || 75)}
                  placeholder="85"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Google Gemini API Key */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <span>Get Free Key (30s)</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Optional. Built-in Gemini AI is active by default. Enter a custom key only if you wish to use your own personal API quota.
                </p>
              </div>

              {settingsSavedToast && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-400 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Preferences saved successfully!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
