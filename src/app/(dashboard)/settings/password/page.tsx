"use client";

import { useState, useEffect } from "react";
export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/client";
import { KeyRound, Shield, AlertCircle, CheckCircle2, Loader2, MonitorSmartphone } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function PasswordSettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", score: 0 };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 1) return { label: "Weak", score };
    if (score === 2) return { label: "Fair", score };
    if (score === 3) return { label: "Strong", score };
    return { label: "Very strong", score };
  };

  const strength = getPasswordStrength(password);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (strength.score < 4) {
      showToast("Password must contain a letter, number, and special character", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      
      showToast("Password updated successfully", "success");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOutOthers = async () => {
    setIsSigningOutOthers(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;
      showToast("All other sessions revoked", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to sign out other sessions", "error");
    } finally {
      setIsSigningOutOthers(false);
    }
  };

  // Determine if user might be a magic link user 
  // (app_metadata.provider === 'email' usually applies to magic link and password, so we guess by a missing password flag or we just provide this logic for the UI)
  const isMagicLinkUser = user?.app_metadata?.provider === 'email' && user?.user_metadata?.has_password === false;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Security & Password</h2>
        <p className="text-slate-400">Manage your password and active sessions.</p>
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

      {isMagicLinkUser ? (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 mb-10 flex items-start gap-4">
          <Shield className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-medium mb-1">You use magic link — no password on your account</h3>
            <p className="text-sm text-slate-400">
              You are currently authenticating via secure magic links sent to your email. You do not need a password to access your account.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-10 pb-10 border-b border-slate-800">
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                placeholder="••••••••"
              />
              
              {/* Live Strength Bar */}
              {password && (
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`h-1.5 flex-1 rounded-full ${
                          strength.score >= level 
                            ? strength.score === 1 ? "bg-rose-500"
                            : strength.score === 2 ? "bg-amber-500"
                            : strength.score === 3 ? "bg-emerald-500"
                            : "bg-indigo-500"
                            : "bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.score === 1 ? "text-rose-500"
                    : strength.score === 2 ? "text-amber-500"
                    : strength.score === 3 ? "text-emerald-500"
                    : "text-indigo-500"
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving || !password || !confirmPassword || password !== confirmPassword || strength.score < 4}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all w-full sm:w-auto min-w-[180px]"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Update password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Sessions Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <MonitorSmartphone className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Current Session</h4>
                <p className="text-sm text-slate-400">
                  You are signed in on this device.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSignOutOthers}
              disabled={isSigningOutOthers}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isSigningOutOthers ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign out all other devices"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
