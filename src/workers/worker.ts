/* eslint-disable import/order */
import "module-alias/register";
/* eslint-enable import/order */

import Redis from "ioredis";
import { LoggerProvider } from "@logging";
import { kafkaSettings, redisSettings } from "../settings";
import { KafkaService } from "@kafka";
import { RedisService } from "@redis";
export class Worker {
  private readonly _logger = LoggerProvider.getLoggerForClass(Worker);
  private readonly _kafkaService = new KafkaService(kafkaSettings);
  private readonly _redisService = new RedisService(redisSettings);
  private _started: boolean = false;
  constructor() {}

  get started(): boolean {
    return this._started;
  }

  async start() {
    if (this._started) {
      this._logger.error(
        "Worker already started, stop it before starting again"
      );
    } else {
      await this._redisService.start();

      this._kafkaService.messages.subscribe((message) => {
        this._redisService.handleMessage(message);
      });

      this._kafkaService.start();
      this._logger.info(
        "Avenirs Realtime Worker started, listening for messages..."
      );
      this._started = true;
    }
  }

 async stop() {  
    if (!this._started) {
      this._logger.error("Worker not started, start it before stopping");
    } else {
      await this._kafkaService.stop();
      await this._redisService.stop();
      this._started = false;
      this._logger.info("Worker stopped");
    }
  }
}
