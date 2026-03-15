import { Worker } from "bullmq"
import { getRedisConnection } from "../redis"
import { processComplaint } from "../services/complaintProcessor"

new Worker(
  "complaint-classification",
  async (job) => {

    const { complaintId, text } = job.data

    await processComplaint(complaintId, text)

  },
  { connection: getRedisConnection() as any }
)