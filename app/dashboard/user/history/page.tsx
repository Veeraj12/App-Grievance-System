import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HistoryPage() {

  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const userName = session.user.name || "User";
  const userId = Number(session.user.id);
const userRole = session.user.role;

let complaints : any = [];

if (userRole === "USER") {
  complaints = await prisma.complaint.findMany({
    where: {
      status: "RESOLVED",
      userId: userId
    }
  });
}
  else if (userRole === "STAFF") {
    complaints = await prisma.complaint.findMany({
      where: {
        status: "RESOLVED",
        userId: userId
      }
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">
        History of {userName}
      </h2>

      {complaints.length === 0 ? (
        <p className="text-slate-400">No resolved complaints found</p>
      ) : (
        complaints.map((c:any) => (
          <div
            key={c.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="font-semibold text-white">{c.title}</div>
            <div className="text-sm text-slate-400">
              Resolved by : {c.departmentName} Department
            </div>
            <div className="text-sm text-slate-400">
              Complaint : {c.description}
            </div>
          </div>
        ))
      )}
    </div>
  );
}