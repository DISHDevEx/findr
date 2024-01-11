import express, { type Request, type Response } from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import VaultClient from './vault-client.js'
<<<<<<< HEAD
import OrchestratorApiClient from './orchestrator-client.js'
// import dotenv from 'dotenv'

// dotenv.config()
=======
import dotenv from 'dotenv'

dotenv.config()
>>>>>>> 581b6ca (add env)

/**
 * The FindrBackendServer class represents the backend server for the Findr application.
 * It handles incoming requests, validates parameters, and sends requests to the orchestrator.
 */
class Oracle {
  private readonly app: express.Application
  private readonly port: number
  private readonly route: string
  private containerPort: number
  private uuid: string
  private readonly messageToSent: Record<string, any>

  /**
   * Constructs an instance of the FindrBackendServer class.
   * Initializes the Express application, sets up middleware, and initializes properties.
   */
  constructor () {
    this.app = express()
    this.port = parseInt(process.env.API_PORT ?? '9000', 10)
    this.route = process.env.API_ROUTE ?? '/oracle'
    this.setupMiddleware()
    this.setupRoutes()
    this.messageToSent = this.initializeMessageToSent()
  }

  /**
   * Initializes the messageToSent object with default values.
   * @returns {Record<string, any>} The initialized messageToSent object.
   */
  private initializeMessageToSent (): Record<string, any> {
    return {
      deviceId: '',
      source: '',
      destination: '',
      uuid: '',
      mqttsBroker: '',
      topic: '',
      clientId: '',
      httpIp: '',
      httpResponseKey: '',
      httpPortNumber: '',
      httpRoute: '',
      httpRequestInterval: '',
      s3BucketName: '',
      s3FileKey: '',
      s3Region: '',
      dynamodbTableName: '',
      dynamodbRegion: '',
      certificate: ''
    }
  }

  /**
   * Sets up CORS and JSON body parsing middleware for the Express application.
   */
  private setupMiddleware (): void {
    this.app.use(cors())
    this.app.use(express.json())
  }

  /**
   * Sets up routes for the Express application.
   */
  private setupRoutes (): void {
    this.app.post(this.route, this.handleFindrBackendRequest.bind(this))
  }

  /**
   * Validates the deviceId parameter.
   * @param {string} deviceId - The deviceId parameter to validate.
   * @returns {boolean} True if the deviceId is a non-empty string, false otherwise.
   */
  private isValidDeviceId (deviceId: string): boolean {
    return typeof deviceId === 'string' && deviceId.trim().length > 0
  }

  /**
   * Validates if the source is valid ('mqtts' or 'http').
   * @param {string} source - The source parameter to validate.
   * @returns {boolean} True if the source is valid, false otherwise.
   */
  private isValidSource (source: string): boolean {
    return source === 'mqtts' || source === 'http'
  }

  /**
   * Validates if the destination is valid ('dynamodb' or 's3').
   * @param {string} destination - The destination parameter to validate.
   * @returns {boolean} True if the destination is valid, false otherwise.
   */
  private isValidDestination (destination: string): boolean {
    return destination === 'dynamodb' || destination === 's3'
  }

  /**
   * Validates the format of the mqttsBroker parameter.
   * @param {string} mqttsBroker - The mqttsBroker parameter to validate.
   * @returns {boolean} True if the mqttsBroker has a valid format, false otherwise.
   */
  private isValidMqttsBroker (mqttsBroker: string): boolean {
    const pattern = /^mqtts:\/\/(?:\d{1,3}\.){3}\d{1,3}:(?:[3-9]\d{3}|[1-5]\d{4}|6[0-5][0-5][0-3][0-5])$/
    if (!pattern.test(mqttsBroker)) {
      console.error('Invalid mqttsBroker format. Please provide a valid broker URL with a port in the range of 3000 to 65535.')
      console.error('Mismatch details:', mqttsBroker.match(pattern))
    }

    return pattern.test(mqttsBroker)
  }

