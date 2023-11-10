// Import necessary modules
import dotenv from 'dotenv';
import { MqttProtocol } from 'mqtt';
import MqttAdapter from './protocol-mqtt.js';

// Load environment variables from the .env file
dotenv.config({ path: 'test-env/protocol-index.env' });

// Mandatory variables
const SOURCE = process.env.SOURCE ?? '';
const DESTINATION = process.env.DESTINATION ?? '';

// Check if SOURCE and DESTINATION are defined
if (SOURCE === undefined && DESTINATION === undefined) {
  console.error('SOURCE and DESTINATION are mandatory variables. Please check your environment.');
  process.exit(1); // Exit the process with an error code
}

const MQTT_BROKER = process.env.MQTT_BROKER ?? '';
const PROTOCOL: MqttProtocol = process.env.PROTOCOL as MqttProtocol ?? '';
const MESSAGE_FILE_PATH = process.env.MESSAGE_FILE_PATH ?? '';
const CLIENT_ID = process.env.CLIENT_ID ?? '';
const CA_FILE_PATH = process.env.CA_FILE_PATH ?? '';
const S3_BUCKET = process.env.S3_BUCKET ?? '';
const S3_FILE_KEY = process.env.S3_FILE_KEY ?? '';
const S3_REGION = process.env.S3_REGION ?? '';
const TOPIC = process.env.TOPIC ?? '';

// Check if SOURCE is 'mqtts'
if (SOURCE === 'mqtts') {
  // MqttAdapter configuration
  const mqttAdapterConfig = {
    source: SOURCE,
    destination: DESTINATION,
    mqttBroker: MQTT_BROKER,
    protocol: PROTOCOL,
    messageFilePath: MESSAGE_FILE_PATH,
    clientId: CLIENT_ID,
    caFilePath: CA_FILE_PATH,
    s3Bucket: S3_BUCKET,
    s3FileKey: S3_FILE_KEY,
    s3Region: S3_REGION,
    topic: TOPIC,
  };

  // Create an instance of MqttAdapter
  const mqttAdapter = new MqttAdapter(mqttAdapterConfig);
  mqttAdapter.startClient()
} else {
  console.error('Invalid source. Expected "mqtts".');
}
