import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET complaints with status OPEN — i.e. submitted but not yet assigned to any staff
// The complaintProcessor only promotes to ASSIGNED if the department has staff,
// so OPEN == "stuck / unassigned" by design.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const unassignedComplaints = await prisma.complaint.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(unassignedComplaints);
}

