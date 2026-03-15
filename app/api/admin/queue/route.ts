import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { startRedisServer } from "@/lib/redisManager"

export async function POST() {

  const config = await prisma.systemConfig.findFirst()

  const newValue = !config?.useQueue

  const updated = await prisma.systemConfig.update({
    where: { id: 1 },
    data: {
      useQueue: newValue
    }
  })

  if (newValue === true) {
    await startRedisServer()
  }

  return NextResponse.json(updated)
}