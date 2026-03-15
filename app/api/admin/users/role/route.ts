import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, role } = await req.json();
  
  if (session.user.id === userId) {
  return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
}
  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: { role }
  });

  return NextResponse.json(updatedUser);
}