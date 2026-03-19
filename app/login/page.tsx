"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, ArrowLeft, AlertCircle, Loader2, CheckCircle, Eye, EyeOff, KeyRound, X, ExternalLink } from "lucide-react";

// ─── Forgot Password Modal ────────────────────────────────────────────────────

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Please enter your email address"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      if (data.resetUrl) setResetUrl(data.resetUrl);
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <KeyRound size={16} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Reset Password</h3>
                <p className="text-xs text-slate-500">Enter your registered email</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
              <X size={16} />
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={26} className="text-green-400" />
              </div>
              {resetUrl ? (
                // DEV MODE: show clickable link directly in the UI
                <div className="w-full space-y-3">
                  <p className="font-bold text-white">Reset link generated!</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Click the button below to set your new password.
                    <span className="block mt-0.5 text-slate-600">(In production this is sent via email)</span>
                  </p>
                  <a
                    href={resetUrl}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                  >
                    <ExternalLink size={14} />
                    Set New Password →
                  </a>
                  <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all">
                    Cancel
                  </button>
                </div>
              ) : (
                // PRODUCTION: email was sent
                <div className="w-full space-y-3">
                  <p className="font-bold text-white">Check your email!</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A password reset link has been sent to <span className="text-indigo-300 font-semibold">{email}</span>.<br />
                    It will expire in 1 hour.
                  </p>
                  <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter the email address you registered with. We'll generate a secure reset link for you.
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white transition-all"
                >
                  {loading ? <><Loader2 size={13} className="animate-spin" /> Sending...</> : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const router = useRouter();

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    if (!user.email || !user.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", { email: user.email, password: user.password, redirect: false });

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    await new Promise(r => setTimeout(r, 500));
    const session = await getSession();

    if (session?.user?.role === "ADMIN") router.push("/dashboard/admin");
    else if (session?.user?.role === "STAFF") router.push("/dashboard/staff");
    else if (session?.user?.role === "USER") router.push("/dashboard/user");
    else { setError("Unable to determine user role"); setLoading(false); setSuccess(false); }
  }

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="min-h-screen flex flex-col font-sans" style={{background: 'linear-gradient(135deg, #030712 0%, #0d1117 40%, #111827 100%)'}}>
        {/* Subtle grid like landing page */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10" />
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[30rem] bg-indigo-500/10 blur-[120px] rounded-full" />
        </div>

        {/* ── Gov top bar ── */}
        <div className="relative z-10 w-full bg-white/[0.03] text-slate-300 py-2.5 px-4 shadow-sm border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="w-3 h-3 rounded-full bg-white/70" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">Government of India — Smart Grievance Portal</span>
            </div>
            <span className="text-[10px] text-slate-600 hidden sm:block">Official Use Only</span>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[440px]">
            {/* Back link */}
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>

            {/* Card */}
            <div className="bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />

              <div className="px-8 py-8">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Citizen Sign In</h1>
                  <p className="text-sm text-slate-400 mt-1 text-center">Access the Smart Grievance Portal</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={17} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Success */}
                {success && !error && (
                  <div className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <CheckCircle size={17} className="text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-300 font-medium">Login successful! Redirecting to your dashboard…</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 text-sm border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm shadow-sm active:scale-[0.99]"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                    ) : success ? (
                      <><CheckCircle size={16} /> Redirecting...</>
                    ) : (
                      <><LogIn size={16} /> Sign In to Portal</>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                  <p className="text-sm text-slate-400">
                    New citizen?{" "}
                    <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                      Create your account →
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-slate-600 mt-5">
              Secure · Official Government Service · Your data is protected
            </p>
          </div>
        </div>
      </div>
    </>
  );
}