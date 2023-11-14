// Import necessary modules
import dotenv from 'dotenv';
import { MqttProtocol } from 'mqtt';
import MqttAdapter from './protocol-mqtt.js';
import HttpAdapter from './protocol-http.js';

// Load environment variables from the .env file
dotenv.config({ path: 'prod-env/protocol-index.env' });

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
const HTTP_PORT_NUMBER = process.env.HTTP_PORT_NUMBER ?? '';
const S3_BUCKET = process.env.S3_BUCKET ?? '';
const S3_FILE_KEY = process.env.S3_FILE_KEY ?? '';
const S3_REGION = process.env.S3_REGION ?? '';
const TOPIC = process.env.TOPIC ?? '';

// Check if SOURCE is 'mqtts'
if (SOURCE === 'mqtts' && DESTINATION === 's3') {
  // MqttAdapter configuration
  console.log('Configuring MqttAdapter');
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
} else if (SOURCE === 'http' && DESTINATION === 's3') {
  // HttpAdapter configuration
  console.log('Configuring HttpAdapter');
  const httpAdapterConfig = {
    source: SOURCE,
    destination: DESTINATION,
    httpPortNumber: parseInt(HTTP_PORT_NUMBER, 10),
    messageFilePath: MESSAGE_FILE_PATH,
    s3Bucket: S3_BUCKET,
    s3FileKey: S3_FILE_KEY,
    s3Region: S3_REGION,
  };

  // Create an instance of HttpAdapter
  const httpAdapter = new HttpAdapter(httpAdapterConfig);
  httpAdapter.startServer();
} else {
  console.error('Invalid source. Expected "mqtts" or "http".');
}