  /**
   * Validates the topic parameter.
   * @param {string} topic - The topic parameter to validate.
   * @returns {boolean} True if the topic is a non-empty string, false otherwise.
   */
  private isValidTopic (topic: string): boolean {
    return typeof topic === 'string' && topic.trim().length > 0
  }

  /**
   * Validates the clientId parameter.
   * @param {string} clientId - The clientId parameter to validate.
   * @returns {boolean} True if the clientId is a non-empty string, false otherwise.
   */
  private isValidClientId (clientId: string): boolean {
    return typeof clientId === 'string' && clientId.trim().length > 0
  }

  /**
   * Check if a httpIp is in IPv4 format.
   * @param {string} httpIp - The string to check.
   * @returns {boolean} - True if the string is in IPv4 format, false otherwise.
   */
  private isValidHttpIp (httpIp: string): boolean {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/
    return ipv4Pattern.test(httpIp)
  }

  /**
   * Validates the topic parameter.
   * @param {string} httpResponseKey - The topic parameter to validate.
   * @returns {boolean} True if the topic is a non-empty string, false otherwise.
   */
  private isValidHttpResponseKey (httpResponseKey: string): boolean {
    return typeof httpResponseKey === 'string' && httpResponseKey.trim().length > 0
  }

  /**
   * Validates the httpPortNumber parameter.
   * @param {string} httpPortNumber - The httpPortNumber parameter to validate.
   * @returns {boolean} True if the httpPortNumber is a valid port number, false otherwise.
   */
  private isValidHttpPortNumber (httpPortNumber: string): boolean {
    const port = parseInt(httpPortNumber, 10)
    return !isNaN(port) && port >= 3000 && port <= 65535
  }

  /**
   * Validates the httpRoute parameter.
   * @param {string} httpRoute - The httpRoute parameter to validate.
   * @returns {boolean} True if the httpRoute is a valid HTTP route, false otherwise.
   */
  private isValidHttpRoute (httpRoute: string): boolean {
    const pattern = /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/
    return pattern.test(httpRoute)
  }

  /**
   * Check if a string is a positive number.
   * @param {string} httpRequestInterval - The string to check.
   * @returns {boolean} - True if the string is a positive number, false otherwise.
   */
  private isValidHttpRequestInterval (httpRequestInterval: string): boolean {
    // Use the unary plus operator to convert the string to a number and check if it's a valid number
    const numericValue = +httpRequestInterval
    return !isNaN(numericValue) && numericValue > 0
  }

  /**
   * Validates the s3BucketName parameter.
   * @param {string} s3BucketName - The s3BucketName parameter to validate.
   * @returns {boolean} True if the s3BucketName adheres to specified rules, false otherwise.
   */
  private isValidS3BucketName (s3BucketName: string): boolean {
    const pattern = /^[a-z0-9.-]{3,63}$/
    if (
      !pattern.test(s3BucketName) ||
      !/^[a-z0-9]/.test(s3BucketName) ||
      /[.-]{2}/.test(s3BucketName) ||
      /[.-]$/.test(s3BucketName) ||
      s3BucketName.startsWith('xn--') ||
      s3BucketName.startsWith('sthree-') ||
      s3BucketName.startsWith('sthree-configurator') ||
      s3BucketName.endsWith('-s3alias') ||
      s3BucketName.endsWith('--ol-s3')
    ) {
      return false
    }
    return true
  }

  /**
   * Validates the s3FileKey parameter.
   * @param {string} s3FileKey - The s3FileKey parameter to validate.
   * @returns {boolean} True if the s3FileKey adheres to specified rules, false otherwise.
   */
  private isValidS3FileKey (s3FileKey: string): boolean {
    const pattern = /^[0-9a-zA-Z!-_.*'()]+$/
    return pattern.test(s3FileKey)
  }

  /**
   * Validates the s3Region parameter.
   * @param {string} s3Region - The s3Region parameter to validate.
   * @returns {boolean} True if the s3Region is a valid S3 region, false otherwise.
   */
  private isValidS3Region (s3Region: string): boolean {
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
      'sa-east-1'
    ]
    return validS3Regions.includes(s3Region)
  }

