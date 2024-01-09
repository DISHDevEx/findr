import MqttsAdapter from './protocols/mqtts.js'
import HttpAdapter from './protocols/http.js'
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
  httpIp?: string
  httpResponseKey?: string
  httpPortNumber?: number
  httpRoute?: string
  httpRequestInterval?: number
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
  private readonly httpIp?: string
  private readonly httpResponseKey?: string
  private readonly httpPortNumber?: number
  private readonly httpRoute?: string
  private readonly httpRequestInterval?: number
  private readonly s3BucketName?: string
  private readonly s3FileKey?: string
  private readonly s3Region?: string
  private readonly dynamodbTableName?: string
  private readonly dynamodbRegion?: string
  private currentDate: string | null
  private readonly processors: Processors
  // private mqttsAdapter?: MqttsAdapter
  // private httpAdapter?: HttpAdapter

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
    this.httpIp = config.httpIp
    this.httpResponseKey = config.httpResponseKey
    this.httpPortNumber = config.httpPortNumber
    this.httpRoute = config.httpRoute
    this.httpRequestInterval = config.httpRequestInterval
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

  // /**
  //  * Stops the MqttsAdapter client.
  //  */
  // public async stopMqtts(): Promise<void> {
  //   await this.mqttsAdapter?.stopClient()
  // }

  /**
   * Handles received MQTT messages.
   * @param {string} receivedTopic - The topic of the received MQTT message.
   * @param {object} message - The received MQTT message.
   */
  public async receiveMqttsMessage (receivedTopic: string, message: object): Promise<void> {
    console.log(`This destination: ${this.destination}`)
    console.log(`This local file path: ${this.localFilePath}`)
    const receivedMessage: string = (message as any).toString()
    const yearMonthDate = this.processors.extractYearMonthDate(JSON.parse(receivedMessage).timePublished)
    console.log(`yearMonthDate: ${yearMonthDate}`)

    if (this.currentDate !== null) {
      if (this.currentDate === yearMonthDate) {
        console.log('Before this.processors.saveMessage(receivedMessage);')
        await this.processors.saveMessage(receivedMessage).catch(() => {})
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
          await this.processors.fromIotToS3(oldFileName, this.s3BucketName, newS3FileKey, this.s3Region).catch(() => {})
        }
        if (this.destination === 'dynamodb' && this.dynamodbTableName !== undefined && this.dynamodbRegion !== undefined) {
          console.log('Upload to dynamodb from mqtts')
          await this.processors.fromIotToDynamoDB(oldFileName, this.dynamodbTableName, this.dynamodbRegion).catch(() => {})
        }

        const newFileName = this.processors.constructFileName(this.localFilePath, yearMonthDate)
        this.processors.changeFilePath(newFileName)
        await this.processors.createFile(newFileName).catch(() => {})
        this.currentDate = yearMonthDate

        await this.processors.saveMessage(receivedMessage).catch(() => {})
      }
    } else {
      this.currentDate = yearMonthDate

      const newFileName = this.processors.constructFileName(this.localFilePath, this.currentDate)
      this.processors.changeFilePath(newFileName)
      await this.processors.createFile(newFileName).catch(() => {})
      await this.processors.saveMessage(receivedMessage).catch(() => {})
    }
    console.log('receiveMqttsMessage complete.')
  }

  /**
   * Starts the HttpAdapter for handling HTTP messages.
   */
  public startHttp (): void {
    const httpPortNumber = this.httpPortNumber ?? 3000
    const httpRoute = this.httpRoute ?? ''
    const httpIp = this.httpIp ?? ''
    const httpResponseKey = this.httpResponseKey ?? ''
    const httpRequestInterval = this.httpRequestInterval ?? 1000
    const httpAdapter = new HttpAdapter(httpIp, httpResponseKey, httpPortNumber, httpRoute, httpRequestInterval, this.receiveHttpMessage.bind(this))
    console.log('Attempting to start HttpAdapter in Connection.ts')
    httpAdapter.startServer()
    console.log('HttpAdapter started successfully in Connection.ts')
  }

  // /**
  //  * Stops the HttpAdapter server.
  //  */
  // public async stopHttp(): Promise<void> {
  //   await this.httpAdapter?.stopHttpServer()
  // }

  /**
   * Handles received HTTP messages.
   * @param {object} message - The received HTTP message.
   */
  public async receiveHttpMessage (message: object): Promise<void> {
    console.log(`Type: ${typeof message}, Value: ${JSON.stringify(message)}`)
    console.log(`This destination: ${this.destination}`)
    console.log(`This local file path: ${this.localFilePath}`)
    const receivedMessage = JSON.stringify(message)
    const yearMonthDate = this.processors.extractYearMonthDate(JSON.parse(receivedMessage).timePublished)

    if (this.currentDate !== null) {
      if (this.currentDate === yearMonthDate) {
        console.log('Before this.processors.saveMessage(receivedMessage);')
        await this.processors.saveMessage(receivedMessage).catch(() => {})
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
          await this.processors.fromIotToS3(oldFileName, this.s3BucketName, newS3FileKey, this.s3Region).catch(() => {})
        }
        if (this.destination === 'dynamodb' && this.dynamodbTableName !== undefined && this.dynamodbRegion !== undefined) {
          console.log('Upload to dynamodb from mqtts')
          await this.processors.fromIotToDynamoDB(oldFileName, this.dynamodbTableName, this.dynamodbRegion).catch(() => {})
        }

        const newFileName = this.processors.constructFileName(this.localFilePath, yearMonthDate)
        this.processors.changeFilePath(newFileName)
        await this.processors.createFile(newFileName).catch(() => {})
        this.currentDate = yearMonthDate

        await this.processors.saveMessage(receivedMessage).catch(() => {})
      }
    } else {
      this.currentDate = yearMonthDate

      const newFileName = this.processors.constructFileName(this.localFilePath, this.currentDate)
      this.processors.changeFilePath(newFileName)
      await this.processors.createFile(newFileName).catch(() => {})
      await this.processors.saveMessage(receivedMessage).catch(() => {})
    }
    console.log('receiveHttpMessage complete.')
  }
}

export default Connection