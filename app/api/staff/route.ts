import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

  const complaints = await prisma.complaint.findMany({

    where:{
      status:{
        in:["ASSIGNED","IN_PROGRESS"]
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  return NextResponse.json(complaints)
}