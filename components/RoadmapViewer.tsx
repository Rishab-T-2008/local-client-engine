"use client";

import React, { useState } from "react";
import { Copy, Check, FileCode, Layers, CheckCircle2 } from "lucide-react";

interface RoadmapViewerProps {
  siteMapMarkdown: string;
  systemPrompt: string;
  businessName: string;
}

export default function RoadmapViewer({
  siteMapMarkdown,
  systemPrompt,
  businessName,
}: RoadmapViewerProps) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "prompt">("roadmap");
  const [copied, setCopied] = useState(false);

  const currentContent = activeTab === "roadmap" ? siteMapMarkdown : systemPrompt;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "roadmap"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>5-Page Roadmap & Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "prompt"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>AI Coding Agent System Prompt</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Section</span>
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 font-sans">
        {activeTab === "roadmap" ? (
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Client-Ready Roadmap for {businessName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hand this 5-page blueprint to the business owner to validate requirements, or feed it into Cursor / Antigravity alongside the System Prompt.
                </p>
              </div>
            </div>

            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 overflow-x-auto leading-relaxed">
              {siteMapMarkdown}
            </pre>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Optimized for Cursor Agent, Google Antigravity, Claude 3.5 Sonnet, and OpenAI o1/o3-mini.</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs text-emerald-200/90 bg-slate-950/90 p-5 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed shadow-inner">
              {systemPrompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

