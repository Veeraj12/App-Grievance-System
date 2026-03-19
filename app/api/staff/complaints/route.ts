import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // get logged in staff
  const staff = await prisma.user.findUnique({
    where: {
      email: session.user?.email!
    },
    include: {
      department: true
    }
  })

  if (!staff?.department?.name) {
    return NextResponse.json([])
  }

  const complaints = await prisma.complaint.findMany({
  where: {
    departmentName: {
      equals: staff.department.name,
      mode: "insensitive"
    },
    status: {
      in: ["OPEN","ASSIGNED", "IN_PROGRESS","RESOLVED"]
    }
  },
  orderBy: {
    createdAt: "desc"
  },
  include: {
    user: {
      select: {
        name: true,
        email: true
      }
    }
  }
})

  return NextResponse.json(complaints)

}