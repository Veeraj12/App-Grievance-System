import IORedis from "ioredis";

let redis: IORedis | null = null;

export function getRedisConnection() {

  if (!redis) {
    redis = new IORedis({
      host: "127.0.0.1",
      port: 6379,
      maxRetriesPerRequest: null,
      lazyConnect: true
    });
  }

  return redis;
}