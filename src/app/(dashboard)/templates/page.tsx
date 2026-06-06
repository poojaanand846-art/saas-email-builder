"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TEMPLATES, Template } from "@/lib/templates";
import { TemplatePreviewModal } from "@/components/TemplatePreviewModal";
import { createClient } from "@/lib/supabase/client";

const FILTERS = [
  "All",
  "Onboarding",
  "Trial conversion",
  "Win-back",
  "Feature launch",
  "SaaS",
  "E-commerce",
  "Agency",
];

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchUserTemplates = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_templates")
        .select("id, template_data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        // Map user templates to match Template interface
        const parsed = data.map(row => ({
          id: row.id, // using row.id as the templateId
          ...row.template_data
        })) as Template[];
        setUserTemplates(parsed);
      }
    };
    fetchUserTemplates();
  }, []);

  const filteredTemplates = TEMPLATES.filter((template) =>
    activeFilter === "All" ? true : template.tags.includes(activeFilter)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Start from a template
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Pick a template, customise it to your brand, and generate in seconds
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-px">
          <div className="pb-2 border-b-2 border-white text-white font-medium text-sm">
            Templates
          </div>
          <Link
            href="/generate"
            className="pb-2 border-b-2 border-transparent text-neutral-500 hover:text-neutral-300 font-medium text-sm transition-colors"
          >
            Start from scratch
          </Link>
        </div>
      </header>

      {/* Filters (Horizontally Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-white text-indigo-950 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* User Templates */}
      {userTemplates.length > 0 && (
        <div className="space-y-6 pb-8 border-b border-white/10">
          <h2 className="text-xl font-bold text-white tracking-tight">My templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-5 flex flex-col hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all duration-200 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                    Private
                  </span>
                </div>
                <div className="flex flex-col flex-1 space-y-4 pt-2">
                  <h3 className="font-semibold text-white text-base leading-tight">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white">
                      Custom
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                      {template.emailCount} emails
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center overflow-x-auto scrollbar-hide py-1">
                      {template.emails.map((email, idx) => {
                        const colors = ["bg-indigo-500/10 text-indigo-400 border-indigo-500/20"];
                        const colorClass = colors[0];
                        return (
                          <div key={idx} className="flex items-center">
                            <span className={`text-[10px] font-bold whitespace-nowrap px-2.5 py-1 rounded-full border ${colorClass}`}>
                              Day {email.dayOffset}
                            </span>
                            {idx < template.emails.length - 1 && (
                              <span className="text-slate-600 mx-2 font-bold">·</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/5">
                  <button 
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-neutral-300 font-medium text-sm transition-all"
                  >
                    Preview
                  </button>
                  <Link
                    href={`/generate?template=${template.id}`}
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm text-center transition-all"
                  >
                    Use template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-xl">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 00-2 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1a2 2 0 00-2-2H2"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">No templates found</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Try selecting a different filter or start from scratch to build your
            own sequence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 flex flex-col hover:bg-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              <div className="flex flex-col flex-1 space-y-4 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-white text-base leading-tight">
                    {template.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white">
                    {template.goal}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                    {template.emailCount} emails
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {template.contentTypes.map((type) => (
                    <span
                      key={type}
                      className="text-xs text-neutral-400 border border-white/5 px-2 py-1 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 mt-auto">
                  <div className="flex items-center overflow-x-auto scrollbar-hide py-1">
                    {template.emails.map((email, idx) => {
                      const colors = [
                        "bg-blue-500/10 text-blue-400 border-blue-500/20",
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        "bg-purple-500/10 text-purple-400 border-purple-500/20",
                        "bg-pink-500/10 text-pink-400 border-pink-500/20",
                        "bg-orange-500/10 text-orange-400 border-orange-500/20",
                      ];
                      const colorClass = colors[idx % colors.length];

                      return (
                        <div key={idx} className="flex items-center">
                          <span
                            className={`text-[10px] font-bold whitespace-nowrap px-2.5 py-1 rounded-full border ${colorClass}`}
                          >
                            Day {email.dayOffset}
                          </span>
                          {idx < template.emails.length - 1 && (
                            <span className="text-slate-600 mx-2 font-bold">·</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/5">
                <button 
                  onClick={() => setPreviewTemplate(template)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-all"
                >
                  Preview
                </button>
                <Link
                  href={`/generate?template=${template.id}`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-medium text-sm text-center transition-colors border border-indigo-500/30 hover:border-indigo-500 shadow-lg shadow-indigo-500/10"
                >
                  Use template
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}
