// Import the required classes
import { DownstreamMqttClient, MqttProtocol } from './ds-mqtt-class.js';

import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Define the expected order of arguments (protocol, broker, clientId, caFilePath, topic, and filePath)
const protocol = process.env.PROTOCOL;
const broker = process.env.BROKER;
const clientId = process.env.CLIENT_ID;
const caFilePath = process.env.CA_FILE_PATH;
const topic = process.env.TOPIC;
const filePath = process.env.FILE_PATH;

/**
 * Function to initialize and use the MQTT adapter.
 * Subscribes to an MQTT topic.
 */
function initializeMqttAdapter() {
  const downstreamMqttClient = new DownstreamMqttClient(broker, clientId, caFilePath, protocol as MqttProtocol, topic, filePath);

  downstreamMqttClient.start();
}

// Function to initialize and use the HTTP adapter
function initializeHttpAdapter() {
  // Implement HTTP-specific logic here
  // ...
}

// Function to initialize and use the CoAP adapter
function initializeCoapAdapter() {
  // Implement CoAP-specific logic here
  // ...
}

// Determine which protocol to use based on the command line arguments
if (protocol === 'mqtts') {
  initializeMqttAdapter();
} else if (protocol === 'http') {
  initializeHttpAdapter();
} else if (protocol === 'coap') {
  initializeCoapAdapter();
} else {
  console.error('Unsupported protocol:', protocol);
}
