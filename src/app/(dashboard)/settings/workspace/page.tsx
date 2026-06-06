"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle, Loader2, Upload, Trash2, Mail } from "lucide-react";

export default function WorkspaceSettingsPage() {
  const [brandName, setBrandName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadWorkspace() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (data) {
        setBrandName(data.brand_name || "");
        setProductDescription(data.product_description || "");
        setPrimaryColor(data.primary_color || "#6366f1");
        setLogoUrl(data.logo_url || null);
      }
    }
    loadWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (brandName.length < 2 || brandName.length > 60) {
      showToast("Brand name must be between 2 and 60 characters", "error");
      return;
    }
    if (productDescription.length < 20 || productDescription.length > 800) {
      showToast("Product description must be between 20 and 800 characters", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_name: brandName,
          product_description: productDescription,
          primary_color: primaryColor,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update workspace");
      
      showToast("Workspace settings saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
      showToast("Only PNG, JPG, and SVG are allowed", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Logo must be smaller than 2MB", "error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("/api/settings/workspace/logo", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload logo");
      
      setLogoUrl(data.logo_url);
      showToast("Logo uploaded successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const res = await fetch("/api/settings/workspace/logo", {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove logo");
      
      setLogoUrl(null);
      showToast("Logo removed successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-10 xl:gap-16">
      <div className="flex-1 max-w-2xl min-w-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Workspace & Brand</h2>
          <p className="text-slate-400">Configure how your brand appears across your emails.</p>
        </div>

        {toast && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
            toast.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        <form onSubmit={handleSaveWorkspace} className="space-y-8">
          {/* Logo Section */}
          <div className="pb-8 border-b border-slate-800">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Brand Logo</h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative group">
                {logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-xs text-slate-500 font-medium">No logo</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg, image/svg+xml"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload logo
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  PNG, JPG, or SVG up to 2MB. Transparent background recommended.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-slate-300 mb-2">
                Brand Name
              </label>
              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                minLength={2}
                maxLength={60}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white placeholder-slate-500"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="productDescription" className="block text-sm font-medium text-slate-300">
                  Product Description
                </label>
                <span className={`text-xs ${productDescription.length > 800 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {productDescription.length} / 800
                </span>
              </div>
              <textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
                minLength={20}
                maxLength={800}
                rows={5}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white placeholder-slate-500 resize-none"
                placeholder="Describe what your product does, your target audience, and your brand's tone of voice..."
              />
              <div className="text-xs text-indigo-400 mt-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">This is what Gemini uses to write your emails — be specific</span>
              </div>
            </div>

            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-slate-300 mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0 cursor-pointer">
                  <input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute -inset-2 w-16 h-16 cursor-pointer"
                  />
                </div>
                <div className="flex-1 max-w-[140px]">
                  <input
                    type="text"
                    value={primaryColor.toUpperCase()}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val) || val === "") {
                        setPrimaryColor(val);
                      }
                    }}
                    onBlur={() => {
                      if (!/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
                        setPrimaryColor("#6366f1"); // Reset to default if invalid
                      }
                    }}
                    maxLength={7}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white text-center font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving || brandName.length < 2 || productDescription.length < 20 || !/^#[0-9A-Fa-f]{6}$/.test(primaryColor)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all w-full sm:w-auto min-w-[140px]"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Live Brand Preview Panel */}
      <div className="xl:w-[380px] shrink-0 w-full max-w-md mx-auto xl:mx-0">
        <div className="sticky top-10 space-y-4">
          <h3 className="text-sm font-medium text-slate-400">How your emails will look</h3>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
            {/* Header / Email Client Mock */}
            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="flex-1 bg-white rounded-md py-1.5 px-3 text-xs text-slate-400 text-center border border-slate-200 truncate">
                From: hello@{brandName.toLowerCase().replace(/\s+/g, '') || 'brand'}.com
              </div>
            </div>
            
            {/* Email Body Mock */}
            <div className="p-8 bg-white min-h-[300px] flex flex-col items-center text-center">
              {/* Logo / Brand Mock */}
              {logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logoUrl} alt="Brand" className="h-12 mb-8 object-contain" />
              ) : (
                <div className="h-12 flex items-center justify-center mb-8">
                  <span className="text-xl font-bold text-slate-900">{brandName || "Your Brand"}</span>
                </div>
              )}
              
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${primaryColor}15` }}>
                <Mail className="w-8 h-8" style={{ color: primaryColor }} />
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                Welcome to {brandName || "Your Brand"}
              </h2>
              
              <p className="text-sm text-slate-600 mb-8 max-w-[240px] mx-auto leading-relaxed">
                {productDescription 
                  ? `${productDescription.slice(0, 80)}${productDescription.length > 80 ? '...' : ''}` 
                  : "We're thrilled to have you onboard. Let's get started by exploring your new dashboard."}
              </p>
              
              <button 
                className="w-full py-3 px-6 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 mt-auto"
                style={{ backgroundColor: primaryColor }}
              >
                Get Started
              </button>
            </div>
            
            {/* Footer Mock */}
            <div className="bg-slate-50 border-t border-slate-100 p-6 text-center">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} {brandName || "Your Brand"}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
