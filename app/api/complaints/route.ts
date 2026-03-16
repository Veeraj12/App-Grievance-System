import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getComplaintQueue } from "@/lib/queue/complaintQueue"
import { processComplaint } from "@/lib/services/complaintProcessor"

export async function GET() {
  try {

    const complaints = await prisma.complaint.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        statuses: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(complaints)

  } catch (error) {

    console.error("Error fetching complaints:", error)

    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    )

  }
}


export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { title, description, userId } = body

    if (!title || !description || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

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

  } catch (error) {

    console.error("Complaint creation failed:", error)

    return NextResponse.json(
      { error: "Failed to create complaint" },
      { status: 500 }
    )

  }
}