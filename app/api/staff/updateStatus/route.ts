import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req:Request){

  const body = await req.json()

  const updated = await prisma.complaint.update({
    where:{
      id:body.id
    },
    data:{
      status:body.status
    }
  })

  return NextResponse.json(updated)
}