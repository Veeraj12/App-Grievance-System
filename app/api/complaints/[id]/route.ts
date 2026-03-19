import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/complaints/[id] — user can delete their own complaint
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Verify the complaint belongs to the requesting user (or they're admin)
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = complaint.userId === Number(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.statusHistory.deleteMany({ where: { complaintId: id } });
  await prisma.complaint.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
