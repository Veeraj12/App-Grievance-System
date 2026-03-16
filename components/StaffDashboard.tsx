"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ClipboardList, Clock, CheckCircle, Activity, ChevronRight, AlertCircle } from "lucide-react"

export default function StaffDashboard() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function loadTickets() {
    setLoading(true)
    try {
      const res = await fetch("/api/staff/complaints")
      const data = await res.json()
      setTickets(data)
    } catch (err) {
      toast.error("Failed to load complaints")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch("/api/staff/updateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, status })
      })

      if (!res.ok) throw new Error("Failed to update status")

      toast.success("Status Updated")
      loadTickets()
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  const stats = [
    {
      label: "Assigned",
      value: tickets.filter(t => t.status === "ASSIGNED").length,
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/20"
    },
    {
      label: "In Progress",
      value: tickets.filter(t => t.status === "IN_PROGRESS").length,
      icon: Activity,
      color: "from-indigo-500 to-purple-500",
      glow: "shadow-indigo-500/20"
    },
    {
      label: "Resolved",
      value: tickets.filter(t => t.status === "RESOLVED").length,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/20"
    }
  ]

  const statusBadge: Record<string, string> = {
    ASSIGNED: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    IN_PROGRESS: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  }

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden text-slate-200 font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_115%)] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[30rem] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Staff Dashboard
              </h1>
              <p className="text-sm text-slate-500">Manage and resolve assigned grievances</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium shadow-[0_0_10px_rgba(79,70,229,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live Updates
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative rounded-3xl p-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] ${stat.glow}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium italic">Complaints</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complaints Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Assigned Complaints
            </h2>
            <button
              onClick={loadTickets}
              className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
            >
              Refresh
            </button>
          </div>

          <div className="p-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 animate-pulse">Fetching records...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-slate-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-slate-300">Clean Slate!</p>
                  <p className="text-sm text-slate-500">No complaints currently assigned to you.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="group relative bg-[#0d1117]/50 border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors">
                            {ticket.title}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusBadge[ticket.status]}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                          {ticket.description}
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            {new Date(ticket.createdAt).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-700" />
                          <div className="text-xs text-indigo-400 font-semibold tracking-wide uppercase">
                            Ticket ID: #{ticket.id.toString().padStart(4, '0')}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:w-max">
                        <div className="relative flex-1 sm:min-w-[160px]">
                          <select
                            value={ticket.status}
                            onChange={(e) => updateStatus(ticket.id, e.target.value)}
                            className="w-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer appearance-none transition-all hover:bg-indigo-500/20"
                          >
                            <option value="ASSIGNED" className="bg-[#030712] text-slate-200">ASSIGNED</option>
                            <option value="IN_PROGRESS" className="bg-[#030712] text-slate-200">IN PROGRESS</option>
                            <option value="RESOLVED" className="bg-[#030712] text-slate-200">RESOLVED</option>
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}