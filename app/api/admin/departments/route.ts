import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return NextResponse.json(departments);
}