"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BusinessInput, GeneratedOutput } from "@/lib/types";
import GeneratorForm from "@/components/GeneratorForm";
import RoadmapViewer from "@/components/RoadmapViewer";
import PitchDeckView from "@/components/PitchDeckView";
import ExportActions from "@/components/ExportActions";
import WhopAuthButton from "@/components/WhopAuthButton";
import { ArrowLeft, Sparkles, Layers, DollarSign, Terminal, CheckCircle2 } from "lucide-react";

export default function GeneratorPage() {
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [businessInput, setBusinessInput] = useState<BusinessInput | null>(null);
  const [activeTab, setActiveTab] = useState<"roadmap" | "pitch">("roadmap");

  const handleGenerate = (data: GeneratedOutput, input: BusinessInput) => {
    setOutput(data);
    setBusinessInput(input);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-sm font-bold text-white tracking-wide">
                Prompt & Roadmap Assembler
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <WhopAuthButton />
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* If output is present, render top export ribbon */}
        {output && businessInput && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                Generated Asset Pack
              </span>
              <h2 className="text-xl font-bold text-white">
                {businessInput.businessName} ({businessInput.location})
              </h2>
            </div>
            <ExportActions data={output} businessName={businessInput.businessName} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Generator Form (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Client Engine Inputs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill in the local business profile to generate tailor-made prompts, roadmaps, and pitch scripts.
              </p>
            </div>

            <GeneratorForm onGenerate={handleGenerate} />
          </div>

          {/* Right Column: Output Viewer or Empty State (7 cols) */}
          <div className="lg:col-span-7">
            {output && businessInput ? (
              <div className="space-y-4">
                {/* Secondary Tab selector for Right Column */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 w-fit">
                  <button
                    onClick={() => setActiveTab("roadmap")}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "roadmap"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Roadmap & AI Prompt</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pitch")}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "pitch"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>3-Tier Pitch Deck & Script</span>
                  </button>
                </div>

                <div className="h-[750px]">
                  {activeTab === "roadmap" ? (
                    <RoadmapViewer
                      siteMapMarkdown={output.siteMapMarkdown}
                      systemPrompt={output.systemPrompt}
                      businessName={businessInput.businessName}
                    />
                  ) : (
                    <PitchDeckView
                      pitchScriptMarkdown={output.pitchScriptMarkdown}
                      pricing={output.pricing}
                      businessName={businessInput.businessName}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="h-[600px] rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 flex flex-col items-center justify-center p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 glow-indigo">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Deliverables Ready on Command</h3>
                <p className="text-sm text-slate-400 max-w-md mt-1 mb-6">
                  Select a preset on the left or enter your target client's details, then click "Generate Client Deliverables".
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left">
                  <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60">
                    <Terminal className="h-4 w-4 text-indigo-400 mb-2" />
                    <div className="text-xs font-semibold text-white">AI Scaffolder Prompt</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Ready for Cursor, Antigravity, and Claude.</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60">
                    <Layers className="h-4 w-4 text-emerald-400 mb-2" />
                    <div className="text-xs font-semibold text-white">5-Page Sitemap</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Mobile sticky CTAs and Local Schema.</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60">
                    <DollarSign className="h-4 w-4 text-amber-400 mb-2" />
                    <div className="text-xs font-semibold text-white">3-Tier Pitch Script</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Calculated Anchor, Target, and Floor.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

