import MqttsAdapter from './adapters/mqtts.js'
import HttpAdapter from './adapters/http.js'
import Processors from './processors.js'

/**
 * Configuration options for creating a Connection instance.
 */
interface AdapterConfig {
  destination: string
  localFilePath: string
  mqttsBroker?: string
  clientId?: string
  caFilePath?: string
  topic?: string
  httpPortNumber?: number
  httpRoute?: string
  s3BucketName?: string
  s3FileKey?: string
  s3Region?: string
  dynamodbTableName?: string
  dynamodbRegion?: string
}

/**
 * Connection class orchestrates the data flow from different sources to various destinations.
 */
class Connection {
  private readonly destination: string
  private readonly localFilePath: string
  private readonly mqttsBroker?: string
  private readonly clientId?: string
  private readonly caFilePath?: string
  private readonly topic?: string
  private readonly httpPortNumber?: number
  private readonly httpRoute?: string
  private readonly s3BucketName?: string
  private readonly s3FileKey?: string
  private readonly s3Region?: string
  private readonly dynamodbTableName?: string
  private readonly dynamodbRegion?: string
  private currentDate: string | null
  private readonly processors: Processors

  /**
   * Creates an instance of Connection.
   * @param {AdapterConfig} config - Configuration options for creating a Connection instance.
   */
  constructor (config: AdapterConfig) {
    this.destination = config.destination
    this.localFilePath = config.localFilePath
    this.mqttsBroker = config.mqttsBroker
    this.clientId = config.clientId
    this.caFilePath = config.caFilePath
    this.topic = config.topic
    this.httpPortNumber = config.httpPortNumber
    this.httpRoute = config.httpRoute
    this.s3BucketName = config.s3BucketName
    this.s3FileKey = config.s3FileKey
    this.s3Region = config.s3Region
    this.dynamodbTableName = config.dynamodbTableName
    this.dynamodbRegion = config.dynamodbRegion
    this.currentDate = null
    this.processors = new Processors(this.destination, this.localFilePath)
  }

  /**
   * Starts the MqttsAdapter for handling MQTT messages.
   */
  public startMqtts (): void {
    const mqttsBroker = this.mqttsBroker ?? ''
    const clientId = this.clientId ?? ''
    const caFilePath = this.caFilePath ?? ''
    const topic = this.topic ?? ''
    const mqttsAdapter = new MqttsAdapter(mqttsBroker, clientId, caFilePath, topic, this.receiveMqttsMessage.bind(this))
    console.log('Attempting to start MqttsAdapter in Connection.ts')
    mqttsAdapter.startClient()
    console.log('MqttsAdapter started successfully in Connection.ts')
  }

  /**
   * Handles received MQTT messages.
   * @param {string} receivedTopic - The topic of the received MQTT message.
   * @param {object} message - The received MQTT message.
   */
  public receiveMqttsMessage (receivedTopic: string, message: object): void {
    // console.log(`Type: ${typeof receivedTopic}, Value: ${receivedTopic}`)
    // console.log(`Type: ${typeof message}, Value: ${message}`)
    console.log(`This destination: ${this.destination}`)
    console.log(`This local file path: ${this.localFilePath}`)
    const receivedMessage: string = (message as any).toString()
    const yearMonthDate = this.processors.extractYearMonthDate(JSON.parse(receivedMessage).timePublished)
    console.log(`yearMonthDate: ${yearMonthDate}`)

    if (this.currentDate !== null) {
      if (this.currentDate === yearMonthDate) {
        console.log('Before this.processors.saveMessage(receivedMessage);')
        this.processors.saveMessage(receivedMessage)
        console.log('After this.processors.saveMessage(receivedMessage);')
      } else {
        console.log('this.currentDate !== yearMonthDate')
        const oldFileName = this.processors.constructFileName(this.localFilePath, this.currentDate)
        console.log(`oldFileName: ${oldFileName}`)
        console.log(`Type: ${typeof this.destination}, Value: ${this.destination}`)
        console.log(`Type: ${typeof this.s3BucketName}, Value: ${this.s3BucketName}`)
        console.log(`Type: ${typeof this.s3FileKey}, Value: ${this.s3FileKey}`)
        console.log(`Type: ${typeof this.s3Region}, Value: ${this.s3Region}`)
        console.log(`Type: ${typeof this.dynamodbTableName}, Value: ${this.dynamodbTableName}`)
        console.log(`Type: ${typeof this.dynamodbRegion}, Value: ${this.dynamodbRegion}`)

        if (this.destination === 's3' && this.s3BucketName !== undefined && this.s3FileKey !== undefined && this.s3Region !== undefined) {
          console.log('Upload to s3 from mqtts')
          const newS3FileKey = this.processors.constructFileName(this.s3FileKey, this.currentDate)
          this.processors.fromIotToS3(oldFileName, this.s3BucketName, newS3FileKey, this.s3Region)
        }
        if (this.destination === 'dynamodb' && this.dynamodbTableName !== undefined && this.dynamodbRegion !== undefined) {
          console.log('Upload to dynamodb from mqtts')
          this.processors.fromIotToDynamoDB(oldFileName, this.dynamodbTableName, this.dynamodbRegion)
        }

        const newFileName = this.processors.constructFileName(this.localFilePath, yearMonthDate)
        this.processors.changeFilePath(newFileName)
        this.processors.createFile(newFileName)
        this.currentDate = yearMonthDate

        this.processors.saveMessage(receivedMessage)
      }
    } else {
      this.currentDate = yearMonthDate

      const newFileName = this.processors.constructFileName(this.localFilePath, this.currentDate)
      this.processors.changeFilePath(newFileName)
      this.processors.createFile(newFileName)
      this.processors.saveMessage(receivedMessage)
    }
  }