  /**
   * Validates the dynamodbTableName parameter.
   * @param {string} dynamodbTableName - The dynamodbTableName parameter to validate.
   * @returns {boolean} True if the dynamodbTableName adheres to specified rules, false otherwise.
   */
  private isValidDynamoDBTableName (dynamodbTableName: string): boolean {
    const pattern = /^[a-zA-Z0-9_.-]{3,255}$/
    return pattern.test(dynamodbTableName)
  }

  /**
   * Validates the dynamodbRegion parameter.
   * @param {string} dynamodbRegion - The dynamodbRegion parameter to validate.
   * @returns {boolean} True if the dynamodbRegion is a valid DynamoDB region, false otherwise.
   */
  private isValidDynamoDBRegion (dynamodbRegion: string): boolean {
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
      'sa-east-1'
    ]
    return validDynamoDBRegions.includes(dynamodbRegion)
  }

  /**
   * Extracts the port from the mqttsBroker parameter.
   * @param {string} mqttsBroker - The mqttsBroker parameter.
   * @returns {number} The extracted port number or the default port (8883) if not found.
   */
  private extractMqttsPort (mqttsBroker: string): number {
    const portPattern = /:(\d+)$/
    const match = mqttsBroker.match(portPattern)
    if (match?.[1] !== null && match?.[1] !== undefined) {
      return parseInt(match[1], 10)
    }
    return 8883
  }

  /**
   * Handles incoming Findr backend requests. Validates parameters and sends a request to the orchestrator.
   * Responds with a success message or error details.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  private readonly handleFindrBackendRequest = async (req: Request, res: Response): Promise<void> => {
    function assignDefaultIfEmpty (value: string | undefined | null, defaultValue: string): string {
      // Check if the value is empty, undefined, or null
      if (value === '' || value === undefined || value === null) {
        return defaultValue
      }
      // If not empty, return the original value
      return value
    }

    const {
      deviceId = assignDefaultIfEmpty(req.body.deviceId, 'null_from_customer'),
      source = assignDefaultIfEmpty(req.body.source, 'null_from_customer'),
      destination = assignDefaultIfEmpty(req.body.destination, 'null_from_customer'),
      mqttsBroker = assignDefaultIfEmpty(req.body.mqttsBroker, 'null_from_customer'),
      topic = assignDefaultIfEmpty(req.body.topic, 'null_from_customer'),
      clientId = assignDefaultIfEmpty(req.body.clientId, 'null_from_customer'),
      httpIp = assignDefaultIfEmpty(req.body.httpIp, 'null_from_customer'),
      httpResponseKey = assignDefaultIfEmpty(req.body.httpResponseKey, 'null_from_customer'),
      httpPortNumber = assignDefaultIfEmpty(req.body.httpPortNumber, 'null_from_customer'),
      httpRoute = assignDefaultIfEmpty(req.body.httpRoute, 'null_from_customer'),
      httpRequestInterval = assignDefaultIfEmpty(req.body.httpRequestInterval, 'null_from_customer'),
      s3BucketName = assignDefaultIfEmpty(req.body.s3BucketName, 'null_from_customer'),
      s3FileKey = assignDefaultIfEmpty(req.body.s3FileKey, 'null_from_customer'),
      s3Region = assignDefaultIfEmpty(req.body.s3Region, 'null_from_customer'),
      dynamodbTableName = assignDefaultIfEmpty(req.body.dynamodbTableName, 'null_from_customer'),
      dynamodbRegion = assignDefaultIfEmpty(req.body.dynamodbRegion, 'null_from_customer'),
      certificate = assignDefaultIfEmpty(req.body.certificate, 'null_from_customer')
    } = req.body

    console.log('Received request with parameters:', req.body)

    // Log the updated values
    console.log('Updated parameters:', {
      deviceId,
      source,
      destination,
      mqttsBroker,
      topic,
      clientId,
      httpIp,
      httpResponseKey,
      httpPortNumber,
      httpRoute,
      httpRequestInterval,
      s3BucketName,
      s3FileKey,
      s3Region,
      dynamodbTableName,
      dynamodbRegion,
      certificate
    })

    this.uuid = uuidv4()
    this.messageToSent.uuid = this.uuid
    this.messageToSent.certificate = certificate

    if (!this.isValidDeviceId(deviceId)) {
      res.status(400).send('Invalid deviceId')
      return
    }
    this.messageToSent.deviceId = deviceId

    if (!this.isValidSource(source) || !this.isValidDestination(destination)) {
      res.status(400).send('Invalid source or destination')
      return
    }

    // Validate other parameters
    if (!this.isValidSource(source) || !this.isValidDestination(destination)) {
      res.status(400).send('Invalid source or destination')
      return
    }
    let message = `Data received successfully! DeviceId: ${deviceId}, Source: ${source}, Destination: ${destination}, UUID: ${this.uuid},`

    if (source === 'mqtts') {
      // Validate mqtts-specific parameters
      //
      if (!this.isValidMqttsBroker(mqttsBroker) ||
            !this.isValidTopic(topic) ||
            !this.isValidClientId(clientId)) {
        res.status(400).send('Invalid mqtts parameters')
        return
      } else {
        this.containerPort = this.extractMqttsPort(mqttsBroker)
        this.messageToSent.source = source
        this.messageToSent.mqttsBroker = mqttsBroker
        this.messageToSent.topic = topic
        this.messageToSent.clientId = clientId
        this.messageToSent.containerPort = this.containerPort
        this.messageToSent.httpPortNumber = ''
        this.messageToSent.httpRoute = ''
        message += ` MqttsBroker: ${mqttsBroker}, ContainerPort: ${this.containerPort}, Topic: ${topic}, ClientId: ${clientId},`
      }
    } else if (source === 'http') {
      // Validate http-specific parameters
      if (!this.isValidHttpPortNumber(httpPortNumber) ||
            !this.isValidHttpRoute(httpRoute) ||
            !this.isValidHttpIp(httpIp) ||
            !this.isValidHttpResponseKey(httpResponseKey) ||
            !this.isValidHttpRequestInterval(httpRequestInterval)) {
        res.status(400).send('Invalid http parameters')
        return
      } else {
        this.containerPort = parseInt(httpPortNumber, 10)
        this.messageToSent.source = source
        this.messageToSent.httpIp = httpIp
        this.messageToSent.httpResponseKey = httpResponseKey
        this.messageToSent.httpPortNumber = httpPortNumber
        this.messageToSent.httpRoute = httpRoute
        this.messageToSent.httpRequestInterval = httpRequestInterval
        this.messageToSent.containerPort = this.containerPort
        this.messageToSent.mqttsBroker = ''
        this.messageToSent.topic = ''
        this.messageToSent.clientId = ''
        message += ` HttpIp: ${httpIp}, HttpResponseKey: ${httpResponseKey}, HttpPortNumber: ${httpPortNumber}, HttpRoute: ${httpRoute}, HttpRequestInterval: ${httpRequestInterval}, ContainerPort: ${this.containerPort},`
      }
    }

    if (destination === 's3') {
      // Validate s3-specific parameters
      if (!this.isValidS3BucketName(s3BucketName) ||
            !this.isValidS3FileKey(s3FileKey) ||
            !this.isValidS3Region(s3Region)) {
        res.status(400).send('Invalid s3 parameters')
        return
      } else {
        this.messageToSent.destination = destination
        this.messageToSent.s3BucketName = s3BucketName
        this.messageToSent.s3FileKey = s3FileKey
        this.messageToSent.s3Region = s3Region
        this.messageToSent.dynamodbTableName = ''
        this.messageToSent.dynamodbRegion = ''
        message += ` Destination: ${destination}, S3BucketName: ${s3BucketName}, S3FileKey: ${s3FileKey}, S3Region: ${s3Region},`
      }
    } else if (destination === 'dynamodb') {
      // Validate dynamodb-specific parameters
      if (!this.isValidDynamoDBTableName(dynamodbTableName) ||
            !this.isValidDynamoDBRegion(dynamodbRegion)) {
        res.status(400).send('Invalid dynamodb parameters')
        return
      } else {
        this.messageToSent.destination = destination
        this.messageToSent.dynamodbTableName = dynamodbTableName
        this.messageToSent.dynamodbRegion = dynamodbRegion
        this.messageToSent.s3BucketName = ''
        this.messageToSent.s3FileKey = ''
        this.messageToSent.s3Region = ''
        message += ` Destination: ${destination}, DynamoDBTableName: ${dynamodbTableName}, DynamoDBRegion: ${dynamodbRegion},`
      }
    }

    const localFilePath = '/app/findr_received.txt'
    const caFilePath = '/app/certs/ca.crt'
    this.messageToSent.localFilePath = localFilePath
    this.messageToSent.caFilePath = caFilePath
    console.log('UI parameter validation finished.')

    // Write path and values to Vault
    const vaultUrl = process.env.VAULT_URL ?? ''
    const vaultToken = process.env.VAULT_TOKEN ?? ''
    const vaultPath = `${deviceId}-${this.uuid}`
    const vaultPathToOrchestrator = `kv/${deviceId}-${this.uuid}`
    console.log('vaultPath:', vaultPath)
    const vaultValue = {
      data: this.messageToSent,
      options: {},
      version: 0
    }
    try {
      // const vaultValue = this.messageToSent // This is for chubbyhole
      const vaultClient = new VaultClient(vaultUrl)
      await vaultClient.authenticate(vaultToken)
      const vaultWriteResponse = await vaultClient.writeSecret(vaultPath, vaultValue)
      console.log('vaultWriteResponse:', vaultWriteResponse)
    } catch (error) {
      // Handle errors
      console.error('Error writing to Vault:', error.message)
      res.status(500).send(
        'Cannot pass vault validation, please contact system administrator for help'
      )
    }

    const vaultClient = new VaultClient(vaultUrl)
    await vaultClient.authenticate(vaultToken)
    const awsCredentials = await vaultClient.readSecret('aws-credentials')
    console.log('awsCredentials:', awsCredentials)
    const awsAccessKeyId = awsCredentials.data.data.awsAccessKeyId
    const awsSecretAccessKey = awsCredentials.data.data.awsSecretAccessKey
    const awsSessionToken = awsCredentials.data.data.awsSessionToken
    console.log('awsAccessKeyId:', awsAccessKeyId)

    const vaultPathObject = {
      cluster_config: 'kv/iot-findr-edge',
      cluster_name: 'iot-findr-edge',
      connection_info: vaultPathToOrchestrator,
      namespace: 'findr',
      container_image: 'docker.io/pravnreddy429/findr_adapters:v6',
      aws_access_key_id: awsAccessKeyId,
      aws_secret_access_key: awsSecretAccessKey,
      aws_session_token: awsSessionToken
    }
    try {
      const sendOrchestratorRequestUrl = process.env.FINDR_ORCHESTRATOR_URL ?? ''
      const orchestratorApiClient = new OrchestratorApiClient()
      const sendOrchestratorRequestResponse = await orchestratorApiClient.sendOrchestratorRequest(
        sendOrchestratorRequestUrl,
        // this.messageToSent // This can be passed to orchestrator if all params are needed
        vaultPathObject
      )
      console.log('sendOrchestratorRequestResponse:', sendOrchestratorRequestResponse)
      message += ' are received parameters'
      res.status(sendOrchestratorRequestResponse).send(
        message
      )
    } catch (error) {
      // Handle errors
      console.error('Error sendOrchestratorRequestResponse:', error.message)
      res.status(500).send('Cannot get response from orchestrator, please contact system administrator for help'
      )
    }
  }

  /**
   * Starts the Express server on the specified port.
   */
  public startServer (): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`)
    })
  }
}
// Create an instance of the FindrBackendServer class
const oracle = new Oracle()
// Start the server
oracle.startServer()