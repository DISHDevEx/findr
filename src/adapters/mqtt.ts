import { connect, IClientOptions, MqttProtocol } from 'mqtt';
import { MqttClient } from 'mqtt';
import { readFileSync } from 'fs';
import { LocalMessageSaver } from '../utilities/message-save-local.js';
import { extractYearMonthDate } from '../utilities/extract-year-month-date.js';
import { FileNameUtility } from '../utilities/filename-utility.js';
import { DataTransferHandler } from '../storage-index.js';

/**
 * Configuration options for the MQTT Adapter.
 */
interface MqttAdapterConfig {
  source: string;
  destination: string;
  mqttBroker: string;
  protocol: MqttProtocol;
  messageFilePath: string;
  clientId: string;
  caFilePath: string;
  s3Bucket?: string;
  s3FileKey?: string;
  s3Region?: string;
  topic: string;
}

/**
 * MqttAdapter class for handling MQTT connections and messages.
 */
class MqttAdapter {
  /**
   * Source identifier for the MQTT adapter.
   * @param source - Source identifier.
   */
  private source: string;
  /**
   * Destination identifier for the MQTT adapter.
   * @param destination - Destination identifier.
   */
  private destination: string;
  /**
   * MQTT broker URL.
   * @param mqttBroker - MQTT broker URL.
   */
  private mqttBroker: string;
  /**
   * MQTT client instance.
   * @param client - MQTT client instance.
   */
  private client: MqttClient;
  /**
   * Protocol used for MQTT connection.
   * @param protocol - Protocol used for MQTT connection.
   */
  private protocol: MqttProtocol;
  /**
   * File path for storing incoming MQTT messages.
   * @param messageFilePath - File path for storing incoming MQTT messages.
   */
  private messageFilePath: string;
  /**
   * Client identifier for the MQTT connection.
   * @param clientId - Client identifier for the MQTT connection.
   */
  private clientId: string;
  /**
   * File path to the Certificate Authority (CA) file for secure MQTT connection.
   * @param caFilePath - File path to the Certificate Authority (CA) file.
   */
  private caFilePath: string;
  /**
   * Optional S3 bucket for storing messages if the destination is set to 's3'.
   * @param s3Bucket - Optional S3 bucket for storing messages.
   */
  private s3Bucket?: string;
  /**
   * Optional S3 file key for storing messages if the destination is set to 's3'.
   * @param s3FileKey - Optional S3 file key for storing messages.
   */
  private s3FileKey?: string;
  /**
   * Optional S3 region for storing messages if the destination is set to 's3'.
   * @param s3Region - Optional S3 region for storing messages.
   */
  private s3Region?: string;
  /**
   * Current year, month, and date for message processing.
   * @param currentYearMonthDate - Current year, month, and date.
   */
  private currentYearMonthDate: string | null = null;
  /**
   * LocalMessageSaver instance for saving messages locally.
   * @param messageSaver - LocalMessageSaver instance.
   */
  private messageSaver: LocalMessageSaver;
  /**
   * DataTransferHandler instance for handling data transfer operations.
   * @param dataTransferHandler - DataTransferHandler instance.
   */
  private dataTransferHandler: DataTransferHandler;
  /**
   * MQTT topic to subscribe to.
   * @param topic - MQTT topic to subscribe to.
   */
  private topic: string;

  /**
   * Creates an instance of MqttAdapter.
   * @param config - Configuration options for the MQTT Adapter.
   */
  constructor(config: MqttAdapterConfig) {
    this.source = config.source;
    this.destination = config.destination;
    this.mqttBroker = config.mqttBroker;
    this.protocol = config.protocol;
    this.messageFilePath = config.messageFilePath;
    this.clientId = config.clientId;
    this.caFilePath = config.caFilePath;
    this.s3Bucket = config.s3Bucket;
    this.s3FileKey = config.s3FileKey;
    this.s3Region = config.s3Region;
    this.topic = config.topic;
    this.messageSaver = new LocalMessageSaver(this.messageFilePath);
    this.dataTransferHandler = new DataTransferHandler(this.source, this.destination);
  }

  private connectClient(): void {
    const options: IClientOptions = {
      clientId: this.clientId,
      ca: [readFileSync(this.caFilePath)],
      rejectUnauthorized: false,
    };

    this.client = connect(this.mqttBroker, options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.subscribeToTopic(this.topic);
      this.client!.on('message', async (receivedTopic, message) => {
        await this.handleMessage(receivedTopic, message);
      });
    });
  }

  public startClient(): void {
    this.connectClient();
  }

  /**
   * Subscribes to the specified MQTT topic.
   * @param topic - The MQTT topic to subscribe to.
   */
  private subscribeToTopic(topic: string): void {
    this.client.subscribe(topic, (err) => {
      if (err === null) {
        console.log(`Subscriber subscribed to ${this.topic} topic`);
      } else {
        console.error(`Error subscribing to ${this.topic} topic: ${err}`);
      }
    });
  }

  /**
   * Handles incoming MQTT messages.
   * @param topic - The topic on which the message was received.
   * @param message - The received message as a Buffer.
   */
  public handleMessage(topic: string, message: Buffer): void {
    console.log(`Received message on topic ${topic}: ${message.toString('utf-8')}`);

    const yearMonthDate = extractYearMonthDate(JSON.parse(message.toString('utf-8')).timePublished);

    if (this.currentYearMonthDate !== null) {
      if (this.currentYearMonthDate === yearMonthDate) {
        this.messageSaver.saveMessage(message.toString('utf-8'));
      } else {
        if (this.destination === 's3' && this.s3Bucket !== undefined && this.s3FileKey !== undefined && this.s3Region !== undefined) {
          const oldFileName = FileNameUtility.constructFileName(this.messageFilePath, this.currentYearMonthDate);
          this.dataTransferHandler.fromIotToS3(oldFileName, this.s3Bucket, this.s3FileKey, this.s3Region);
        }

        const newFileName = FileNameUtility.constructFileName(this.messageFilePath, yearMonthDate);
        this.messageSaver.changeFilePath(newFileName);
        this.messageSaver.createFile(newFileName);
        this.currentYearMonthDate = yearMonthDate;

        this.messageSaver.saveMessage(message.toString('utf-8'));
      }
    } else {
      this.currentYearMonthDate = yearMonthDate;

      const newFileName = FileNameUtility.constructFileName(this.messageFilePath, this.currentYearMonthDate);
      this.messageSaver.changeFilePath(newFileName);
      this.messageSaver.createFile(newFileName);
      this.messageSaver.saveMessage(message.toString('utf-8'));
    }

  }

  /**
   * Ends the MQTT client connection.
   */
  public endClient(): void {
    this.client.end();
  }

}

export default MqttAdapter;
