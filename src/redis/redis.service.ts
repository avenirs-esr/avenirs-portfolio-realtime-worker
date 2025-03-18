import Redis from "ioredis";
import { RedisSettingsDefinition } from "./models";
import { LoggerProvider } from "@logging";

type MessageHandler = (message: string) => void;


export class RedisService {
  private readonly _logger = LoggerProvider.getLoggerForClass(RedisService);
  private _redis: Redis;
  private _started: boolean = false;

  private _inactiveMessageHandler: MessageHandler = (message => this._logger.error("Service not started, start it before sending messages"));
  private _activeMessageHandler: MessageHandler = (message => {
    this._logger.trace (`Handling message: ${message}`);
    this._redis.xadd(this._redisSettings.key, '*', 'data', message)
            .then(id => this._logger.trace({ id, message: JSON.parse(message) }, '✅ Message written to KeyDB'))
            .catch(err => this._logger.error({ err }, '❌ Failed to write to KeyDB'));
  });
  private _messageHandler: MessageHandler = this._inactiveMessageHandler;


  constructor(private readonly _redisSettings: RedisSettingsDefinition) {
    this._redis = new Redis(this._redisSettings.uri, {
      lazyConnect: true
    });
  }

  get started(): boolean {
    return this._started;
  }

  async start() {
    if (this._started) {
      this._logger.error(
        "Redis already started, stop it before starting again"
      );
    } else {
      this._logger.info("Starting Redis...");
      this._messageHandler = this._activeMessageHandler;
      await this._redis.connect();
      this._logger.info("Connected");
      this._started = true;
      this._logger.info("Redis started");
    }
  }

  handleMessage(message: string) :void {
    this._messageHandler(message);
  } 

  async stop() {
    if (!this._started) {
      this._logger.error("Redis not started, start it before stopping");
    } else {
      this._logger.info("Stopping Redis...");
      try {
        await this._redis.quit();
        this._messageHandler = this._inactiveMessageHandler;
        this._started = false;
        this._logger.info("Redis stopped gracefully");
      } catch (error) {
        this._logger.error({ error }, "Error while stopping Redis gracefully, forcing disconnect");
        await this._redis.disconnect();
        this._started = false;
      }
    }
  }
}
