import { LoggerProvider } from "@logging";
import { KafkaSettingsDefinition } from "./models";
import { Consumer, Kafka } from "kafkajs";
import { Subject, Observable } from "rxjs";

export class KafkaService {
  private _logger = LoggerProvider.getLoggerForClass(KafkaService);
  private readonly _kafka: Kafka;
  private _started: boolean = false;
  private _messageSubject = new Subject<string>();

  public readonly messages: Observable<string> =
    this._messageSubject.asObservable();

  private _consumer: Consumer;
  constructor(private readonly _kafkaSettings: KafkaSettingsDefinition) {
    this._kafka = new Kafka({
      clientId: this._kafkaSettings.clientId,
      brokers: this._kafkaSettings.brokers,
    });

    this._consumer = this._kafka.consumer({
      groupId: this._kafkaSettings.groupId,
    });
  }

  get started(): boolean {
    return this._started;
  }

  async start() {
    if (this._started) {
      this._logger.error(
        "Kafka already started, stop it before starting again"
      );
    } else {
      this._logger.info(`Subscribing to topic ${this._kafkaSettings.topic}...`);
      await this._consumer.subscribe({
        topic: this._kafkaSettings.topic,
        fromBeginning: this._kafkaSettings.fromBeginning,
      });
      this._logger.info(`Subscribed to topic ${this._kafkaSettings.topic}`);

      this._consumer.run({
        eachMessage: async ({ message }) => {
          const messageValue = message.value?.toString();
          if (!messageValue) {
            this._logger.trace("Received empty message");
          } else {
            this._logger.trace(`Received message: ${messageValue}`);
            this._messageSubject.next(messageValue);
          }
        },
      });
      this._started = true;
      this._logger.info("Kafka consumer started");
    }
  }

  async stop() {
    if (!this._started) {
      this._logger.warn("Kafka is not running");
    } else {
      this._logger.info("Stopping Kafka...");
      await this._consumer.disconnect();
      this._logger.info("Kafka consumer disconnected");
      this._messageSubject.complete();
      this._started = false;
      this._logger.info("Kafka stopped");
    }
  }
}
