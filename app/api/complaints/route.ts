import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { predictDepartment } from "@/lib/fuzzyClassifier"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const complaints = await prisma.complaint.findMany({
    where: {
      userId: Number(session.user.id)
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json(complaints)
}

export async function POST(req: Request) {
  console.log("Received complaint submission")
  const body = await req.json()

  // Predict the department before creating the record
  const predictedDepartment = predictDepartment(body.title, body.description)

  const complaint = await prisma.complaint.create({
    data: {
      title: body.title,
      description: body.description,
      status: "OPEN",
      departmentName: predictedDepartment,
      imageUrl: body.imageUrl ?? null,
      user: {
        connect: { id: Number(body.userId) }
      }
    }
  })

  return NextResponse.json(complaint)
}