"use client";

import React, { useState, useEffect } from "react";

interface ExportButtonProps {
  sequenceId: string;
  sequenceName: string;
  emailsCount: number;
}

export default function ExportButton({
  sequenceId,
  sequenceName,
  emailsCount,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setToast((prev) => ({ ...prev, show: false }));

    try {
      const res = await fetch(`/api/sequences/${sequenceId}/export`);

      if (!res.ok) {
        let errorMsg = "Failed to export emails";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          // Ignore parse errors, use default
        }
        throw new Error(errorMsg);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const safeName = sequenceName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      a.download = `${safeName}-emails.zip`;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setToast({
        show: true,
        message: `${emailsCount} email${emailsCount === 1 ? "" : "s"} downloaded`,
        type: "success",
      });
    } catch (err) {
      setToast({
        show: true,
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 ${
          toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          {toast.type === "success" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-all flex items-center gap-2 ${
          isExporting
            ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
            : "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
        }`}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export HTML</span>
          </>
        )}
      </button>
    </>
  );
}
