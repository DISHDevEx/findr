import express, { Request, Response } from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosResponse, AxiosError } from 'axios'
import VaultClient from './vault-client.js'
import dotenv from 'dotenv'

dotenv.config()

/**
 * The FindrBackendServer class represents the backend server for the Findr application.
 * It handles incoming requests, validates parameters, and sends requests to the orchestrator.
 */
class Oracle {
  private app: express.Application;
  private port: number;
  private route: string;
  private containerPort: number;
  private uuid: string;
  private messageToSent: Record<string, any>;

  /**
   * Constructs an instance of the FindrBackendServer class.
   * Initializes the Express application, sets up middleware, and initializes properties.
   */
  constructor() {
    this.app = express();
    this.port = parseInt(process.env.API_PORT ?? '8080', 10);
    this.route = process.env.API_ROUTE ?? '/oracle';
    this.setupMiddleware();
    this.setupRoutes();
    this.messageToSent = this.initializeMessageToSent();
  }

  /**
   * Initializes the messageToSent object with default values.
   * @returns {Record<string, any>} The initialized messageToSent object.
   */
  private initializeMessageToSent(): Record<string, any> {
    return {
      'deviceId':'',
      'source': '',
      'destination': '',
      'uuid': '',
      'mqttsBroker': '',
      'topic': '',
      'clientId': '',
      'httpPortNumber': '',
      'httpRoute': '',
      's3BucketName': '',
      's3FileKey': '',
      's3Region': '',
      'dynamodbTableName': '',
      'dynamodbRegion': '',
    };
  }

  /**
   * Sets up CORS and JSON body parsing middleware for the Express application.
   */
  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  /**
   * Sets up routes for the Express application.
   */
  private setupRoutes(): void {
    this.app.post(this.route, this.handleFindrBackendRequest);
  }

  /**
   * Validates the deviceId parameter.
   * @param {string} deviceId - The deviceId parameter to validate.
   * @returns {boolean} True if the deviceId is a non-empty string, false otherwise.
   */
  private isValidDeviceId(deviceId: string): boolean {
    return typeof deviceId === 'string' && deviceId.trim().length > 0;
  }

  /**
   * Validates if the source is valid ('mqtts' or 'http').
   * @param {string} source - The source parameter to validate.
   * @returns {boolean} True if the source is valid, false otherwise.
   */
  private isValidSource(source: string): boolean {
    return source === 'mqtts' || source === 'http';
  }

  /**
   * Validates if the destination is valid ('dynamodb' or 's3').
   * @param {string} destination - The destination parameter to validate.
   * @returns {boolean} True if the destination is valid, false otherwise.
   */
  private isValidDestination(destination: string): boolean {
    return destination === 'dynamodb' || destination === 's3';
  }

  /**
   * Validates the format of the mqttsBroker parameter.
   * @param {string} mqttsBroker - The mqttsBroker parameter to validate.
   * @returns {boolean} True if the mqttsBroker has a valid format, false otherwise.
   */
  private isValidMqttsBroker(mqttsBroker: string): boolean {
    const pattern = /^mqtts:\/\/(?:\d{1,3}\.){3}\d{1,3}:(?:[3-9]\d{3}|[1-5]\d{4}|6[0-5][0-5][0-3][0-5])$/;
    if (pattern.test(mqttsBroker) === false) {
      console.error('Invalid mqttsBroker format. Please provide a valid broker URL with a port in the range of 3000 to 65535.');
      console.error('Mismatch details:', mqttsBroker.match(pattern));
    }

    return pattern.test(mqttsBroker);
  }

  /**
   * Validates the topic parameter.
   * @param {string} topic - The topic parameter to validate.
   * @returns {boolean} True if the topic is a non-empty string, false otherwise.
   */
  private isValidTopic(topic: string): boolean {
    return typeof topic === 'string' && topic.trim().length > 0;
  }

