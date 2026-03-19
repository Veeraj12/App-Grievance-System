import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Users, ChevronRight, LayoutDashboard } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Tech Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse:60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[50rem] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-sans">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Smart Grievance System
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
          {!session ? (
            <>
              <Link 
                href="/login" 
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] flex items-center gap-2 border border-indigo-500/50"
              >
                Register <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <Link 
                href={`/dashboard/${session.user.role.toLowerCase()}`}
                className="px-5 py-2.5 text-sm font-medium text-indigo-300 hover:text-white flex items-center gap-2 transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 rounded-full border border-indigo-500/20"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <div className="w-px h-6 bg-white/10 hidden sm:block" />
              <div className="flex items-center scale-90 origin-right">
                <LogoutButton />
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 shadow-[0_0_10px_rgba(79,70,229,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next-Gen Issue Resolution
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 text-white text-center leading-tight">
          Resolve Issues{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
            Smarter &amp; Faster
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed text-center px-2">
          A revolutionary platform that modernizes how grievances are filed, tracked, and resolved. Utilizing smart workflows and real-time updates to ensure complete transparency.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
          {!session ? (
            <Link 
              href="/register" 
              className="px-8 py-4 w-full sm:w-auto text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link 
              href={`/dashboard/${session.user.role.toLowerCase()}`}
              className="px-8 py-4 w-full sm:w-auto text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          <Link 
            href="#about" 
            className="px-8 py-4 w-full sm:w-auto text-base font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all flex items-center justify-center backdrop-blur-sm"
          >
            How it works
          </Link>
        </div>
      </main>

      {/* About Us Section */}
      <section id="about" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">About the System</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg relative z-10">
            Our platform bridges the gap between citizens and authorities by providing an intuitive, transparent, and highly efficient grievance redressal mechanism.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 relative group overflow-hidden shadow-2xl shadow-black/50 hover:border-indigo-500/30 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/20"></div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Lightning Fast</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Submit your grievances in seconds. Our intelligent routing system instantly aligns your issue with the relevant department for immediate action.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 relative group overflow-hidden shadow-2xl shadow-black/50 hover:border-purple-500/30 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Secure & Transparent</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track the exact status of your complaint at any time. We ensure complete data security and an auditable trail of all actions taken by officials.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 relative group overflow-hidden shadow-2xl shadow-black/50 hover:border-blue-500/30 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Citizen Centric</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Built meticulously with the public in mind. The intuitive interface makes it simple for anyone to voice their concerns and contribute to society.
            </p>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/20 py-8 lg:py-12 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <p>© {new Date().getFullYear()} Smart Grievance System. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
