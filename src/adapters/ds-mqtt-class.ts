import { MqttClient, connect, IClientOptions } from 'mqtt';
import { readFileSync } from 'fs';

// Import the LocalMessageSaver class
import { LocalMessageSaver } from './message-save-local.js';

/**
 * Defines the supported MQTT protocols.
 */
export type MqttProtocol = 'mqtt' | 'mqtts' | 'ws' | 'wss';

/**
 * Downstream MQTT client class for collecting messages from the MQTT broker.
 */
export class DownstreamMqttClient {
  private client: MqttClient;
  private messageSaver: LocalMessageSaver;

  /**
   * Initializes the DownstreamMqttClient.
   * @param mqttBroker - The URL of the MQTT broker.
   * @param clientId - The client ID for the MQTT connection.
   * @param caFilePath - The file path to the CA certificate for secure connections.
   * @param protocol - The MQTT protocol (e.g., 'mqtts').
   * @param topic - The MQTT topic to subscribe to.
   * @param messageFilePath - The file path to save received messages.
   */
  constructor(mqttBroker: string, clientId: string, caFilePath: string, protocol: MqttProtocol, topic: string, messageFilePath: string) {
    const options: IClientOptions = {
      protocol: protocol,
      clientId: clientId,
      ca: [readFileSync(caFilePath)],
      rejectUnauthorized: false,
    };
    
    this.client = connect(mqttBroker, options);
    this.messageSaver = new LocalMessageSaver(messageFilePath);
    
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic} topic`);
        }
      });
      this.client.on('message', (receivedTopic, message) => {
        this.handleIncomingMessage(receivedTopic, message, messageFilePath);
      });
    });
    
    this.client.on('error', (error) => {
      console.error('Downstream MQTT Client Error:', error);
    });
  }

  private handleIncomingMessage(topic: string, message: Buffer, messageFilePath:string) {
    // Handle incoming messages
    const messageContent = message.toString();
    
    // Print received message on the console along with the saving place
    console.log(`Received message on topic '${topic}': ${messageContent}. Saving to: ${messageFilePath}`);

    // Can send message to Redis from here

    // Save the message to the local file
    this.messageSaver.saveMessage(message.toString());
  }

  /**
   * Starts the Downstream MQTT client and handles errors.
   */
  public start() {
    this.client.on('error', (error) => {
      console.error('Downstream MQTT Client Error:', error);
    });
  }

  /**
   * Stops the Downstream MQTT client.
   */
  public stop() {
    this.client.end();
  }
}
