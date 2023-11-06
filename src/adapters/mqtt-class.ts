import { MqttClient, connect, IClientOptions } from 'mqtt';
import { readFileSync } from 'fs';
import { LocalMessageSaver } from './message-save-local';
import { AdapterUs } from './adapter-us'; // Import the AdapterUs class
import { FileNameUtility } from './filename-utility';
import { extractYearMonthDate } from './extract-year-month-date';

export type MqttProtocol = 'mqtt' | 'mqtts' | 'ws' | 'wss';

/**
 * Represents a client for receiving and handling MQTT messages from a broker.
 */
export class DownstreamMqttClient {
  public client: MqttClient;
  public messageSaver: LocalMessageSaver;
  public lastKnownDate: string | null = null;

  /**
   * Constructs a new DownstreamMqttClient.
   *
   * @param mqttBroker - The MQTT broker URL.
   * @param clientId - The client identifier.
   * @param caFilePath - The file path for the Certificate Authority (CA) certificate.
   * @param protocol - The MQTT protocol to use ('mqtt', 'mqtts', 'ws', 'wss').
   * @param topic - The MQTT topic to subscribe to.
   * @param messageFilePath - The file path where messages will be saved.
   */
  constructor(
    mqttBroker: string,
    clientId: string,
    caFilePath: string,
    protocol: MqttProtocol,
    topic: string,
    messageFilePath: string
  ) {
    this.lastKnownDate = null;

    const options: IClientOptions = {
      protocol: protocol,
      clientId: clientId,
      ca: [readFileSync(caFilePath)],
      rejectUnauthorized: false,
    };

    this.client = connect(mqttBroker, options);
    this.messageSaver = new LocalMessageSaver(messageFilePath);
    const bucketName = 'your-bucket-name'; // Replace with your S3 bucket name
    const fileKey = 'your/file/key.txt'; // Replace with the desired file key
    const region = 'your-aws-region'; // Replace with your AWS region

    const s3Uploader = new AdapterUs(bucketName, fileKey, region); // Create an instance of AdapterUs

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic} topic`);
        }
      });
      this.client.on('message', async (receivedTopic, message) => {
        await this.handleIncomingMessage(receivedTopic, message, messageFilePath, s3Uploader);
      });
    });

    this.client.on('error', (error) => {
      console.error('Downstream MQTT Client Error:', error);
    });
  }

  /**
   * Handles an incoming MQTT message, saves it, and manages file storage.
   *
   * @param topic - The MQTT topic where the message was received.
   * @param message - The received message as a Buffer.
   * @param messageFilePath - The file path where messages will be saved.
   * @param s3Uploader - An instance of AdapterUs for S3 upload.
   */
  private async handleIncomingMessage(topic: string, message: Buffer, messageFilePath: string, s3Uploader: AdapterUs) {
    const messageContent = message.toString();
    console.log(`Received message on topic '${topic}': ${messageContent}. Saving to: ${messageFilePath}`);
    const messageData = JSON.parse(messageContent);
    const timePublished = messageData.timePublished;

    if (timePublished) {
      const publishedDate = extractYearMonthDate(timePublished);

      if (publishedDate !== this.lastKnownDate) {
        const newMessageFilePath = FileNameUtility.constructFileName(messageFilePath, publishedDate);
        if (this.lastKnownDate) {
          const oldMessageFilePath = FileNameUtility.constructFileName(messageFilePath, this.lastKnownDate);

          // Asynchronously upload old messages and continue without blocking
          this.uploadAndDeleteAsync(oldMessageFilePath, newMessageFilePath, s3Uploader);
        }
        // Update lastKnownDate and messageSaver for new messages
        this.lastKnownDate = publishedDate;
        this.messageSaver.changeFilePath(newMessageFilePath);
      }
    }
    this.messageSaver.saveMessage(messageContent);
  }

  /**
   * Asynchronously uploads old messages, deletes the old file, and creates a new file.
   *
   * @param oldMessageFilePath - The file path of the old message file to upload and delete.
   * @param newMessageFilePath - The file path for the new message file to create.
   * @param s3Uploader - An instance of AdapterUs for S3 upload.
   */
  private async uploadAndDeleteAsync(oldMessageFilePath: string, newMessageFilePath: string, s3Uploader: AdapterUs) {
    try {
      // Use Promise.all to upload and delete asynchronously
      await Promise.all([
        s3Uploader.uploadObjectAndDeleteLocalFile(oldMessageFilePath),
        this.messageSaver.createFile(newMessageFilePath),
      ]);
    } catch (error) {
      console.error('Error while uploading or deleting files:', error);
    }
  }

  /**
   * Starts the MQTT client and handles errors.
   */
  public start() {
    this.client.on('error', (error) => {
      console.error('Downstream MQTT Client Error:', error);
    });
  }

  /**
   * Stops the MQTT client.
   */
  public stop(): void {
    if (this.client) {
      this.client.end();
    }
  }
}