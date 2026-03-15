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

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Staff Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-8">

        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 border rounded-lg">

            <p className="text-gray-500">{s.label}</p>

            <p className="text-3xl font-bold">{s.value}</p>

          </div>
        ))}

      </div>

      <div className="bg-white p-6 border rounded-lg">

        <h2 className="text-xl font-bold mb-4">
          Assigned Complaints
        </h2>

        {loading ? (

          <p>Loading complaints...</p>

        ) : tickets.length === 0 ? (

          <p>No tickets assigned</p>

        ) : (

          tickets.map(ticket => (

            <div key={ticket.id}
              className="flex justify-between items-center border p-4 mb-3 rounded">

              <div>

                <p className="font-semibold">
                  {ticket.title}
                </p>

                <p className="text-sm text-gray-500">
                  {ticket.description}
                </p>

              </div>

              <select
                value={ticket.status}
                onChange={(e) => updateStatus(ticket.id, e.target.value)}
                className="border p-2 rounded"
              >

                <option value="ASSIGNED">
                  ASSIGNED
                </option>

                <option value="IN_PROGRESS">
                  IN_PROGRESS
                </option>

                <option value="RESOLVED">
                  RESOLVED
                </option>

              </select>

            </div>

          ))

        )}

      </div>

    </div>

  )

}