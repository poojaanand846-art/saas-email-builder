"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Upload, CheckCircle2, AlertCircle, Loader2, Trash2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || fullName.length < 2 || fullName.length > 60) {
      showToast("Name must be between 2 and 60 characters.", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      showToast("Only PNG and JPG images are allowed.", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be smaller than 2MB.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setImageError(false);

    // Optimistically show the image immediately using a local blob URL
    // This prevents CDN propagation delays from causing a 404 and breaking the image!
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);

    try {
      // Simulate progress for UI feedback since native progress isn't available in standard fetch
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 100);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;
      
      setUploadProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
        
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

      // Update auth user metadata with new avatar URL via the server API 
      // This ensures the browser session cookie is updated immediately and persists on refresh!
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: cacheBustedUrl }),
      });
      
      if (!res.ok) throw new Error("Failed to update user profile");

      // We intentionally DO NOT update avatarUrl to publicUrl here, 
      // because the objectUrl is already perfectly loaded and won't 404!
      showToast("Avatar updated successfully", "success");
    } catch (err) {
      // Revert the avatar if upload failed
      setAvatarUrl(user.user_metadata?.avatar_url || null);
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !avatarUrl) return;
    setIsUploading(true);
    try {
      // Ignore blob URLs as they are local optimistic states
      if (!avatarUrl.startsWith("blob:")) {
        const parts = avatarUrl.split('/avatars/');
        if (parts.length === 2) {
          const filePathWithQuery = parts[1];
          const filePath = filePathWithQuery.split('?')[0];
          await supabase.storage.from("avatars").remove([filePath]);
        }
      }
      
      // Update via API to persist cookie
      await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: null }),
      });
      
      setAvatarUrl(null);
      showToast("Avatar removed successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to remove avatar", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
        <p className="text-slate-400">Manage your personal information and avatar.</p>
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

      {/* Avatar Section */}
      <div className="mb-10 pb-10 border-b border-slate-800">
        <h3 className="text-sm font-medium text-slate-300 mb-6">Your Avatar</h3>
        <div className="flex items-center gap-8">
          <div className="relative group overflow-hidden rounded-full w-24 h-24 shrink-0 border-4 border-slate-800">
            {!imageError && avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                {fullName ? fullName.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
              </div>
            )}
            
            {avatarUrl && !isUploading && (
              <button 
                onClick={handleRemoveAvatar}
                type="button"
                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
              >
                <Trash2 className="w-6 h-6 text-rose-400 mb-1" />
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Remove</span>
              </button>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-1" />
                {uploadProgress > 0 && <span className="text-[10px] font-bold text-white">{uploadProgress}%</span>}
              </div>
            )}
          </div>

          <div>
            {imageError && avatarUrl && (
              <a href={avatarUrl} target="_blank" rel="noreferrer" className="inline-block mb-3 px-3 py-1.5 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-md border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
                ⚠️ Click here to see exactly why your image failed to load
              </a>
            )}
            <div className="flex gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Upload photo
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Recommended: Square image, PNG or JPG.<br/>Max file size: 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={60}
            required
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white placeholder-slate-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full px-4 py-3 bg-[#0A0A0A]/50 border border-slate-800/50 rounded-xl outline-none text-slate-500 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-2">
            Your email address cannot be changed.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving || !fullName.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all w-full sm:w-auto min-w-[140px]"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
