import { connect, type IClientOptions, type MqttClient } from 'mqtt'
import { readFileSync } from 'fs'

/**
 * MqttsAdapter is a class for interacting with an MQTT broker using MQTT over TLS (mqtts).
 */
class MqttsAdapter {
  /**
   * MQTT broker address.
   * @type {string}
   * @private
   */
  private readonly mqttsBroker: string

  /**
   * MQTT client instance.
   * @type {MqttClient}
   * @private
   */
  private client: MqttClient

  /**
   * MQTT client ID.
   * @type {string}
   * @private
   */
  private readonly clientId: string

  /**
   * Path to the Certificate Authority (CA) file for secure communication.
   * @type {string}
   * @private
   */
  private readonly caFilePath: string

  /**
   * MQTT topic to subscribe to.
   * @type {string}
   * @private
   */
  private readonly topic: string

  /**
   * Callback function to process received MQTT messages.
   * @type {(receivedTopic: string, message: object) => void}
   * @private
   */
  private readonly receiveMqttsMessage: (receivedTopic: string, message: object) => void

  /**
   * Creates an instance of MqttsAdapter.
   *
   * @param {string} mqttsBroker - MQTT broker address.
   * @param {string} clientId - MQTT client ID.
   * @param {string} caFilePath - Path to the CA file.
   * @param {string} topic - MQTT topic.
   * @param {(receivedTopic: string, message: object) => void} receiveMqttsMessage - Callback function to process received MQTT messages.
   */
  constructor (
    mqttsBroker: string,
    clientId: string,
    caFilePath: string,
    topic: string,
    receiveMqttsMessage: (receivedTopic: string, message: object) => void
  ) {
    this.mqttsBroker = mqttsBroker
    this.clientId = clientId
    this.caFilePath = caFilePath
    this.topic = topic
    this.receiveMqttsMessage = receiveMqttsMessage
  }

  /**
   * Connects the MQTT client to the broker.
   * @private
   */
  private async connectClient (): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const options: IClientOptions = {
        clientId: this.clientId,
        ca: [readFileSync(this.caFilePath)],
        rejectUnauthorized: false
      }

      console.log('Attempting to create a client in mqtts.ts')
      this.client = connect(this.mqttsBroker, options)

      this.client.on('error', (error) => {
        console.error('Error connecting to MQTT broker:', error)
        reject(error)
      })

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker')
        this.subscribeToTopic(this.topic)

        this.client.on('message', (receivedTopic, message) => {
          this.receiveMqttsMessage(receivedTopic, message)
        })

        resolve()
      })
    })
  }

  /**
   * Starts the MQTT client.
   */
  public async startClient (): Promise<void> {
    console.log('Attempting to connectClient() in mqtts.ts')
    await this.connectClient()
    console.log('connectClient() complete in mqtts.ts')
  }

  /**
   * Subscribes to the specified MQTT topic.
   * @param {string} topic - The MQTT topic to subscribe to.
   * @private
   */
  private subscribeToTopic (topic: string): void {
    this.client.subscribe(topic, (err) => {
      if (err === null) {
        console.log(`Subscriber subscribed to ${this.topic} topic`)
      } else {
        console.error(`Error subscribing to ${this.topic} topic: ${err.toString()}`)
      }
    })
  }

  // /**
  //  * Stops the MQTT client.
  //  */
  // public async stopClient(): Promise<void> {
  //   this.client.end((err) => {
  //     if (err !== null && err !== undefined) {
  //       console.error('Error stopping MQTT client:', err)
  //     } else {
  //       console.log('MQTT client stopped successfully')
  //     }
  //   })
  // }
}

export default MqttsAdapter