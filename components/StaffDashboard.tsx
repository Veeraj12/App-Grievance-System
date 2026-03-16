"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function StaffDashboard() {

  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function loadTickets() {

    setLoading(true)

    const res = await fetch("/api/staff/complaints")
    const data = await res.json()

    setTickets(data)
    setLoading(false)

  }

  useEffect(() => {
    loadTickets()
  }, [])

  async function updateStatus(id: number, status: string) {

    await fetch("/api/staff/update-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, status })
    })

    toast.success("Status Updated")

    loadTickets()

  }

  const stats = [

    {
      label: "Assigned",
      value: tickets.filter(t => t.status === "ASSIGNED").length
    },

    {
      label: "In Progress",
      value: tickets.filter(t => t.status === "IN_PROGRESS").length
    },

    {
      label: "Resolved",
      value: tickets.filter(t => t.status === "RESOLVED").length
    }

  ]

  function statusColor(status: string) {

    if (status === "ASSIGNED") return "bg-yellow-100 text-yellow-700"
    if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-700"
    if (status === "RESOLVED") return "bg-green-100 text-green-700"

    return "bg-gray-100"

  }

  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Staff Dashboard
      </h1>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-6 mb-8">

        {stats.map((s, i) => (

          <div key={i}
            className="bg-white p-6 rounded-lg shadow">

            <p className="text-gray-500">
              {s.label}
            </p>

            <p className="text-3xl font-bold mt-2">
              {s.value}
            </p>

          </div>

        ))}

      </div>


      {/* Complaints */}

      <div className="bg-white p-6 rounded-lg shadow">

        <h2 className="text-xl font-bold mb-4">
          Department Complaints
        </h2>

        {loading ? (

          <p>Loading complaints...</p>

        ) : tickets.length === 0 ? (

          <p>No complaints assigned</p>

        ) : (

          <div className="space-y-4">

            {tickets.map(ticket => (

              <div
                key={ticket.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >

                <div>

                  <p className="font-semibold text-lg">
                    {ticket.title}
                  </p>

                  <p className="text-gray-600 text-sm">
                    {ticket.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <span className={`px-3 py-1 rounded text-sm ${statusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>

                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      updateStatus(ticket.id, e.target.value)
                    }
                    className="border p-2 rounded"
                  >

                    <option value="ASSIGNED">
                      ASSIGNED
                    </option>

                    <option value="IN_PROGRESS">
                      IN PROGRESS
                    </option>

                    <option value="RESOLVED">
                      RESOLVED
                    </option>

                  </select>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )

}