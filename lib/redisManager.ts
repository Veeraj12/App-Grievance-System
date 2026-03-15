import { exec } from "child_process"
import Redis from "ioredis"

export async function isRedisRunning() {
  try {
    const redis = new Redis()
    await redis.ping()
    redis.disconnect()
    return true
  } catch {
    return false
  }
}

export async function startRedisServer() {

  const running = await isRedisRunning()

  if (running) {
    console.log("Redis already running")
    return
  }

  console.log("Starting Redis server...")

  exec("redis-server", (error, stdout, stderr) => {

    if (error) {
      console.error("Redis start error:", error)
      return
    }

    console.log("Redis started successfully")
    console.log(stdout)
  })
}