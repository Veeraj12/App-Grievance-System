import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, departmentId } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      departmentId: departmentId ? Number(departmentId) : null
    }
  });

  return NextResponse.json(updatedUser);
}