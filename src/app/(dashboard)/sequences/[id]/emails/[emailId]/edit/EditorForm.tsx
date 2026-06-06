"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EmailRow {
  id: string;
  sequence_id: string;
  day_offset: number;
  subject: string;
  preview_text: string | null;
  body_html: string;
  position: number;
  user_id: string;
}

interface EditorFormProps {
  email: EmailRow;
}

export default function EditorForm({ email }: EditorFormProps) {
  const router = useRouter();

  // Inputs state
  const [subject, setSubject] = useState(email.subject);
  const [previewText, setPreviewText] = useState(email.preview_text || "");
  const [bodyHtml, setBodyHtml] = useState(email.body_html);

  // Debounced html for preview
  const [debouncedHtml, setDebouncedHtml] = useState(email.body_html);

  // Layout states
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Debounce the bodyHtml updates for the preview panel
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHtml(bodyHtml);
    }, 500);

    return () => clearTimeout(timer);
  }, [bodyHtml]);

  // Handle toast timeout
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (subject.length < 3 || subject.length > 60) {
      setToast({
        show: true,
        message: "Subject line must be between 3 and 60 characters.",
        type: "error",
      });
      return;
    }

    if (previewText.length > 90) {
      setToast({
        show: true,
        message: "Preview text must be under 90 characters.",
        type: "error",
      });
      return;
    }

    if (bodyHtml.length < 10) {
      setToast({
        show: true,
        message: "Email body must be at least 10 characters.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch(`/api/emails/${email.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          preview_text: previewText,
          body_html: bodyHtml,
        }),
      });

      const data = await res.json();

      setIsSaving(false);

      if (!res.ok) {
        setToast({
          show: true,
          message: data.error || "Failed to save email",
          type: "error",
        });
      } else {
        setToast({
          show: true,
          message: "Email saved successfully!",
          type: "success",
        });
        router.refresh();
      }
    } catch (err) {
      setIsSaving(false);
      setToast({
        show: true,
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
        type: "error",
      });
    }
  };

  // Compile full iframe srcDoc content
  const previewSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #334155;
            line-height: 1.6;
            padding: 24px;
            margin: 0;
            background-color: #ffffff;
          }
          h1, h2, h3 { color: #0f172a; margin-top: 0; }
          a { color: #4f46e5; text-decoration: underline; }
          .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${debouncedHtml || '<p style="color: #94a3b8; font-style: italic;">Start typing in the editor to see preview...</p>'}
      </body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col relative text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 ${
          toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          {toast.type === "success" ? (
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Editor Header / Navbar */}
      <header className="h-16 border-b border-slate-800 bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            href={`/sequences/${email.sequence_id}`}
            className="p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
            title="Back to sequence"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              Day {email.day_offset}
            </span>
            <span className="text-slate-700">/</span>
            <h1 className="text-sm font-semibold text-slate-300 max-w-[200px] truncate">
              {email.subject}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/sequences/${email.sequence_id}`}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </header>

      {/* Workspace split columns */}
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Form Editor */}
        <section className="w-full lg:w-1/2 flex flex-col p-6 overflow-y-auto border-r border-slate-800 space-y-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Edit Campaign Step</h2>
            <p className="text-slate-400 text-xs">Update your onboarding copy, subject lines, and preview headers below.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 flex-grow flex flex-col">
            
            {/* Read only day offset indicator */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Sequence Offset
              </label>
              <div className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl px-4 py-3 text-slate-400 font-medium text-sm flex items-center gap-2 select-none">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>This email is configured to send on **Day {email.day_offset}**</span>
              </div>
            </div>

            {/* Subject Line Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="subject" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Subject Line
                </label>
                <span className={`text-xs font-semibold ${
                  subject.length > 50 ? "text-rose-400" : subject.length > 40 ? "text-amber-400" : "text-slate-500"
                }`}>
                  {subject.length} / 60
                </span>
              </div>
              <input
                id="subject"
                type="text"
                required
                maxLength={60}
                placeholder="Welcome to our platform!"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-slate-800 focus:border-indigo-500/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
              />
            </div>

            {/* Preview Text Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="previewText" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Preview Text (Snippet)
                </label>
                <span className={`text-xs font-semibold ${
                  previewText.length > 80 ? "text-rose-400" : "text-slate-500"
                }`}>
                  {previewText.length} / 90
                </span>
              </div>
              <input
                id="previewText"
                type="text"
                maxLength={90}
                placeholder="Get started with your free trial inside..."
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-slate-800 focus:border-indigo-500/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>

            {/* Monospace Body HTML Area */}
            <div className="space-y-2 flex-grow flex flex-col">
              <label htmlFor="bodyHtml" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email HTML Body
              </label>
              <div className="flex-grow min-h-[350px] relative flex">
                <textarea
                  id="bodyHtml"
                  required
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  className="w-full flex-grow bg-[#0A0A0A] border border-slate-800 focus:border-indigo-500/80 rounded-xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-sm leading-relaxed resize-none"
                  placeholder="<p>Hello world!</p>"
                />
              </div>
            </div>

          </form>
        </section>

        {/* Right Live Preview Panel */}
        <section className="w-full lg:w-1/2 flex flex-col bg-[#0b1121]/50 p-6 overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800 relative z-10">
          
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Preview</span>
            </div>

            {/* Desktop / Mobile viewports switcher */}
            <div className="bg-[#0A0A0A] border border-slate-800 rounded-lg p-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewportMode("desktop")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewportMode === "desktop"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("mobile")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewportMode === "mobile"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Iframe Outer Container */}
          <div className="flex-grow flex items-center justify-center p-4 overflow-y-auto">
            <div
              className={`w-full h-full transition-all duration-300 flex items-center justify-center ${
                viewportMode === "mobile"
                  ? "max-w-[375px] max-h-[660px] border-8 border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative bg-white"
                  : "w-full rounded-2xl overflow-hidden shadow-xl border border-slate-800 bg-white"
              }`}
            >
              {/* If Mobile, draw simple mock header */}
              {viewportMode === "mobile" && (
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-16 h-2 bg-slate-950 rounded-full" />
                </div>
              )}
              
              <iframe
                title="Email Template Live Preview"
                srcDoc={previewSrcDoc}
                sandbox=""
                className={`w-full h-full border-0 bg-white ${
                  viewportMode === "mobile" ? "pt-4" : ""
                }`}
              />
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
