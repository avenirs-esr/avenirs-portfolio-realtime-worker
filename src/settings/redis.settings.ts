import { RedisSettingsDefinition } from "@redis";
const isLocal = process.env.NODE_TARGET == 'local';
const redisLocalSettings: RedisSettingsDefinition = {
  uri: "redis://localhost:6379",
  key: "notification-stream"
};

const redisContainerSettings: RedisSettingsDefinition = {
  uri: "redis://avenirs-keydb:6379",
  key: "notification-stream"
};

export const redisSettings: RedisSettingsDefinition = isLocal ? redisLocalSettings : redisContainerSettings;