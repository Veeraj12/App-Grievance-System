import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CheckCircle } from "lucide-react";
export default async function HistoryPage() {
    const session = await getServerSession(authOptions)

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    const staff = await prisma.user.findUnique({
        where: {
          email: session.user?.email!
        },
        include: {
          department: true
        }
      })
    
      if (!staff?.department?.name) {
        return NextResponse.json([])
      }

  const complaints = await prisma.complaint.findMany({
   where: {
    departmentName: {
      equals: staff.department.name,
      mode: "insensitive"
    },
    status: {
      in: ["RESOLVED"]
    }
  }
  });

  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2 text-green-500">
  <CheckCircle size={20} />
  <h2 className="text-xl font-bold text-white">History</h2>
</div>
      {complaints.map((c) => (
        <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="font-semibold">{c.title}</div>
          <div className="text-sm text-slate-400">{c.departmentName}</div>
          <div className="text-sm text-slate-400">Complaint : {c.description}</div>
        </div>
      ))}
    </div>
  );
}