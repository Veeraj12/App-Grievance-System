import { Queue } from "bullmq";
import { getRedisConnection } from "../redis";

export function getComplaintQueue() {
  return new Queue("complaint-classification", {
    connection: getRedisConnection() as any
  });
}