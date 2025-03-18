import { RedisSettingsDefinition } from "@redis";

export const redisSettings: RedisSettingsDefinition = {
  uri: "redis://localhost:6379",
  key: "notification-stream"
};