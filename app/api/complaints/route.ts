import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getComplaintQueue } from "@/lib/queue/complaintQueue"
import { processComplaint } from "@/lib/services/complaintProcessor"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.user.id)

  try {

    const complaints = await prisma.complaint.findMany({

      where: {
        userId: userId
      },

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
        title,
        description,
        status: "OPEN",
        user: {
          connect: { id: Number(body.userId) }
        }
      }
    })

    const text = `${title} ${description}`

    const config = await prisma.systemConfig.findFirst()

    if (config?.useQueue) {

      try {

        await getComplaintQueue().add("predict-department", {
          complaintId: complaint.id,
          text
        })

      } catch (queueError) {

        console.warn("Queue failed. Processing directly.", queueError)

        await processComplaint(
          complaint.id,
          body.title,
          body.description
        )

      }

    } else {

      await processComplaint(
        complaint.id,
        body.title,
        body.description
      )

    }

    return NextResponse.json(complaint)

  } catch (error) {

    console.error("Complaint creation failed:", error)

    return NextResponse.json(
      { error: "Failed to create complaint" },
      { status: 500 }
    )

  }
}