"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function UserDashboard() {

  const { data: session } = useSession();   // ← hook must be here

  const [complaints, setComplaints] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadComplaints() {
    const res = await fetch("/api/complaints");
    const data = await res.json();
    setComplaints(data);
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function submitComplaint(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("User session not available");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          userId: session.user.id
        })
      });

      if (!res.ok) throw new Error("Request failed");

      toast.success("Complaint submitted!");

      setTitle("");
      setDescription("");
      setShowForm(false);

      loadComplaints();

    } catch (err) {
      toast.error("Submission failed");
      console.error(err);
    }

    setLoading(false);
  }

  const stats = [
    {
      label: "Total Complaints",
      value: complaints.length,
      color: "bg-blue-500",
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "RESOLVED").length,
      color: "bg-green-500",
    },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status !== "RESOLVED").length,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="p-8">

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="opacity-90 mb-6">Track and manage your complaints</p>

        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
        >
          New Complaint +
        </button>
      </div>

      {/* Complaint Form */}
      {showForm && (
        <form
          onSubmit={submitComplaint}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-black"
        >
          <h2 className="text-xl font-bold mb-4">File a Complaint</h2>

          <input
            type="text"
            placeholder="Complaint title"
            className="w-full border p-3 rounded-lg mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Describe your issue"
            className="w-full border p-3 rounded-lg mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex gap-3">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              disabled={loading}>

              {loading ? "Submitting..." : "Submit"}

            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg opacity-20`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Your Complaints Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Your Complaints
        </h2>

        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No complaints yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              File a Complaint
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {complaint.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    Filed on {new Date(complaint.createdAt).toLocaleDateString()}
                    Assigned To : {complaint.department?.name || "N/A"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${complaint.status === "OPEN"
                    ? "bg-yellow-100 text-yellow-700"
                    : complaint.status === "RESOLVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {complaint.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}