import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HistoryPage() {

  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="text-white">Unauthorized</div>;
  }

  const userId = Number(session.user.id);
  const userRole = session.user.role;
  const userName = session.user.name || "User";

  let complaints: any = [];

  if (userRole === "STAFF") {
    complaints = await prisma.complaint.findMany({
      where: {
        status: "RESOLVED",
        departmentName: session.user.departmentName
      }
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">
        History of {userName}
      </h2>

      {complaints.length === 0 ? (
        <p className="text-slate-400">No resolved complaints</p>
      ) : (
        complaints.map((c: any) => (
          <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="font-semibold text-white">{c.title}</div>
            <div className="text-sm text-slate-400">{c.departmentName}</div>
            <div className="text-sm text-slate-400">{c.description}</div>
          </div>
        ))
      )}
    </div>
  );
}