  /**
   * Starts the HttpAdapter for handling HTTP messages.
   */
  public startHttp (): void {
    const httpPortNumber = this.httpPortNumber ?? 3000
    const httpRoute = this.httpRoute ?? ''
    const httpAdapter = new HttpAdapter(httpPortNumber, httpRoute, this.receiveHttpMessage.bind(this))
    console.log('Attempting to start HttpAdapter in Connection.ts')
    httpAdapter.startServer()
    console.log('HttpAdapter started successfully in Connection.ts')
  }

  /**
   * Handles received HTTP messages.
   * @param {object} message - The received HTTP message.
   */
  public receiveHttpMessage (message: object): void {
    console.log(`Type: ${typeof message}, Value: ${JSON.stringify(message)}`)
    console.log(`This destination: ${this.destination}`)
    console.log(`This local file path: ${this.localFilePath}`)
    const receivedMessage = JSON.stringify(message)
    const yearMonthDate = this.processors.extractYearMonthDate(JSON.parse(receivedMessage).timePublished)

    if (this.currentDate !== null) {
      if (this.currentDate === yearMonthDate) {
        console.log('Before this.processors.saveMessage(receivedMessage);')
        this.processors.saveMessage(receivedMessage)
        console.log('After this.processors.saveMessage(receivedMessage);')
      } else {
        console.log('this.currentDate !== yearMonthDate')
        const oldFileName = this.processors.constructFileName(this.localFilePath, this.currentDate)
        console.log(`oldFileName: ${oldFileName}`)
        console.log(`Type: ${typeof this.destination}, Value: ${this.destination}`)
        console.log(`Type: ${typeof this.s3BucketName}, Value: ${this.s3BucketName}`)
        console.log(`Type: ${typeof this.s3FileKey}, Value: ${this.s3FileKey}`)
        console.log(`Type: ${typeof this.s3Region}, Value: ${this.s3Region}`)
        console.log(`Type: ${typeof this.dynamodbTableName}, Value: ${this.dynamodbTableName}`)
        console.log(`Type: ${typeof this.dynamodbRegion}, Value: ${this.dynamodbRegion}`)

        if (this.destination === 's3' && this.s3BucketName !== undefined && this.s3FileKey !== undefined && this.s3Region !== undefined) {
          console.log('Upload to s3 from mqtts')
          const newS3FileKey = this.processors.constructFileName(this.s3FileKey, this.currentDate)
          this.processors.fromIotToS3(oldFileName, this.s3BucketName, newS3FileKey, this.s3Region)
        }
        if (this.destination === 'dynamodb' && this.dynamodbTableName !== undefined && this.dynamodbRegion !== undefined) {
          console.log('Upload to dynamodb from mqtts')
          this.processors.fromIotToDynamoDB(oldFileName, this.dynamodbTableName, this.dynamodbRegion)
        }

        const newFileName = this.processors.constructFileName(this.localFilePath, yearMonthDate)
        this.processors.changeFilePath(newFileName)
        this.processors.createFile(newFileName)
        this.currentDate = yearMonthDate

        this.processors.saveMessage(receivedMessage)
      }
    } else {
      this.currentDate = yearMonthDate

      const newFileName = this.processors.constructFileName(this.localFilePath, this.currentDate)
      this.processors.changeFilePath(newFileName)
      this.processors.createFile(newFileName)
      this.processors.saveMessage(receivedMessage)
    }
  }
}

export default Connection