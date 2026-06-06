"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TEMPLATES, Template } from "@/lib/templates";

const GOALS = [
  "Onboarding",
  "Trial conversion",
  "Win-back",
  "Feature launch",
  "Sales outreach",
  "Newsletter",
];

const CONTENT_TYPES = [
  "Text",
  "Text + Hero Image",
  "Text + Screenshot",
  "Feature grid",
  "Social proof",
  "Video thumbnail",
  "Branded",
  "Text + Inline Images"
];

function GenerateSequenceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") || searchParams.get("template");
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    sequenceName: "",
    productDescription: "",
    goal: "",
    sequenceLength: 7,
    tone: "professional",
    layoutStyle: "Minimal",
    emails: [] as { dayOffset: number; purpose: string; contentType: string; enabled: boolean }[],
  });
  
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        setTemplate(null);
        return;
      }

      // 1. Try static templates first
      const staticTemplate = TEMPLATES.find(t => t.id === templateId);
      if (staticTemplate) {
        setTemplate(staticTemplate);
        return;
      }

      // 2. Try fetching user template
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("user_templates")
            .select("template_data")
            .eq("id", templateId)
            .eq("user_id", user.id)
            .maybeSingle();

          if (data) {
            setTemplate({
              id: templateId,
              ...data.template_data
            } as Template);
          }
        }
      } catch (err) {
        console.error("Failed to load custom template", err);
      }
    };

    loadTemplate();
  }, [templateId]);

  useEffect(() => {
    // If a template is loaded, initialize wizard data with template defaults
    if (template) {
      setWizardData(prev => ({
        ...prev,
        goal: template.goal,
        sequenceLength: template.emailCount,
        tone: template.tone.toLowerCase(),
        layoutStyle: template.layoutStyle,
        sequenceName: template.name,
        emails: template.emails.map(e => ({ ...e, enabled: true }))
      }));
      // Jump to step 2 if on step 1
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    } else {
      // Start from scratch defaults
      if (wizardData.emails.length === 0) {
        setWizardData(prev => ({
          ...prev,
          emails: [
            { dayOffset: 0, purpose: "Welcome", contentType: "Text", enabled: true },
            { dayOffset: 3, purpose: "Feature 1", contentType: "Text", enabled: true },
            { dayOffset: 7, purpose: "Check-in", contentType: "Text", enabled: true },
          ]
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]); // Only re-run if template state changes

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
          setWizardData((prev) => ({
            ...prev,
            productDescription: workspace.product_description || "",
            sequenceName: prev.sequenceName || (workspace.brand_name
              ? `${workspace.brand_name} Sequence`
              : ""),
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

  const handleResetToTemplate = () => {
    if (template) {
      setWizardData(prev => ({
        ...prev,
        emails: template.emails.map(e => ({ ...e, enabled: true }))
      }));
    }
  };

  const clearTemplate = () => {
    router.push("/generate"); // removes template param
    setCurrentStep(1);
    setWizardData(prev => ({
      ...prev,
      goal: "",
      emails: [
        { dayOffset: 0, purpose: "Welcome", contentType: "Text", enabled: true },
        { dayOffset: 3, purpose: "Feature 1", contentType: "Text", enabled: true },
        { dayOffset: 7, purpose: "Check-in", contentType: "Text", enabled: true },
      ]
    }));
  };

  const handleToggleEmail = (index: number) => {
    const newEmails = [...wizardData.emails];
    newEmails[index].enabled = !newEmails[index].enabled;
    setWizardData({ ...wizardData, emails: newEmails });
  };

  const handleEmailChange = (index: number, field: string, value: string | number) => {
    const newEmails = [...wizardData.emails];
    newEmails[index] = { ...newEmails[index], [field]: value };
    setWizardData({ ...wizardData, emails: newEmails });
  };

  const handleAddCustomSlot = () => {
    const lastDay = wizardData.emails.length > 0 ? wizardData.emails[wizardData.emails.length - 1].dayOffset : 0;
    setWizardData({
      ...wizardData,
      emails: [
        ...wizardData.emails,
        { dayOffset: lastDay + 3, purpose: "Custom Email", contentType: "Text", enabled: true }
      ]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardData.sequenceName || !wizardData.productDescription) return;

    setIsGenerating(true);
    setErrorMsg(null);

    const payload = {
      ...wizardData,
      templateId: template?.id,
      emails: wizardData.emails.filter(e => e.enabled)
    };

    try {
      const res = await fetch("/api/generate-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  if (isLoadingWorkspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm text-neutral-400 font-medium">Loading workspace...</span>
        </div>
      </div>
    );
  }

  const enabledEmails = wizardData.emails.filter(e => e.enabled);

  return (
    <div className="min-h-screen bg-transparent px-4 sm:px-6 py-8 md:p-12 text-white font-sans relative">
      {/* Generation Loading State Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="text-center space-y-6 max-w-sm px-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Generating your sequence...</h3>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                Writing {enabledEmails.length} conversion-optimized emails matching your brand&apos;s voice.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Template Banner */}
        {template && (
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-100">Using template: {template.name}</p>
                <p className="text-xs text-indigo-300">Your configuration is pre-filled. Feel free to customize.</p>
              </div>
            </div>
            <button 
              onClick={clearTemplate}
              className="p-2 text-indigo-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Clear template and start from scratch"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <header className="border-b border-white/10 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Generate Sequence
            </h1>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep === step ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]" : 
                    currentStep > step ? "bg-indigo-600/30 text-indigo-200" : "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-px mx-2 ${currentStep > step ? "bg-indigo-500/50" : "bg-slate-800"}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-start gap-3 mt-4">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}
        </header>

        {/* Step 1: Goal Picker */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-medium text-white mb-2">What is the goal of this sequence?</h2>
              <p className="text-sm text-neutral-400">Select the primary objective to help the AI structure the emails.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => {
                    setWizardData({ ...wizardData, goal });
                    setCurrentStep(2);
                  }}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    wizardData.goal === goal 
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                      : "bg-slate-900/80 backdrop-blur-sm border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-indigo-500/30"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">{goal}</h3>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-6">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!wizardData.goal}
                className="px-6 py-2.5 rounded-lg bg-white text-black font-medium text-sm hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Sequence Builder */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Build your sequence</h2>
                <p className="text-sm text-neutral-400">Add, remove, or customize the emails in your timeline.</p>
              </div>
              {template && (
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    Pre-filled from template — edit freely
                  </span>
                  <button onClick={handleResetToTemplate} className="text-xs text-neutral-500 hover:text-white underline">
                    Reset to template defaults
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              {wizardData.emails.map((email, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${email.enabled ? "bg-[#0A0A0A]/50 border-slate-700" : "bg-transparent border-transparent opacity-50"}`}>
                  <button onClick={() => handleToggleEmail(idx)} className="text-neutral-400 hover:text-white transition-colors">
                    {email.enabled ? (
                      <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" opacity="0.2" /><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" /></svg>
                    )}
                  </button>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-400">Day</span>
                      <input 
                        type="number" 
                        value={email.dayOffset}
                        onChange={(e) => handleEmailChange(idx, "dayOffset", parseInt(e.target.value) || 0)}
                        className="w-16 bg-transparent border-b border-white/20 text-white focus:border-white focus:outline-none text-center"
                        disabled={!email.enabled}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input 
                        type="text" 
                        value={email.purpose}
                        onChange={(e) => handleEmailChange(idx, "purpose", e.target.value)}
                        placeholder="e.g. Welcome & Setup"
                        className="w-full bg-transparent border-b border-white/20 text-white focus:border-white focus:outline-none placeholder-neutral-600"
                        disabled={!email.enabled}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={handleAddCustomSlot}
                className="w-full py-4 border-2 border-dashed border-white/10 hover:border-white/30 rounded-lg text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Email Slot
              </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              {!template && (
                <button onClick={() => setCurrentStep(1)} className="px-5 py-2.5 rounded-lg border border-white/10 text-neutral-300 font-medium text-sm hover:bg-white/5 transition-colors">
                  Back
                </button>
              )}
              {template && <div></div>}
              <button
                onClick={() => setCurrentStep(3)}
                disabled={wizardData.emails.filter(e => e.enabled).length === 0}
                className="px-6 py-2.5 rounded-lg bg-white text-black font-medium text-sm hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Content Type Picker */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Design your layout</h2>
                <p className="text-sm text-neutral-400">Choose the format for each email in your sequence.</p>
              </div>
              {template && (
                <button onClick={handleResetToTemplate} className="text-xs text-neutral-500 hover:text-white underline mt-1">
                  Reset to template defaults
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {enabledEmails.map((email) => {
                  const originalIndex = wizardData.emails.findIndex(e => e === email);
                  const isActive = activePreviewIndex === originalIndex;
                  return (
                    <div 
                      key={originalIndex} 
                      onClick={() => setActivePreviewIndex(originalIndex)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isActive ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-slate-900/80 backdrop-blur-sm border-slate-800 hover:border-indigo-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-white/10 text-neutral-400"}`}>
                            Day {email.dayOffset}
                          </span>
                          <span className="text-sm font-medium text-white truncate max-w-[120px]">{email.purpose}</span>
                        </div>
                      </div>
                      <select
                        value={email.contentType}
                        onChange={(e) => handleEmailChange(originalIndex, "contentType", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                      >
                        {CONTENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-3 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                {wizardData.emails[activePreviewIndex] ? (
                  <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="h-1.5 w-full bg-indigo-500"></div>
                    <div className="p-6 pb-0 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                      <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="h-6 w-3/4 bg-neutral-300 rounded-md mb-6"></div>
                      {renderWireframeContent(wizardData.emails[activePreviewIndex].contentType)}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">Select an email to preview wireframe</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button onClick={() => setCurrentStep(2)} className="px-5 py-2.5 rounded-lg border border-white/10 text-neutral-300 font-medium text-sm hover:bg-white/5 transition-colors">
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-lg bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Details & Generate */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-medium text-white mb-2">Final Details</h2>
              <p className="text-sm text-neutral-400">Provide the context AI needs to write the copy.</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="sequenceName" className="block text-sm font-medium text-neutral-300">
                  Sequence Name
                </label>
                <input
                  id="sequenceName"
                  type="text"
                  required
                  placeholder="e.g. Onboarding Sequence"
                  value={wizardData.sequenceName}
                  onChange={(e) => setWizardData({ ...wizardData, sequenceName: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="productDescription" className="block text-sm font-medium text-neutral-300">
                  Product Details & Call to Action
                </label>
                <textarea
                  id="productDescription"
                  required
                  rows={5}
                  placeholder="Describe your product value and what this sequence should achieve..."
                  value={wizardData.productDescription}
                  onChange={(e) => setWizardData({ ...wizardData, productDescription: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-300">
                  Writing Tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(["professional", "friendly", "casual", "persuasive", "helpful", "direct"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWizardData({ ...wizardData, tone: t })}
                      className={`py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                        wizardData.tone === t
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button type="button" onClick={() => setCurrentStep(3)} className="px-5 py-2.5 rounded-lg border border-white/10 text-neutral-300 font-medium text-sm hover:bg-white/5 transition-colors">
                Back
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Generate Sequence</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function GenerateSequencePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin h-6 w-6 border-2 border-white/20 border-t-white rounded-full"></div>
      </div>
    }>
      <GenerateSequenceContent />
    </Suspense>
  );
}
