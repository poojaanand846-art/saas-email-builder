"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TEMPLATES, Template } from "@/lib/templates";
import { TemplatePreviewModal } from "@/components/TemplatePreviewModal";
import { TemplateThumbnail } from "@/components/TemplateThumbnail";
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
      <header className="space-y-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Start from a template
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Pick a template, customise it to your brand, and generate in seconds
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Start from scratch card */}
          {activeFilter === "All" && (
            <Link
              href="/generate"
              className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 border-dashed rounded-2xl p-5 flex flex-col hover:bg-slate-800/50 hover:border-indigo-500/50 hover:border-solid transition-all duration-300 group min-h-[300px] items-center justify-center text-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-slate-400 font-medium group-hover:text-white transition-colors">
                Create a blank Email
              </span>
            </Link>
          )}

          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setPreviewTemplate(template)}
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl flex flex-col hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
              {/* Thumbnail Container */}
              <div className="h-[240px] bg-[#0A0A0A] w-full overflow-hidden relative border-b border-slate-800/50 flex justify-center pt-6">
                <div className="w-[85%] h-[400px] pointer-events-none origin-top scale-[0.6] sm:scale-[0.65] lg:scale-[0.55] xl:scale-[0.65] absolute top-6 group-hover:-translate-y-2 transition-transform duration-500">
                  <TemplateThumbnail contentType={template.emails[0].contentType} />
                </div>
                {/* Overlay on hover for "Preview" */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Preview Template
                  </span>
                </div>
              </div>

              {/* Card Content Footer */}
              <div className="p-4 bg-slate-900/80 flex flex-col gap-1">
                <h3 className="font-medium text-white text-[15px] leading-tight truncate">
                  {template.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400 font-medium">{template.emailCount} emails</span>
                  <span className="text-xs text-slate-500">{template.layoutStyle}</span>
                </div>
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
