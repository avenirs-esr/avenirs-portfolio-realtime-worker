import { KafkaSettingsDefinition } from "kafka";
const isLocal = process.env.NODE_TARGET == 'local';
const kafkaLocalSettings: KafkaSettingsDefinition = {
    clientId: 'realtime-worker1',
    groupId: 'realtime-worker1',
    brokers: ['localhost:29092'],
    topic: 'avenirs_rt.public.sample',
    fromBeginning: false        
};

const kafkaContainerSettings: KafkaSettingsDefinition = {
    clientId: 'realtime-worker1',
    groupId: 'realtime-worker1',
    brokers: ['avenirs-kafka:9092'],
    topic: 'avenirs_rt.public.sample',
    fromBeginning: false        
};

export const kafkaSettings: KafkaSettingsDefinition = isLocal ? kafkaLocalSettings : kafkaContainerSettings;


