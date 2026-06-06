"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Template } from "@/lib/templates";
import { TemplateThumbnail } from "./TemplateThumbnail";

interface TemplatePreviewModalProps {
  template: Template;
  onClose: () => void;
}

export function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
  const router = useRouter();
  const [activeEmailIndex, setActiveEmailIndex] = useState(0);

  const activeEmail = template.emails[activeEmailIndex];

  const handleUseTemplate = () => {
    onClose();
    router.push(`/generate?template=${template.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#09090b]/80 backdrop-blur-md overflow-y-auto p-4 sm:p-6 md:p-12">
      <div className="bg-[#0b1121] border border-slate-800 w-full max-w-[800px] rounded-2xl shadow-2xl flex flex-col relative my-auto min-h-[600px] max-h-full overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-800/50">
          <h2 className="text-3xl font-bold text-white pr-12">{template.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
              {template.goal}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs font-semibold uppercase tracking-wider border border-slate-700">
              {template.emailCount} Emails
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs font-semibold uppercase tracking-wider border border-slate-700">
              {template.layoutStyle}
            </span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Tabs - Sidebar on desktop, top row on mobile */}
          <div className="w-full md:w-48 bg-[#09090b]/50 border-b md:border-b-0 md:border-r border-slate-800/50 overflow-x-auto md:overflow-y-auto shrink-0 p-4 scrollbar-hide">
            <div className="flex md:flex-col gap-2">
              {template.emails.map((email, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveEmailIndex(idx)}
                  className={`flex flex-col items-start px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal text-left ${
                    activeEmailIndex === idx 
                      ? "bg-slate-800/80 shadow-sm border border-slate-700" 
                      : "border border-transparent hover:bg-slate-800/40"
                  }`}
                >
                  <span className={`text-xs font-bold ${activeEmailIndex === idx ? "text-indigo-400" : "text-slate-500"}`}>
                    Day {email.dayOffset}
                  </span>
                  <span className={`text-sm font-medium mt-0.5 truncate w-full ${activeEmailIndex === idx ? "text-white" : "text-slate-400"}`}>
                    {email.purpose}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Wireframe Preview Area */}
          <div className="flex-1 bg-[#09090b] p-6 md:p-8 overflow-y-auto flex justify-center items-center">
            <div className="w-full max-w-md bg-transparent flex flex-col justify-center items-center">
               <div className="w-[320px] shadow-2xl relative">
                  <div className="absolute -inset-4 bg-indigo-500/10 blur-xl rounded-full z-0 pointer-events-none"></div>
                  <div className="relative z-10">
                    <TemplateThumbnail contentType={activeEmail.contentType} className="rounded-2xl border border-slate-700/50 !h-[450px]" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Bar */}
        <div className="bg-[#0b1121] border-t border-slate-800/50 p-4 md:px-8 md:py-5 flex items-center justify-between mt-auto shrink-0">
          <div className="hidden sm:block">
            <p className="text-sm text-slate-400 font-medium">Selected Template</p>
            <p className="text-white font-semibold">{template.name}</p>
          </div>
          <button 
            onClick={handleUseTemplate}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <span>Use this template</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
