import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import AdminDashboardTabs from "@/components/AdminDashboardTabs";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return <div>Access Denied</div>;
  }

  const users = await prisma.user.findMany({
    include: { department: true }
  });

  // Real complaint stats from DB
  const statusGroups = await prisma.complaint.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const colorMap: Record<string, string> = {
    OPEN: "#f97316",
    ASSIGNED: "#3b82f6",
    IN_PROGRESS: "#f59e0b",
    RESOLVED: "#10b981",
  };

  const performanceData = statusGroups.map((g) => ({
    status: g.status.replace("_", " "),
    count: g._count.status,
    fill: colorMap[g.status] ?? "#6366f1",
  }));

  return (
    <AdminDashboardTabs users={users} performanceData={performanceData} />
  );
}