import Connection from '../src/connections';
import dotenv from 'dotenv';

// Mock console.log
console.log = jest.fn();

dotenv.config({ path: 'connections.env' });

const sourceMqtts = process.env.sourceMqtts;
const sourceHttp = process.env.sourceHttp;
const destinationS3 = process.env.destinationS3;
const destinationDynamodb = process.env.destinationDynamodb;
const localFilePathMqtts = process.env.localFilePathMqtts;
const localFilePathHttp = process.env.localFilePathHttp;
const mqttsBroker = process.env.mqttsBroker;
const topic = process.env.topic;
const clientId = process.env.clientId;
const caFilePath = process.env.caFilePath;
const httpPortNumber = process.env.httpPortNumber ? parseInt(process.env.httpPortNumber, 10) : undefined;
const httpRoute = process.env.httpRoute;
const s3BucketName = process.env.s3BucketName;
const s3FileKeyMqtts = process.env.s3FileKeyMqtts;
const s3FileKeyHttp = process.env.s3FileKeyHttp;
const s3Region = process.env.s3Region;
const dynamodbTableName = process.env.dynamodbTableName;
const dynamodbRegion = process.env.dynamodbRegion;

describe('Connection', () => {
  let mqttsConnection: Connection;
  let httpConnection: Connection;

  beforeAll(() => {
    // Create connections before all tests
    const mqttsConfig = {
      destination: destinationS3 ?? '',
      localFilePath: localFilePathMqtts ?? '',
      mqttsBroker: mqttsBroker ?? '',
      clientId: clientId ?? '',
      caFilePath: caFilePath ?? '',
      topic: topic ?? '',
    };

    mqttsConnection = new Connection(mqttsConfig);

    const httpConfig = {
      destination: destinationDynamodb ?? '',
      localFilePath: localFilePathHttp ?? '',
      httpPortNumber: httpPortNumber ?? 3000,
      httpRoute: httpRoute ?? '',
    };

    httpConnection = new Connection(httpConfig);
  });

  describe('startMqtts', () => {
    it('should start MqttsAdapter successfully', async () => {
      await mqttsConnection.startMqtts();
      expect(console.log).toHaveBeenCalledWith('MqttsAdapter started successfully in Connection.ts');
    });
  });

  describe('startHttp', () => {
    it('should start HttpAdapter successfully', async () => {
      await httpConnection.startHttp();
      expect(console.log).toHaveBeenCalledWith('HttpAdapter started successfully in Connection.ts');
    });
  });

  describe('receiveMqttsMessage', () => {
    it('should handle received MQTT message and save to file when currentDate is null', async () => {
      // Define the structure of the message object
      interface Message {
        companyName: string
        departmentName: string
        deviceId: string
        // Get the current time in Denver and format it
        timePublished: string
    }

      // Create a variable of type Message
      const message: Message = {
        "companyName": "abc",
        "departmentName": "xyz",
        "deviceId": "123",
        "timePublished": "2023-11-28 12:34:56"
      };
      const jsonMessage = JSON.stringify(message)
      const jsonParse = JSON.parse(jsonMessage)

      console.log(`test message: ${message}`);
      await mqttsConnection.receiveMqttsMessage('fake_topic', jsonParse);
      expect(console.log).toHaveBeenCalledWith('receiveMqttsMessage complete.');

    });

    it('should handle received MQTT message and upload to S3 when destination is s3', async () => {
      // Mock necessary methods and properties
      // ...

      // Simulate receiving an MQTT message
      // ...

      // Assert the expected behavior
      // ...
    });

    // Add more test cases for other scenarios
  });

  describe('receiveHttpMessage', () => {
    it('should handle received HTTP message and save to file when currentDate is null', async () => {
      // Mock the processors.saveMessage method
      interface Message {
        companyName: string
        departmentName: string
        deviceId: string
        // Get the current time in Denver and format it
        timePublished: string
      }

      // Create a variable of type Message
      const message: Message = {
        companyName: 'abc',
        departmentName: 'xyz',
        deviceId: '123',
        // Get the current time in Denver and format it
        timePublished: '2023-11-28 12:12:12',
      };

      await httpConnection.receiveHttpMessage(message);
      expect(console.log).toHaveBeenCalledWith('receiveHttpMessage complete.');
    });

    it('should handle received HTTP message and upload to S3 when destination is s3', async () => {
      // Mock necessary methods and properties
      // ...

      // Simulate receiving an HTTP message
      // ...

      // Assert the expected behavior
      // ...
    });

    // Add more test cases for other scenarios
  });

  // afterAll(async () => {
  //   // Stop MqttsAdapter and close HttpAdapter after all tests
  //   await mqttsConnection.stopMqtts() // Stop MqttsAdapter
  //   await httpConnection.stopHttp()   // Close HttpAdapter server
  // })
  // Add more test cases for other methods and scenarios
});
