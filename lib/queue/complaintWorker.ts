import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { processComplaint } from "../services/complaintProcessor"

new Worker(
  "complaint-classification",
  async (job) => {

    const { complaintId, title, description } = job.data

    await processComplaint(complaintId, title, description)

  },
  { connection: getRedisConnection() as any }
)