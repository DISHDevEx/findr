import { connect, IClientOptions } from 'mqtt';
import { MqttClient } from 'mqtt';
import { readFileSync } from 'fs';


class MqttsAdapter {
  private mqttsBroker: string;
  private client: MqttClient;
  // private protocol: MqttProtocol;
  private clientId: string;
  private caFilePath: string;
  private topic: string;
  private receiveMqttsMessage: (receivedTopic: string, message: object) => void;


  /**
   * Creates an instance of MqttAdapter.
   * @param mqttsBroker - MQTT broker address.
  //  * @param protocol - MQTT protocol.
   * @param clientId - MQTT client ID.
   * @param caFilePath - Path to the CA file.
   * @param topic - MQTT topic.
   */
  constructor(
    mqttsBroker: string,
    // protocol: MqttProtocol,
    clientId: string,
    caFilePath: string,
    topic: string,
    receiveMqttsMessage: (receivedTopic: string, message: object) => void,
  ) {
    this.mqttsBroker = mqttsBroker;
    // this.protocol = protocol;
    this.clientId = clientId;
    this.caFilePath = caFilePath;
    this.topic = topic;
    this.receiveMqttsMessage = receiveMqttsMessage;
  }

  private connectClient(): void {
    const options: IClientOptions = {
      clientId: this.clientId,
      ca: [readFileSync(this.caFilePath)],
      rejectUnauthorized: false,
    };

    console.log('try to::: create client in new-mqtts.ts');
    this.client = connect(this.mqttsBroker, options);
    console.log('complete::: create client in new-mqtts.ts');

    console.log('try to ::: Connected to MQTT broker in new-mqtts.ts');
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.subscribeToTopic(this.topic);

      this.client!.on('message', async (receivedTopic, message) => {
        await this.receiveMqttsMessage(receivedTopic, message);
      });
    });
  }

  public startClient(): void {
    console.log('try to::: connectClient() in new-mqtts.ts');
    this.connectClient();
    console.log('complete::: connectClient() in new-mqtts.ts');
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
}

export default MqttsAdapter