import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getComplaintQueue } from "@/lib/queue/complaintQueue"
import { processComplaint } from "@/lib/services/complaintProcessor"
import { Console } from "console"

export async function GET() {

  const complaints = await prisma.complaint.findMany({
    include: {
      department: true
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

  const complaint = await prisma.complaint.create({
  data: {
    title: body.title,
    description: body.description,
    status: "OPEN",
    user: {
      connect: { id: body.userId }
    }
  }
})

  const text = body.title + " " + body.description

  const config = await prisma.systemConfig.findFirst()

  if (config?.useQueue) {

    try {

      await getComplaintQueue().add("predict-department", {
        complaintId: complaint.id,
        text
      })

    } catch (err) {

      console.log("Redis queue failed, fallback to direct processing")

      await processComplaint(complaint.id, text)

    }

  } else {

    await processComplaint(complaint.id, text)

  }

  return NextResponse.json(complaint)
}