  /**
   * Validates the clientId parameter.
   * @param {string} clientId - The clientId parameter to validate.
   * @returns {boolean} True if the clientId is a non-empty string, false otherwise.
   */
  private isValidClientId(clientId: string): boolean {
    return typeof clientId === 'string' && clientId.trim().length > 0;
  }

  /**
   * Validates the httpPortNumber parameter.
   * @param {string} httpPortNumber - The httpPortNumber parameter to validate.
   * @returns {boolean} True if the httpPortNumber is a valid port number, false otherwise.
   */
  private isValidHttpPortNumber(httpPortNumber: string): boolean {
    const port = parseInt(httpPortNumber, 10);
    return isNaN(port) === false && port >= 3000 && port <= 65535;
  }

  /**
   * Validates the httpRoute parameter.
   * @param {string} httpRoute - The httpRoute parameter to validate.
   * @returns {boolean} True if the httpRoute is a valid HTTP route, false otherwise.
   */
  private isValidHttpRoute(httpRoute: string): boolean {
    const pattern = /^\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
    return pattern.test(httpRoute);
  }

  /**
   * Validates the s3BucketName parameter.
   * @param {string} s3BucketName - The s3BucketName parameter to validate.
   * @returns {boolean} True if the s3BucketName adheres to specified rules, false otherwise.
   */
  private isValidS3BucketName(s3BucketName: string): boolean {
    const pattern = /^[a-z0-9.-]{3,63}$/;
    if (
      pattern.test(s3BucketName) === false ||
      /^[a-z0-9]/.test(s3BucketName) === false ||
      /[.-]{2}/.test(s3BucketName) ||
      /[.-]$/.test(s3BucketName) ||
      s3BucketName.startsWith('xn--') ||
      s3BucketName.startsWith('sthree-') ||
      s3BucketName.startsWith('sthree-configurator') ||
      s3BucketName.endsWith('-s3alias') ||
      s3BucketName.endsWith('--ol-s3')
    ) {
      return false;
    }
    return true;
  }

