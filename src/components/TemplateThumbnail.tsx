import React from "react";

interface TemplateThumbnailProps {
  contentType: string;
  className?: string;
}

export function TemplateThumbnail({ contentType, className = "" }: TemplateThumbnailProps) {
  const type = contentType.toLowerCase();

  const renderContent = () => {
    if (type.includes("video")) {
      return (
        <div className="space-y-3">
          <div className="h-3 w-3/4 bg-slate-700/50 rounded-md"></div>
          <div className="h-3 w-5/6 bg-slate-700/50 rounded-md"></div>
          <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden group border border-slate-700/50">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-indigo-500/30">
              <svg className="w-3 h-3 text-indigo-400 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="h-3 w-2/3 bg-slate-700/50 rounded-md"></div>
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-24 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          </div>
        </div>
      );
    }

    if (type.includes("screenshot")) {
      return (
        <div className="space-y-3">
          <div className="h-3 w-5/6 bg-slate-700/50 rounded-md"></div>
          <div className="w-full rounded-xl border border-slate-700/50 bg-[#0A0A0A] overflow-hidden shadow-sm">
            <div className="h-4 bg-slate-900 border-b border-slate-800 flex items-center px-2 gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
            </div>
            <div className="h-20 bg-slate-900/50 p-2 flex flex-col gap-1.5">
              <div className="h-2 w-1/3 bg-slate-800 rounded"></div>
              <div className="h-12 bg-slate-800 rounded"></div>
            </div>
          </div>
          <div className="h-2 w-1/2 bg-slate-700/50 rounded-md mx-auto"></div>
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-24 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          </div>
        </div>
      );
    }

    if (type.includes("social proof") || type.includes("testimonial")) {
      return (
        <div className="space-y-4">
          <div className="h-3 w-full bg-slate-700/50 rounded-md"></div>
          <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 relative">
            <div className="text-2xl text-indigo-400/30 absolute top-2 left-2 font-serif">&quot;</div>
            <div className="space-y-2 relative z-10 pt-1 pl-3">
              <div className="h-2 w-full bg-slate-600/50 rounded"></div>
              <div className="h-2 w-5/6 bg-slate-600/50 rounded"></div>
              <div className="h-2 w-4/6 bg-slate-600/50 rounded"></div>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-6 h-6 rounded-full bg-slate-700/50"></div>
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-slate-600/50 rounded"></div>
                  <div className="h-1.5 w-10 bg-slate-700/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-24 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          </div>
        </div>
      );
    }

    if (type.includes("feature grid") || type.includes("grid")) {
      return (
        <div className="space-y-4">
          <div className="h-3 w-3/4 bg-slate-700/50 rounded-md mx-auto"></div>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1.5 flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <div className="w-3 h-3 bg-indigo-400 rounded-sm"></div>
                </div>
                <div className="h-1.5 w-full bg-slate-600/50 rounded mt-1"></div>
                <div className="h-1.5 w-5/6 bg-slate-700/50 rounded"></div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-24 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          </div>
        </div>
      );
    }

    if (type.includes("inline images")) {
      return (
        <div className="space-y-3">
          <div className="h-3 w-full bg-slate-700/50 rounded-md"></div>
          <div className="h-3 w-4/5 bg-slate-700/50 rounded-md"></div>
          <div className="w-full h-16 bg-slate-800 rounded-lg border border-slate-700/50"></div>
          <div className="h-3 w-full bg-slate-700/50 rounded-md"></div>
          <div className="h-3 w-3/4 bg-slate-700/50 rounded-md"></div>
          <div className="w-full h-16 bg-slate-800 rounded-lg border border-slate-700/50"></div>
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-24 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          </div>
        </div>
      );
    }

    if (type.includes("branded")) {
      return (
        <div className="space-y-3">
          <div className="h-8 w-full bg-indigo-500/10 rounded-lg border border-indigo-500/20 flex items-center px-3">
            <div className="w-4 h-4 rounded-full bg-indigo-400/50"></div>
            <div className="ml-2 h-2 w-12 bg-indigo-400/50 rounded"></div>
          </div>
          <div className="h-3 w-full bg-slate-700/50 rounded-md"></div>
          <div className="h-3 w-11/12 bg-slate-700/50 rounded-md"></div>
          <div className="h-3 w-4/5 bg-slate-700/50 rounded-md"></div>
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-full bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          </div>
        </div>
      );
    }

    if (type.includes("hero image") || type.includes("image")) {
      return (
        <div className="space-y-3">
          <div className="w-full h-24 bg-slate-800 rounded-xl border border-slate-700/50"></div>
          <div className="h-3 w-full bg-slate-700/50 rounded-md mt-3"></div>
          <div className="h-3 w-5/6 bg-slate-700/50 rounded-md"></div>
          <div className="h-3 w-3/4 bg-slate-700/50 rounded-md"></div>
          <div className="mt-4 flex justify-center">
            <div className="h-6 w-24 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          </div>
        </div>
      );
    }

    // Default: Text only
    return (
      <div className="space-y-3">
        <div className="h-3 w-full bg-slate-700/50 rounded-md"></div>
        <div className="h-3 w-11/12 bg-slate-700/50 rounded-md"></div>
        <div className="h-3 w-full bg-slate-700/50 rounded-md"></div>
        <div className="h-3 w-4/5 bg-slate-700/50 rounded-md"></div>
        <div className="mt-6 flex justify-center">
          <div className="h-6 w-24 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-[#09090b] border border-slate-800 rounded-t-2xl shadow-inner flex flex-col p-4 overflow-hidden ${className}`}>
      {/* Email Header Mock */}
      <div className="h-1 w-full bg-indigo-500 rounded-full mb-4"></div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700"></div>
        <div className="h-2.5 w-16 bg-slate-800 rounded"></div>
      </div>
      
      {/* Email Body Mock */}
      <div className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <div className="h-4 w-3/4 bg-slate-600/80 rounded-md"></div>
        </div>
        
        {renderContent()}
      </div>

      {/* Email Footer Mock */}
      <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col items-center gap-1.5 opacity-50">
        <div className="h-1.5 w-24 bg-slate-700 rounded"></div>
        <div className="h-1.5 w-16 bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}
