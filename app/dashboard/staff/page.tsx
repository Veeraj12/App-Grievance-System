import StaffDashboard from "@/components/StaffDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function StaffPage() {

  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "STAFF") {
    return <div>Access Denied</div>;
  }

  return <StaffDashboard data={[]} />;
}