import { DownstreamMqttClient, MqttProtocol } from '../src/mqtt-class';

// Replace these values with your specific test parameters
const PROTOCOL: MqttProtocol = 'mqtts';
const BROKER = 'mqtts://10.5.131.138:8883';
const CLIENT_ID = 'Smartphone8883';
const CA_FILE_PATH = '/home/ssm-user/certs/ca.crt';
const TOPIC = 'test';

describe('DownstreamMqttClient Tests', () => {
  let mqttClient: DownstreamMqttClient;

  beforeAll(() => {
    mqttClient = new DownstreamMqttClient(
      BROKER,
      CLIENT_ID,
      CA_FILE_PATH,
      PROTOCOL,
      TOPIC,
      '/home/ssm-user/mqtt_client/dotenvsave'
    );
  });

  it('should connect to the MQTT broker', (done) => {
    mqttClient.client.on('connect', () => {
      done();
    });

    mqttClient.start();
  });

  it('should handle incoming messages', (done) => {
    // Create a new date object in the Mountain Time Zone
    const expectedTime = new Date().toLocaleString('en-US', {
      timeZone: 'America/Denver',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(',', '');

    const testMessage = JSON.stringify({
      companyName: 'abc',
      departmentName: 'xyz',
      deviceId: 123,
      timePublished: expectedTime,
    });

    mqttClient.client.on('connect', () => {
      // Publish a test message to the specified topic
      mqttClient.client.publish(TOPIC, testMessage, (error) => {
        if (error) {
          done.fail('Failed to publish the test message');
        }
      });
    });

    mqttClient.client.on('message', (receivedTopic, message) => {
      if (receivedTopic === TOPIC) {
        const receivedMessage = message.toString();
        expect(receivedMessage).toMatch(/"companyName":"abc","departmentName":"xyz","deviceId":123,"timePublished":"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}"/);
        done();
      }
    });

    mqttClient.start();
  });

  afterAll(() => {
    mqttClient.stop();
  });
});
