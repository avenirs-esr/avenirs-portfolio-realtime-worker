import { KafkaSettingsDefinition } from "kafka";

export const kafkaSettings: KafkaSettingsDefinition = {
    clientId: 'realtime-worker1',
    groupId: 'realtime-worker1',
    brokers: ['localhost:29092'],
    topic: 'avenirs_rt.public.sample',
    fromBeginning: false        
};