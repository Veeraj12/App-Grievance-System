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

  const performanceData = [
    { status: "Resolved", count: 45, fill: "#10b981" },
    { status: "Pending", count: 12, fill: "#f59e0b" }
  ];

  return (
    <AdminDashboardTabs users={users} performanceData={performanceData}/>
  );
}