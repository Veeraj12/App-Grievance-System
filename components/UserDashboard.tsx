"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  FileText, CheckCircle, Clock, PlusCircle, X, Send,
  ShieldCheck, ImagePlus, Trash2, ChevronRight,
  Calendar, Hash, Inbox, Loader2, AlertCircle
} from "lucide-react";

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-400" />
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 border border-red-500/20">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Delete Complaint</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to delete this complaint? This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all">
              Yes, Delete
            </button>
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const statusConfig: Record<string, { label: string; badge: string; dot: string; }> = {
  OPEN: {
    label: "Open",
    badge: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    dot: "bg-orange-400",
  },
  ASSIGNED: {
    label: "Assigned",
    badge: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badge: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    dot: "bg-amber-400",
  },
  RESOLVED: {
    label: "Resolved",
    badge: "bg-green-500/15 text-green-300 border border-green-500/30",
    dot: "bg-green-400",
  },
};

function ProgressSteps({ status }: { status: string }) {
  const steps = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];
  const idx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`h-1.5 w-6 rounded-full transition-colors ${i <= idx ? "bg-indigo-500" : "bg-white/10"}`} />
        </div>
      ))}
      <span className="text-[10px] text-slate-500 ml-1 font-medium">
        {idx + 1}/4
      </span>
    </div>
  );
}

export default function UserDashboard() {
  const { data: session } = useSession();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function loadComplaints() {
    setFetching(true);
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      console.log("API response:", data)
      setComplaints(data);
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => { loadComplaints(); }, []);

  async function submitComplaint(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) { toast.error("Session unavailable"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, userId: session.user.id, imageUrl: imageBase64 }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setTimeout(() => {
        setTitle(""); setDescription("");
        setImageBase64(null); setImagePreview(null);
        setShowForm(false); setSubmitted(false);
        loadComplaints();
      }, 1800);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
    setLoading(false);
  }

  async function handleDeleteComplaint(id: number) {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Complaint deleted");
      setComplaints(prev => prev.filter(c => c.id !== id));
    } catch {
      toast.error("Failed to delete complaint");
    } finally {
      setDeletingId(null);
    }
  }

  const stats = [
    {
      label: "Total Filed",
      value: complaints.length,
      icon: FileText,
      color: "bg-blue-600",
      border: "border-l-blue-500",
    },
    {
      label: "Resolved",
      value: complaints.filter(c => c.status === "RESOLVED").length,
      icon: CheckCircle,
      color: "bg-green-600",
      border: "border-l-green-500",
    },
    {
      label: "Pending",
      value: complaints.filter(c => c.status !== "RESOLVED").length,
      icon: Clock,
      color: "bg-orange-500",
      border: "border-l-orange-500",
    },
  ];
  const ticketsTobeResolved = complaints.filter(t => t.status === "ASSIGNED" || t.status === "IN_PROGRESS" || t.status === "OPEN")

  return (
    <>
      <ConfirmDialog
        open={confirmDeleteId !== null}
        onConfirm={() => confirmDeleteId !== null && handleDeleteComplaint(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <div className="space-y-6">
        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-1 h-7 rounded-full bg-violet-400 block" />
              <h1 className="text-2xl font-bold text-white tracking-tight">My Dashboard</h1>
            </div>
            <p className="text-sm text-slate-400 pl-4">
              Welcome back, <span className="font-semibold text-slate-200">{session?.user?.name || "Citizen"}</span>
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-[0_0_15px_rgba(99,60,255,0.3)] hover:shadow-[0_0_20px_rgba(99,60,255,0.45)] active:scale-95"
          >
            <PlusCircle size={16} />
            File New Complaint
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 border-l-4 ${stat.border} p-5 hover:bg-white/[0.08] transition-all`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <Icon size={17} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* ── Info banner ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-5 py-4">
          <ShieldCheck size={20} className="text-indigo-400 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-indigo-300">Your privacy is protected.</span>
            <span className="text-slate-400"> Complaints are handled confidentially by the relevant department.</span>
          </div>
        </div>

        {/* ── Complaints List ── */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={17} className="text-violet-400" />
              <h2 className="font-bold text-white">Your Complaints</h2>
              {ticketsTobeResolved.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/10 text-slate-300 text-xs font-bold rounded-full">
                  {ticketsTobeResolved.length}
                </span>
              )}
            </div>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={20} className="animate-spin text-indigo-400" />
              <p className="text-sm text-slate-400">Loading your complaints...</p>
            </div>
          ) : ticketsTobeResolved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
                <Inbox size={28} className="text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-300">No complaints yet</p>
                <p className="text-sm text-slate-500 mt-0.5">File a complaint to get started</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
              >
                <PlusCircle size={15} /> File First Complaint
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {ticketsTobeResolved.map(c => {
                const sc = statusConfig[c.status] || statusConfig.OPEN;
                return (
                  <li key={c.id} className="px-5 py-4 hover:bg-white/[0.03] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-white text-sm">{c.title}</p>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash size={11} />
                            {c.id.toString().padStart(4, "0")}
                          </span>
                          <span className="text-indigo-400 font-medium">
                            {c.departmentName || "Municipal"} Dept
                          </span>
                        </div>
                        <ProgressSteps status={c.status} />
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setConfirmDeleteId(c.id)}
                          disabled={deletingId === c.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-50"
                        >
                          {deletingId === c.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Modal ── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full sm:max-w-lg bg-[#0d1117] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div>
                  <h2 className="font-bold text-white">File a Complaint</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Your complaint will be reviewed by the relevant department</p>
                </div>
                <button onClick={() => { setShowForm(false); setSubmitted(false); }} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Complaint Submitted!</h3>
                    <p className="text-sm text-slate-400 mt-1">Your complaint has been received and will be assigned shortly.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 size={12} className="animate-spin" />
                    Redirecting...
                  </div>
                </div>
              ) : (
                <form onSubmit={submitComplaint} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Brief title of the issue"
                      className="w-full border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 bg-white/5 transition-all"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={100}
                    />
                    <p className="text-[10px] text-slate-500 mt-1 text-right">{title.length}/100</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe the issue in detail, including location and timing if relevant..."
                      className="w-full border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 bg-white/5 transition-all resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      maxLength={500}
                    />
                    <p className="text-[10px] text-slate-500 mt-1 text-right">{description.length}/500</p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Attach Evidence <span className="text-slate-500 font-normal">(optional · max 5MB)</span>
                    </label>
                    {imagePreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/10">
                        <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-cover" />
                        <button
                          type="button"
                          onClick={() => { setImageBase64(null); setImagePreview(null); }}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-300 transition-all border border-white/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 px-4 py-4 border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-xl cursor-pointer transition-colors text-slate-500 hover:text-indigo-400 bg-white/5 hover:bg-indigo-500/5">
                        <ImagePlus size={20} />
                        <span className="text-sm font-medium">Click to upload a photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all text-sm shadow-sm active:scale-[0.99]"
                    >
                      {loading ? (
                        <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                      ) : (
                        <><Send size={15} /> Submit Complaint</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}