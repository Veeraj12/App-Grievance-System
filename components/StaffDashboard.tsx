"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  ClipboardList, Clock, CheckCircle, Activity,
  ChevronDown, RefreshCw, Inbox,
  Calendar, Hash
} from "lucide-react"
import { useSession } from "next-auth/react"

const statusBadge: Record<string, string> = {
  ASSIGNED: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  IN_PROGRESS: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  RESOLVED: "bg-green-500/15 text-green-300 border border-green-500/30",
}

const statusDot: Record<string, string> = {
  ASSIGNED: "bg-blue-400",
  IN_PROGRESS: "bg-amber-400",
  RESOLVED: "bg-green-400",
}


function StatCard({ label, value, icon: Icon, colorClass, borderColor }: any) {
  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border-l-4 ${borderColor} border border-white/10 p-5 hover:bg-white/[0.08] transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <div className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center`}>
          <Icon size={17} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Complaints</p>
    </div>
  )
}

export default function StaffDashboard() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { data: session } = useSession();
  async function loadTickets(showRefresh = false) {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await fetch("/api/staff/complaints")
      const data = await res.json()
      setTickets(data)
    } catch (err) {
      toast.error("Failed to load complaints")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }


  useEffect(() => { loadTickets() }, [])

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)


  async function updateStatus(id: number, status: string) {
    const toastId = toast.loading("Updating status...")
    try {
      const res = await fetch("/api/staff/updateStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      })
      if (!res.ok) throw new Error()
      toast.success("Status updated", { id: toastId })
      loadTickets()

    } catch {
      toast.error("Failed to update", { id: toastId })
    }
  }

  const stats = [
    {
      label: "Assigned",
      value: tickets.filter(t => t.status === "ASSIGNED" && t.departmentName === session?.user.departmentName).length,
      icon: Clock,
      colorClass: "bg-blue-600",
      borderColor: "border-l-blue-500",
    },
    {
      label: "In Progress",
      value: tickets.filter(t => t.status === "IN_PROGRESS" && t.departmentName === session?.user.departmentName).length,
      icon: Activity,
      colorClass: "bg-amber-500",
      borderColor: "border-l-amber-500",
    },
    {
      label: "Resolved",
      value: tickets.filter(t => t.status === "RESOLVED" && t.departmentName === session?.user.departmentName).length,
      icon: CheckCircle,
      colorClass: "bg-green-600",
      borderColor: "border-l-green-500",
    },
  ]
  const ticketsTobeResolved = tickets.filter(t => (t.status === "ASSIGNED" || t.status === "IN_PROGRESS" || t.status === "OPEN") && t.departmentName === session?.user.departmentName)

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-1 h-7 rounded-full bg-teal-400 block" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Staff Dashboard</h1>
          </div>
          <p className="text-sm text-slate-400 pl-4">{session?.user.departmentName} Department</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Live
          </div>
          <button
            onClick={() => loadTickets(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Tickets ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={17} className="text-teal-400" />
            <h2 className="font-bold text-white">Assigned Complaints</h2>
            {ticketsTobeResolved.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white/10 text-slate-300 text-xs font-bold rounded-full">
                {ticketsTobeResolved.length}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading complaints...</p>
          </div>
        ) : ticketsTobeResolved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
              <Inbox size={28} className="text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-300">All Clear!</p>
              <p className="text-sm text-slate-500 mt-0.5">No complaints currently assigned to you.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {ticketsTobeResolved.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-5 hover:bg-white/[0.03] transition-colors group cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Left: content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-white text-base leading-tight">{ticket.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge[ticket.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[ticket.status]}`} />
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{ticket.description}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} />
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                        <Hash size={12} />
                        {ticket.id.toString().padStart(4, "0")}
                      </div>
                    </div>
                  </div>

                  {/* Right: select */}
                  <div className="flex-shrink-0 lg:w-48">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5">Update Status</label>
                    <div className="relative">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value)}
                        className="w-full appearance-none bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 rounded-lg pl-4 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400/50 cursor-pointer transition-all hover:bg-white/10"
                      >
                        <option value="ASSIGNED" className="bg-[#0d1117]">Assigned</option>
                        <option value="IN_PROGRESS" className="bg-[#0d1117]">In Progress</option>
                        <option value="RESOLVED" className="bg-[#0d1117]">Resolved</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {selectedTicket.title}
              </h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">

              {/* Image */}
              {selectedTicket.imageUrl && (
                <img
                  src={selectedTicket.imageUrl}
                  alt="Complaint"
                  className="w-full h-64 object-cover rounded-xl border border-white/10"
                />
              )}

              {/* Description */}
              <div>
                <p className="text-xs uppercase text-slate-500 font-bold mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <span>
                  📅{" "}
                  {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </span>
                <span>
                  🆔 #{selectedTicket.id.toString().padStart(4, "0")}
                </span>
                <span>
                  📌 {selectedTicket.status.replace("_", " ")}
                </span>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Update Status
                </label>

                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    updateStatus(selectedTicket.id, e.target.value)
                    setSelectedTicket({
                      ...selectedTicket,
                      status: e.target.value
                    })
                  }}
                  className="w-full bg-white/5 border border-white/10 text-sm text-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}