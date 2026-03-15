"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    async function handleLogin(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);

        const email = user.email;
        const password = user.password;

        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (res?.error) {
            console.error("Login failed:", res.error);
            setError(res.error || "Invalid credentials");
            setLoading(false);
            return;
        }

        // Wait a moment for the session to be updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const session = await getSession();

        if (session?.user?.role === "ADMIN") {
            router.push("/dashboard/admin");
        } else if (session?.user?.role === "STAFF") {
            router.push("/dashboard/staff");
        } else if (session?.user?.role === "USER") {
            router.push("/dashboard/user");
        } else {
            setError("Unable to determine user role");
            setLoading(false);
        }
    }   

    return (
        <div className="relative min-h-screen bg-[#030712] flex items-center justify-center p-4 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
            {/* Tech Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-[40rem] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Back to Home Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>

                {/* Login Card */}
                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Decorative Top Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4 border border-indigo-400/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input 
                                    type="email" 
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input 
                                    type="password" 
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full relative group mt-2"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors border border-indigo-500/50 disabled:bg-indigo-600/50 disabled:cursor-not-allowed">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <LogIn className="w-5 h-5" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{" "}
                            <Link href="/register" className="font-semibold text-white hover:text-indigo-400 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}