  /**
   * Validates the s3FileKey parameter.
   * @param {string} s3FileKey - The s3FileKey parameter to validate.
   * @returns {boolean} True if the s3FileKey adheres to specified rules, false otherwise.
   */
  private isValidS3FileKey(s3FileKey: string): boolean {
    const pattern = /^[0-9a-zA-Z!-_.*'()]+$/;
    return pattern.test(s3FileKey);
  }

  /**
   * Validates the s3Region parameter.
   * @param {string} s3Region - The s3Region parameter to validate.
   * @returns {boolean} True if the s3Region is a valid S3 region, false otherwise.
   */
  private isValidS3Region(s3Region: string): boolean {
    const validS3Regions = [
      'us-east-1',
      'us-east-2',
      'us-west-1',
      'us-west-2',
      'ca-central-1',
      'eu-central-1',
      'eu-west-1',
      'eu-west-2',
      'eu-west-3',
      'eu-north-1',
      'ap-northeast-1',
      'ap-northeast-2',
      'ap-northeast-3',
      'ap-southeast-1',
      'ap-southeast-2',
      'ap-south-1',
      'sa-east-1',
    ];
    return validS3Regions.includes(s3Region);
  }

  /**
   * Validates the dynamodbTableName parameter.
   * @param {string} dynamodbTableName - The dynamodbTableName parameter to validate.
   * @returns {boolean} True if the dynamodbTableName adheres to specified rules, false otherwise.
   */
  private isValidDynamoDBTableName(dynamodbTableName: string): boolean {
    const pattern = /^[a-zA-Z0-9_.\-]{3,255}$/;
    return pattern.test(dynamodbTableName);
  }

  /**
   * Validates the dynamodbRegion parameter.
   * @param {string} dynamodbRegion - The dynamodbRegion parameter to validate.
   * @returns {boolean} True if the dynamodbRegion is a valid DynamoDB region, false otherwise.
   */
  private isValidDynamoDBRegion(dynamodbRegion: string): boolean {
    const validDynamoDBRegions = [
      'us-east-1',
      'us-east-2',
      'us-west-1',
      'us-west-2',
      'ca-central-1',
      'eu-central-1',
      'eu-west-1',
      'eu-west-2',
      'eu-west-3',
      'eu-north-1',
      'ap-northeast-1',
      'ap-northeast-2',
      'ap-northeast-3',
      'ap-southeast-1',
      'ap-southeast-2',
      'ap-south-1',
      'sa-east-1',
    ];
    return validDynamoDBRegions.includes(dynamodbRegion);
  }

  /**
   * Extracts the port from the mqttsBroker parameter.
   * @param {string} mqttsBroker - The mqttsBroker parameter.
   * @returns {number} The extracted port number or the default port (8883) if not found.
   */
  private extractMqttsPort(mqttsBroker: string): number {
    const portPattern = /:(\d+)$/;
    const match = mqttsBroker.match(portPattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 8883;
  }

  /**
   * Sends a request to the orchestrator API with the provided parameters.
   * Logs the response or error details.
   * @param {string} orchestratorUrl - The URL of the orchestrator API.
   * @param {object} messageToSent - The message to send in the request.
   * @returns {Promise<any>} A promise representing the orchestrator API response.
   */
  private sendOrchestratorRequest = async (orchestratorUrl: string, messageToSent: object): Promise<any> => {
    try {
      const response: AxiosResponse = await axios.post(orchestratorUrl, messageToSent);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error sending data:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error details:', error.message);
      }
    }
  };

  // /**
  //  * Validates a parameter for use in the vault.
  //  * @param {string} param1 - The parameter to validate.
  //  * @returns {boolean} True if the parameter is valid for the vault, false otherwise.
  //  */
  // private vaultValidation = (vaultPath: string, vaultValue: string): any => {
  //   // add logic here
  //   return true
  // }

  /**
   * Handles incoming Findr backend requests. Validates parameters and sends a request to the orchestrator.
   * Responds with a success message or error details.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  private handleFindrBackendRequest = (req: Request, res: Response): void => {
    const {
      deviceId,
      source,
      destination,
      mqttsBroker,
      topic,
      clientId,
      httpPortNumber,
      httpRoute,
      s3BucketName,
      s3FileKey,
      s3Region,
      dynamodbTableName,
      dynamodbRegion,
    } = req.body;

    console.log('Received request with parameters:', req.body);

    this.uuid = uuidv4();
    this.messageToSent['uuid'] = this.uuid

    if (this.isValidDeviceId(deviceId) === false) {
      res.status(400).json({ error: 'Invalid deviceId' });
      return; 
    }
    this.messageToSent['deviceId'] = deviceId

    if (this.isValidSource(source) === false || this.isValidDestination(destination) === false) {
      res.status(400).json({ error: 'Invalid source or destination' });
      return;
    }

    // Validate other parameters
    if (this.isValidSource(source) === false || this.isValidDestination(destination) === false) {
        res.status(400).json({ error: 'Invalid source or destination' });
        return;
    }
    let message = `Data received successfully! DeviceId: ${deviceId}, Source: ${source}, Destination: ${destination}, UUID: ${this.uuid},`

    if (source === 'mqtts') {
        // Validate mqtts-specific parameters
        // 
        if (this.isValidMqttsBroker(mqttsBroker) === false ||
            this.isValidTopic(topic) === false ||
            this.isValidClientId(clientId) === false) {
          res.status(400).json({ error: 'Invalid mqtts parameters' });
          return;
        } else {
            this.containerPort = this.extractMqttsPort(mqttsBroker)
            this.messageToSent['source'] = source
            this.messageToSent['mqttsBroker'] = mqttsBroker
            this.messageToSent['topic'] = topic
            this.messageToSent['clientId'] = clientId
            this.messageToSent['containerPort'] = this.containerPort
            this.messageToSent['httpPortNumber'] = ""
            this.messageToSent['httpRoute'] = ""
            message += ` MqttsBroker: ${mqttsBroker}, ContainerPort: ${this.containerPort}, Topic: ${topic}, ClientId: ${clientId},`
        }
    } else if (source === 'http') {
        // Validate http-specific parameters
        if (this.isValidHttpPortNumber(httpPortNumber) === false ||
            this.isValidHttpRoute(httpRoute) === false) {
          res.status(400).json({ error: 'Invalid http parameters' });
          return;
        } else {
            this.containerPort = parseInt(httpPortNumber, 10)
            // will get target_http from edge cluster
            const target_http = '165.225.216.231'
            this.messageToSent['source'] = source
            this.messageToSent['httpPortNumber'] = httpPortNumber
            this.messageToSent['httpRoute'] = httpRoute
            this.messageToSent['containerPort'] = this.containerPort
            this.messageToSent['mqttsBroker'] = ""
            this.messageToSent['topic'] = ""
            this.messageToSent['clientId'] = ""
            message += ` HttpPortNumber: ${httpPortNumber}, HttpRoute: ${httpRoute}, ContainerPort: ${this.containerPort}, Target_http: ${target_http},`
        }
    }
  
    if (destination === 's3') {
        // Validate s3-specific parameters
        if (this.isValidS3BucketName(s3BucketName) === false ||
            this.isValidS3FileKey(s3FileKey) === false ||
            this.isValidS3Region(s3Region) === false) {
          res.status(400).json({ error: 'Invalid s3 parameters' });
          return;
        } else {
            this.messageToSent['destination'] = destination
            this.messageToSent['s3BucketName'] = s3BucketName
            this.messageToSent['s3FileKey'] = s3FileKey
            this.messageToSent['s3Region'] = s3Region
            this.messageToSent['dynamodbTableName'] = ""
            this.messageToSent['dynamodbRegion'] = ""
            message += ` Destination: ${destination}, S3BucketName: ${s3BucketName}, S3FileKey: ${s3FileKey}, S3Region: ${s3Region},`

        }
    } else if (destination === 'dynamodb') {
        // Validate dynamodb-specific parameters
        if (this.isValidDynamoDBTableName(dynamodbTableName) === false ||
            this.isValidDynamoDBRegion(dynamodbRegion) === false) {
          res.status(400).json({ error: 'Invalid dynamodb parameters' })
          return
        } else {
            this.messageToSent['destination'] = destination
            this.messageToSent['dynamodbTableName'] = dynamodbTableName
            this.messageToSent['dynamodbRegion'] = dynamodbRegion
            this.messageToSent['s3BucketName'] = ""
            this.messageToSent['s3FileKey'] = ""
            this.messageToSent['s3Region'] = ""
            message += ` Destination: ${destination}, DynamoDBTableName: ${dynamodbTableName}, DynamoDBRegion: ${dynamodbRegion},`
        }
    }



    const localFilePath = '/app/findr_received.txt'
    const caFilePath = '/app/certs/ca.crt'
    this.messageToSent['localFilePath'] = localFilePath
    this.messageToSent['caFilePath'] = caFilePath

    // Write path and values to Vault
    const vaultUrl = process.env.VAULT_URL ?? ''
    const vaultToken = process.env.VAULT_TOKEN ?? ''
    const vaultPath = `${deviceId}-${this.uuid}`
    const vaultValue = this.messageToSent
    const vaultClient = new VaultClient(vaultUrl)
    vaultClient.authenticate(vaultToken)
    vaultClient.writeSecret(vaultPath, vaultValue)
    console.log('vaultPath:', vaultPath)

    const sendOrchestratorRequestUrl = process.env.FINDR_ORCHESTRATOR_URL ?? ''
    const sendOrchestratorRequestResponse = this.sendOrchestratorRequest(
      sendOrchestratorRequestUrl,
      this.messageToSent  
    )
    console.log('sendOrchestratorRequestResponse:', sendOrchestratorRequestResponse);

    message += ' are received parameters'
    res.status(200).json({
        message,
    })
  };

  /**
   * Starts the Express server on the specified port.
   */
  public startServer(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

// Create an instance of the FindrBackendServer class
const oracle = new Oracle();

// Start the server
oracle.startServer();