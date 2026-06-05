"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GenerateSequencePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sequenceName: "",
    productDescription: "",
    tone: "professional" as "professional" | "friendly" | "casual",
  });
  
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: workspace, error } = await supabase
          .from("workspaces")
          .select("brand_name, product_description")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (workspace) {
          setFormData((prev) => ({
            ...prev,
            productDescription: workspace.product_description || "",
            sequenceName: workspace.brand_name
              ? `${workspace.brand_name} Onboarding Sequence`
              : "",
          }));
        } else {
          router.push("/onboarding");
        }
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : "Failed to load workspace data."
        );
      } finally {
        setIsLoadingWorkspace(false);
      }
    };

    fetchWorkspaceData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sequenceName || !formData.productDescription) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/generate-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate sequence.");
      }

      router.push(`/sequences/${data.sequenceId}`);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Generation failed. Please try again."
      );
      setIsGenerating(false);
    }
  };

  if (isLoadingWorkspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm text-slate-400 font-medium">Loading workspace configurations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Generation Loading State Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="text-center space-y-6 max-w-sm px-4">
            <div className="relative w-24 h-24 mx-auto">
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-indigo-600 animate-spin" />
              {/* Inner Pulsing Magic Icon */}
              <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center text-indigo-400">
                <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gemini is writing your emails...</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Writing 7 conversion-optimized onboarding emails matching your brand&apos;s voice and product highlights. This takes about 5-10 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Generate Email Sequence</h2>
            <p className="text-xs text-slate-400">Powered by Google Gemini 2.5 Flash</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sequence Name */}
          <div className="space-y-2">
            <label htmlFor="sequenceName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sequence Name
            </label>
            <input
              id="sequenceName"
              type="text"
              required
              placeholder="e.g. Notion Onboarding Sequence"
              value={formData.sequenceName}
              onChange={(e) => setFormData({ ...formData, sequenceName: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <label htmlFor="productDescription" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product Description
            </label>
            <textarea
              id="productDescription"
              required
              rows={5}
              placeholder="Describe your product value and onboarding goals..."
              value={formData.productDescription}
              onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm resize-none"
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Writing Tone
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["professional", "friendly", "casual"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, tone: t })}
                  className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                    formData.tone === t
                      ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate My Emails</span>
          </button>
        </form>
      </div>
    </div>
  );
}
