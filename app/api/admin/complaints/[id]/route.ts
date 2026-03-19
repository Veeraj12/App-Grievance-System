import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/admin/complaints/[id]
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

  // Must delete related StatusHistory records first (FK constraint)
  await prisma.statusHistory.deleteMany({ where: { complaintId: id } });
  await prisma.complaint.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
