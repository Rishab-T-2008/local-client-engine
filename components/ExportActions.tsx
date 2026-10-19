"use client";

import React, { useState } from "react";
import { GeneratedOutput } from "@/lib/types";
import { Copy, Check, Download, Sparkles, Terminal, FileText, DollarSign } from "lucide-react";

interface ExportActionsProps {
  data: GeneratedOutput;
  businessName: string;
}

export default function ExportActions({ data, businessName }: ExportActionsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyAll = () => {
    const fullBundle = `=====================================================
LOCAL CLIENT ENGINE DELIVERABLE BUNDLE: ${businessName.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}
=====================================================

1. AI AGENT SYSTEM INSTRUCTION (CURSOR / ANTIGRAVITY / CLAUDE)
-----------------------------------------------------
${data.systemPrompt}

=====================================================
2. 5-PAGE PRODUCTION SITE ROADMAP & SPECIFICATION
-----------------------------------------------------
${data.siteMapMarkdown}

=====================================================
3. 3-TIER PRICING PITCH DECK & OBJECTION SCRIPTS
-----------------------------------------------------
${data.pitchScriptMarkdown}
`;
    copyToClipboard(fullBundle, "all");
  };

  const handleDownloadMarkdown = () => {
    const fullBundle = `# DELIVERABLE PACK: ${businessName}\n\n` +
      `## 1. System Prompt\n\`\`\`markdown\n${data.systemPrompt}\n\`\`\`\n\n` +
      `## 2. Roadmap\n\n${data.siteMapMarkdown}\n\n` +
      `## 3. Pitch Script\n\n${data.pitchScriptMarkdown}\n`;

    const blob = new Blob([fullBundle], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = businessName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "local-client";
    link.setAttribute("href", url);
    link.setAttribute("download", `${safeName}-deliverables.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
      <button
        onClick={handleCopyAll}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all active:scale-95"
      >
        {copiedKey === "all" ? (
          <>
            <Check className="h-4 w-4 text-white" />
            <span>Bundle Copied!</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-emerald-100" />
            <span>Copy Full Deliverable Bundle</span>
          </>
        )}
      </button>

      <button
        onClick={() => copyToClipboard(data.systemPrompt, "prompt")}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all hover:border-slate-600 active:scale-95"
      >
        {copiedKey === "prompt" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Terminal className="h-3.5 w-3.5 text-indigo-400" />}
        <span>System Prompt</span>
      </button>

      <button
        onClick={() => copyToClipboard(data.siteMapMarkdown, "roadmap")}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all hover:border-slate-600 active:scale-95"
      >
        {copiedKey === "roadmap" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileText className="h-3.5 w-3.5 text-sky-400" />}
        <span>Sitemap Roadmap</span>
      </button>

      <button
        onClick={() => copyToClipboard(data.pitchScriptMarkdown, "pitch")}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all hover:border-slate-600 active:scale-95"
      >
        {copiedKey === "pitch" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <DollarSign className="h-3.5 w-3.5 text-amber-400" />}
        <span>Pitch Script</span>
      </button>

      <div className="h-5 w-px bg-slate-800 hidden sm:block mx-1" />

      <button
        onClick={handleDownloadMarkdown}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all hover:border-slate-600 active:scale-95 ml-auto"
        title="Download Markdown Bundle"
      >
        <Download className="h-3.5 w-3.5 text-slate-400" />
        <span>Download .md</span>
      </button>
    </div>
  );
}

