"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
  User, Mail, Lock, UserPlus, ArrowLeft,
  Loader2, CheckCircle, Eye, EyeOff, AlertCircle, ArrowRight
} from "lucide-react"

export default function RegisterPage() {
  const [user, setUser] = useState({ email: "", password: "", username: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  function getPasswordStrength(p: string) {
    if (p.length === 0) return null
    if (p.length < 6) return { label: "Too short", color: "bg-red-500", width: "w-1/4" }
    if (p.length < 8) return { label: "Weak", color: "bg-orange-500", width: "w-2/4" }
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Fair", color: "bg-yellow-500", width: "w-3/4" }
    return { label: "Strong", color: "bg-green-500", width: "w-full" }
  }

  const pwStrength = getPasswordStrength(user.password)

  const onSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError("")

    if (!user.username || !user.email || !user.password) {
      setError("Please fill in all fields")
      return
    }
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.username, email: user.email, password: user.password })
      })
      const data = await res.json()

      if (res.ok && data) {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 2500)
      } else {
        setError(data?.message || "Error creating account. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{background: 'linear-gradient(135deg, #030712 0%, #0d1117 40%, #111827 100%)'}}>
      {/* Subtle grid like landing page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[30rem] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>
      {/* Gov top bar */}
      <div className="relative z-10 w-full bg-white/[0.03] text-slate-300 py-2.5 px-4 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="w-3 h-3 rounded-full bg-white/70" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">Government of India — Smart Grievance Portal</span>
          </div>
          <span className="text-[10px] text-slate-600 hidden sm:block">Official Registration</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px]">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />

            <div className="px-8 py-8">
              {/* Success screen */}
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 gap-5 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Account Created!</h2>
                    <p className="text-sm text-slate-400 mt-2">
                      Welcome to the Smart Grievance Portal,{" "}
                      <span className="font-semibold text-slate-200">{user.username}</span>.
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Redirecting you to sign in…</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-indigo-400 font-semibold">
                    <Loader2 size={14} className="animate-spin" />
                    Taking you to login
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Citizen Registration</h1>
                    <p className="text-sm text-slate-400 mt-1 text-center">Create your official portal account</p>
                  </div>

                  {error && (
                    <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={17} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <form onSubmit={onSignup} className="space-y-5">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={user.username}
                          onChange={(e) => setUser({ ...user, username: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 text-sm border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"
                          placeholder="Rajesh Kumar"
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
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
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={user.password}
                          onChange={(e) => setUser({ ...user, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-3 text-sm border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all"
                          placeholder="Minimum 6 characters"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Password strength */}
                      {pwStrength && (
                        <div className="mt-2">
                          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${pwStrength.color} ${pwStrength.width}`} />
                          </div>
                          <p className={`text-[11px] mt-1 font-semibold ${
                            pwStrength.label === "Strong" ? "text-green-400" :
                            pwStrength.label === "Fair" ? "text-yellow-400" :
                            pwStrength.label === "Weak" ? "text-orange-400" : "text-red-400"
                          }`}>{pwStrength.label} password</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm shadow-sm active:scale-[0.99]"
                    >
                      {loading ? (
                        <><Loader2 size={16} className="animate-spin" /> Creating account...</>
                      ) : (
                        <><UserPlus size={16} /> Create Account</>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-white/10 text-center">
                    <p className="text-sm text-slate-400">
                      Already registered?{" "}
                      <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Sign in →
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-5">
            Secure · Official Government Service · Your data is protected
          </p>
        </div>
      </div>
    </div>
  )
}