import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/admin/users/[id] — admin deletes a user
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Prevent admin from deleting themselves
  if (id === Number(session.user.id)) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  // Delete user's complaints' status histories first, then complaints, then user
  const userComplaints = await prisma.complaint.findMany({
    where: { userId: id },
    select: { id: true },
  });
  const complaintIds = userComplaints.map((c) => c.id);

  await prisma.statusHistory.deleteMany({ where: { complaintId: { in: complaintIds } } });
  await prisma.complaint.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
