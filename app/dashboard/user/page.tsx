import UserDashboard from "@/components/UserDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function UserPage() {

  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "USER") {
    return <div>Access Denied</div>;
  }

  return <UserDashboard />;
}