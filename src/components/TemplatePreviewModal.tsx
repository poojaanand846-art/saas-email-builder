"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Template } from "@/lib/templates";

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

  // Helper to render skeleton wireframes based on content type
  const renderWireframeContent = (contentType: string) => {
    const type = contentType.toLowerCase();

    if (type.includes("video")) {
      return (
        <div className="space-y-4">
          <div className="h-4 w-3/4 bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-5/6 bg-neutral-200 rounded-md"></div>
          <div className="w-full aspect-video bg-neutral-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="h-4 w-2/3 bg-neutral-200 rounded-md"></div>
          <div className="mt-6 flex justify-center">
            <div className="h-10 w-40 bg-indigo-600 rounded-lg"></div>
          </div>
        </div>
      );
    }

    if (type.includes("screenshot")) {
      return (
        <div className="space-y-4">
          <div className="h-4 w-5/6 bg-neutral-200 rounded-md"></div>
          <div className="w-full rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            <div className="h-6 bg-neutral-100 border-b border-neutral-200 flex items-center px-3 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
              <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
            </div>
            <div className="h-32 bg-neutral-50 p-4 flex flex-col gap-2">
              <div className="h-4 w-1/3 bg-neutral-200 rounded"></div>
              <div className="h-20 bg-neutral-200 rounded"></div>
            </div>
          </div>
          <div className="h-3 w-1/2 bg-neutral-200 rounded-md mx-auto"></div>
          <div className="mt-6 flex justify-center">
            <div className="h-10 w-40 bg-indigo-600 rounded-lg"></div>
          </div>
        </div>
      );
    }

    if (type.includes("social proof") || type.includes("testimonial")) {
      return (
        <div className="space-y-6">
          <div className="h-4 w-full bg-neutral-200 rounded-md"></div>
          <div className="p-6 bg-indigo-50/50 rounded-xl border border-indigo-100 relative">
            <div className="text-4xl text-indigo-200 absolute top-4 left-4 font-serif">&quot;</div>
            <div className="space-y-3 relative z-10 pt-2 pl-4">
              <div className="h-3 w-full bg-neutral-300 rounded"></div>
              <div className="h-3 w-5/6 bg-neutral-300 rounded"></div>
              <div className="h-3 w-4/6 bg-neutral-300 rounded"></div>
              <div className="flex items-center gap-3 pt-4">
                <div className="w-10 h-10 rounded-full bg-neutral-300"></div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-neutral-300 rounded"></div>
                  <div className="h-2 w-16 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="h-10 w-40 bg-indigo-600 rounded-lg"></div>
          </div>
        </div>
      );
    }

    if (type.includes("feature grid") || type.includes("grid")) {
      return (
        <div className="space-y-6">
          <div className="h-4 w-3/4 bg-neutral-200 rounded-md mx-auto"></div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center">
                  <div className="w-4 h-4 bg-indigo-300 rounded-sm"></div>
                </div>
                <div className="h-2 w-full bg-neutral-300 rounded mt-1"></div>
                <div className="h-2 w-5/6 bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <div className="h-10 w-40 bg-indigo-600 rounded-lg"></div>
          </div>
        </div>
      );
    }

    if (type.includes("inline images")) {
      return (
        <div className="space-y-4">
          <div className="h-4 w-full bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-4/5 bg-neutral-200 rounded-md"></div>
          <div className="w-full h-24 bg-neutral-100 rounded-lg border border-neutral-200"></div>
          <div className="h-4 w-full bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-3/4 bg-neutral-200 rounded-md"></div>
          <div className="w-full h-24 bg-neutral-100 rounded-lg border border-neutral-200"></div>
          <div className="mt-6 flex justify-center">
            <div className="h-10 w-40 bg-indigo-600 rounded-lg"></div>
          </div>
        </div>
      );
    }

    if (type.includes("branded")) {
      return (
        <div className="space-y-5">
          <div className="h-12 w-full bg-indigo-50 rounded-lg border border-indigo-100 flex items-center px-4">
            <div className="w-6 h-6 rounded-full bg-indigo-200"></div>
            <div className="ml-3 h-3 w-20 bg-indigo-200 rounded"></div>
          </div>
          <div className="h-4 w-full bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-11/12 bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-4/5 bg-neutral-200 rounded-md"></div>
          <div className="mt-6 flex justify-center">
            <div className="h-10 w-full bg-indigo-600 rounded-lg"></div>
          </div>
        </div>
      );
    }

    if (type.includes("hero image") || type.includes("image")) {
      return (
        <div className="space-y-4">
          <div className="w-full h-40 bg-neutral-200 rounded-xl"></div>
          <div className="h-4 w-full bg-neutral-200 rounded-md mt-4"></div>
          <div className="h-4 w-5/6 bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-3/4 bg-neutral-200 rounded-md"></div>
          <div className="mt-6 flex justify-center">
            <div className="h-10 w-40 bg-indigo-600 rounded-lg"></div>
          </div>
        </div>
      );
    }

    // Default: Text only
    return (
      <div className="space-y-4">
        <div className="h-4 w-full bg-neutral-200 rounded-md"></div>
        <div className="h-4 w-11/12 bg-neutral-200 rounded-md"></div>
        <div className="h-4 w-full bg-neutral-200 rounded-md"></div>
        <div className="h-4 w-4/5 bg-neutral-200 rounded-md"></div>
        <div className="mt-8">
          <div className="h-10 w-40 bg-indigo-600 rounded-lg"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 md:p-12">
      <div className="bg-white w-full max-w-[800px] rounded-2xl shadow-2xl flex flex-col relative my-auto min-h-[600px] max-h-full overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="px-8 pt-8 pb-6 border-b border-neutral-100">
          <h2 className="text-3xl font-bold text-neutral-900 pr-12">{template.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
              {template.goal}
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold uppercase tracking-wider border border-neutral-200">
              {template.emailCount} Emails
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold uppercase tracking-wider border border-neutral-200">
              {template.layoutStyle}
            </span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Tabs - Sidebar on desktop, top row on mobile */}
          <div className="w-full md:w-48 bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-100 overflow-x-auto md:overflow-y-auto shrink-0 p-4">
            <div className="flex md:flex-col gap-2">
              {template.emails.map((email, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveEmailIndex(idx)}
                  className={`flex flex-col items-start px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal text-left ${
                    activeEmailIndex === idx 
                      ? "bg-white shadow-sm border border-neutral-200" 
                      : "border border-transparent hover:bg-neutral-100"
                  }`}
                >
                  <span className={`text-xs font-bold ${activeEmailIndex === idx ? "text-indigo-600" : "text-neutral-500"}`}>
                    Day {email.dayOffset}
                  </span>
                  <span className={`text-sm font-medium mt-0.5 truncate w-full ${activeEmailIndex === idx ? "text-neutral-900" : "text-neutral-600"}`}>
                    {email.purpose}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Wireframe Preview Area */}
          <div className="flex-1 bg-neutral-100/50 p-6 md:p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden flex flex-col my-auto">
              {/* Email Header */}
              <div className="h-1.5 w-full bg-indigo-500"></div>
              <div className="p-6 pb-0 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                <div className="h-4 w-24 bg-neutral-200 rounded"></div>
              </div>
              
              {/* Email Body */}
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-neutral-300 rounded-md"></div>
                </div>
                
                {renderWireframeContent(activeEmail.contentType)}
              </div>

              {/* Email Footer */}
              <div className="bg-neutral-50 p-6 border-t border-neutral-100 mt-auto">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-3 w-40 bg-neutral-200 rounded"></div>
                  <div className="h-3 w-32 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Bar */}
        <div className="bg-white border-t border-neutral-100 p-4 md:px-8 md:py-5 flex items-center justify-between mt-auto shrink-0">
          <div className="hidden sm:block">
            <p className="text-sm text-neutral-500 font-medium">Selected Template</p>
            <p className="text-neutral-900 font-semibold">{template.name}</p>
          </div>
          <button 
            onClick={handleUseTemplate}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
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
