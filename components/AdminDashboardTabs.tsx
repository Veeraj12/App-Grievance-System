"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AdminDashboardTabs({ users, performanceData }: any) {
  const [activeTab, setActiveTab] = useState("users");
  const [queueEnabled, setQueueEnabled] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])

  useEffect(() => {
  fetch("/api/admin/departments")
    .then(res => res.json())
    .then(data => setDepartments(data))
}, [])
  
  async function handleDepartmentChange(userId: number, departmentId: string) {

  const res = await fetch("/api/admin/users/department", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      departmentId
    })
  });

  if (res.ok) {
    toast.success("Department assigned");
    window.location.reload();
  }
}

  async function toggleQueue() {

    const res = await fetch("/api/admin/queue", {
      method: "POST"
    })

    const data = await res.json()

    setQueueEnabled(data.useQueue)

    toast.success(
      data.useQueue
        ? "Redis Queue Enabled"
        : "Direct Processing Enabled"
    )
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      if (!res.ok) {
        toast("Failed to update role");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-4 border-b">

        <h3 className="font-semibold mb-2">Processing Mode</h3>

        <button
          onClick={toggleQueue}
          className={`px-4 py-2 rounded-lg text-white ${queueEnabled ? "bg-green-600" : "bg-gray-600"
            }`}
        >

          {queueEnabled ? "Queue Enabled" : "Direct Mode"}

        </button>

      </div>
      {/* NAVBAR (Tabs) */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-4 text-sm font-medium transition ${activeTab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
        >
          View Users
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={`px-6 py-4 text-sm font-medium transition ${activeTab === "performance" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
        >
          View Performance
        </button>
      </div>

      <div className="p-6">
        {activeTab === "users" ? (
          /* VIEW USERS TAB */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-4 font-semibold">User</th>
                  <th className="pb-4 font-semibold">Email</th>
                  <th className="pb-4 font-semibold">Department</th>
                  <th className="pb-4 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 font-medium">{user.name}</td>
                    <td className="py-4">{user.email}</td>
                    <td className="py-4">
                      <select
                        value={user.departmentId || ""}
                        onChange={(e) => handleDepartmentChange(user.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="">None</option>

                        {departments.map((d:any)=>(
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}

                      </select>
                    </td>
                    <td className="py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                      >
                        <option value="USER">USER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* VIEW PERFORMANCE TAB */
          <div className="h-80 w-full mt-4">
            <h3 className="text-lg font-semibold mb-6">Complaints Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}