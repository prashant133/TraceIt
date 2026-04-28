import { createClient, RedisClientType } from "redis";
import { env } from "../env";

export const client: RedisClientType = createClient({
  url: env.REDIS_URL,
});

client.on("error", (err) => {
  console.log("Redis Client error : ", err);
});

export const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log("Redis connection failed: ", error);
  }
};
