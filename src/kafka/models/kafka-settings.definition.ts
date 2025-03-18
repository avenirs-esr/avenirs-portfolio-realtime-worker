export interface KafkaSettingsDefinition {
    clientId: string;
    groupId: string;
    brokers: string[];
    topic: string;
    fromBeginning: boolean;
}