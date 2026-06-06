"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Zod validation schemas
const step1Schema = z.object({
  brandName: z.string().min(2, "Product name must be at least 2 characters."),
});

const step2Schema = z.object({
  productDescription: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be under 500 characters."),
});

const onboardingSchema = z.object({
  brandName: z.string().min(2, "Product name must be at least 2 characters."),
  productDescription: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be under 500 characters."),
  primaryColor: z.string().regex(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid color format. Use hex (e.g. #6366f1)"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<OnboardingData>({
    brandName: "",
    productDescription: "",
    primaryColor: "#6366f1",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    setValidationError(null);
    setErrorMsg(null);

    if (step === 1) {
      const result = step1Schema.safeParse({ brandName: formData.brandName });
      if (!result.success) {
        setValidationError(result.error.issues[0].message);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const result = step2Schema.safeParse({
        productDescription: formData.productDescription,
      });
      if (!result.success) {
        setValidationError(result.error.issues[0].message);
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setErrorMsg(null);
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Prevent submission if not on step 3
    if (step !== 3) {
      handleNextStep();
      return;
    }

    setValidationError(null);
    setErrorMsg(null);

    // Format color before validation
    const formattedData = { ...formData };
    if (!formattedData.primaryColor.startsWith("#")) {
      formattedData.primaryColor = `#${formattedData.primaryColor}`;
    }

    // Validate all fields
    const validationResult = onboardingSchema.safeParse(formattedData);
    if (!validationResult.success) {
      setValidationError(validationResult.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Force refreshing the router to update middleware redirects
      router.refresh();
      router.push("/templates");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
      setIsSubmitting(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, primaryColor: val });
  };

  const descRemainingChars = 500 - formData.productDescription.length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl z-10">
        
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    step === num
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-600/20"
                      : step > num
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {step > num ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    num
                  )}
                </div>
                <span
                  className={`ml-2 text-xs font-medium hidden sm:inline ${
                    step === num ? "text-white" : "text-slate-500"
                  }`}
                >
                  {num === 1 ? "Brand" : num === 2 ? "Product" : "Color"}
                </span>
              </div>
              {num < 3 && (
                <div
                  className={`flex-grow h-[2px] mx-4 transition-colors duration-300 ${
                    step > num ? "bg-emerald-600" : "bg-slate-800"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {step === 1 && "Let's start with your brand"}
            {step === 2 && "Describe your product"}
            {step === 3 && "Pick your brand style"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {step === 1 && "Give your workspace a recognizable name."}
            {step === 2 && "This description helps customize templates and copy."}
            {step === 3 && "Define the signature color of your workspace assets."}
          </p>
        </div>

        {/* Error States */}
        {(validationError || errorMsg) && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{validationError || errorMsg}</span>
          </div>
        )}

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1 Form Fields */}
          {step === 1 && (
            <div className="space-y-2">
              <label htmlFor="brandName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                What is your product called?
              </label>
              <input
                id="brandName"
                type="text"
                autoFocus
                placeholder="e.g. Notion, Stripe, Figma"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNextStep();
                  }
                }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          {/* Step 2 Form Fields */}
          {step === 2 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="productDescription" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Describe your product in 2-3 sentences
                </label>
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${descRemainingChars < 50 ? "text-rose-400" : "text-slate-500"}`}>
                  {descRemainingChars} left
                </span>
              </div>
              <textarea
                id="productDescription"
                autoFocus
                rows={4}
                placeholder="e.g. We help freelancers manage invoices and clients in one place"
                value={formData.productDescription}
                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
          )}

          {/* Step 3 Form Fields */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="primaryColor" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pick your primary brand color
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-800/80 cursor-pointer flex items-center justify-center bg-slate-950 shrink-0">
                    <input
                      id="primaryColorPicker"
                      type="color"
                      value={formData.primaryColor.startsWith("#") ? formData.primaryColor.slice(0, 7) : "#000000"}
                      onChange={handleColorChange}
                      className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer border-none p-0"
                    />
                  </div>
                  <input
                    id="primaryColorText"
                    type="text"
                    value={formData.primaryColor}
                    onChange={handleColorChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="#6366f1"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Sample Element Preview */}
              <div className="p-6 bg-slate-950/40 border border-slate-800/50 rounded-xl space-y-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Button Preview
                </span>
                <button
                  type="button"
                  style={{ backgroundColor: formData.primaryColor.startsWith("#") ? formData.primaryColor : `#${formData.primaryColor}` }}
                  className="px-6 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-black/10 hover:brightness-110 active:brightness-95 transition-all text-sm"
                >
                  Send Newsletter
                </button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-sm transition-all disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Complete Setup</span>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
