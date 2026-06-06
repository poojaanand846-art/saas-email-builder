"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveAsTemplateButton({
  sequenceId,
  sequenceName,
  isPro,
}: {
  sequenceId: string;
  sequenceName: string;
  isPro: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [templateName, setTemplateName] = useState(sequenceName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!templateName.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/templates/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: templateName, sequenceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save template");
      
      setIsOpen(false);
      router.push("/templates");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to save template");
      } else {
        setError("Failed to save template");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        <span>Save as template</span>
      </button>

      {/* Upgrade Prompt */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Pro Feature</h3>
            <p className="text-sm text-neutral-400">
              Saving custom sequences as reusable templates is available on the Pro plan.
            </p>
            <div className="pt-4 flex gap-3">
              <button onClick={() => setShowUpgrade(false)} className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white text-sm font-medium transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Save as template</h3>
            <p className="text-sm text-neutral-400">
              This sequence will be saved to your private template library.
            </p>
            
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Template name</label>
                <input 
                  type="text" 
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Visibility</label>
                <select disabled className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm opacity-60">
                  <option>Private (just me)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white text-sm font-medium transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving || !templateName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
