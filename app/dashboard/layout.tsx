import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default async function Layout({ children }: any) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}