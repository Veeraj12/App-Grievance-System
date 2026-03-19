"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token. Please request a new link.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Password strength check
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Too short", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-green-500"];

  return (
    <div className="w-full max-w-[440px]">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
        Back to Sign In
      </Link>

      <div className="bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />

        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Set New Password</h1>
            <p className="text-sm text-slate-400 mt-1 text-center">Create a strong new password for your account</p>
          </div>

          {/* Success state */}
          {success && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={30} className="text-green-400" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Password Updated!</p>
                <p className="text-sm text-slate-400 mt-1">Redirecting you to sign in page in 3 seconds...</p>
              </div>
              <Link href="/login" className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                Sign In Now →
              </Link>
            </div>
          )}

          {/* Error state (no token) */}
          {!token && !success && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={17} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
              <Link href="/login" className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                Back to Login
              </Link>
            </div>
          )}

          {/* Form */}
          {token && !success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={17} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* New password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"
                    placeholder="Minimum 6 characters"
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-all ${strength >= s ? strengthColor[strength] : "bg-white/10"}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] mt-1 font-medium ${strength === 1 ? "text-red-400" : strength === 2 ? "text-amber-400" : "text-green-400"}`}>
                      {strengthLabel[strength]}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 text-sm border rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${confirm && confirm !== password ? "border-red-500/40 focus:ring-red-500/20" : "border-white/10 focus:ring-indigo-500/30 focus:border-indigo-400/50"}`}
                    placeholder="Re-enter your password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-[10px] text-red-400 mt-1 font-medium">Passwords do not match</p>
                )}
                {confirm && confirm === password && password.length >= 6 && (
                  <p className="text-[10px] text-green-400 mt-1 font-medium flex items-center gap-1">
                    <CheckCircle size={10} /> Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm active:scale-[0.99]"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-600 mt-5">
        Secure · Official Government Service · Your data is protected
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "linear-gradient(135deg, #030712 0%, #0d1117 40%, #111827 100%)" }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[30rem] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>
      {/* Gov top bar */}
      <div className="relative z-10 w-full bg-white/[0.03] text-slate-300 py-2.5 px-4 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="w-3 h-3 rounded-full bg-white/70" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">Government of India — Smart Grievance Portal</span>
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-slate-400 text-sm">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
