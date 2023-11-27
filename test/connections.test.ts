import Connection from '../src/connections';
import dotenv from 'dotenv';

dotenv.config({ path: 'connections.env' });

const sourceMqtts = process.env.sourceMqtts
const sourceHttp = process.env.sourceHttp
const destinationS3 = process.env.destinationS3
const destinationDynamodb = process.env.destinationDynamodb
const localFilePathMqtts = process.env.localFilePathMqtts
const localFilePathHttp = process.env.localFilePathHttp
const mqttsBroker = process.env.mqttsBroker
const topic = process.env.topic
const clientId = process.env.clientId
const caFilePath = process.env.caFilePath
const httpPortNumber = process.env.httpPortNumber ? parseInt(process.env.httpPortNumber, 10) : undefined;
const httpRoute = process.env.httpRoute
const s3BucketName = process.env.s3BucketName
const s3FileKeyMqtts = process.env.s3FileKeyMqtts
const s3FileKeyHttp = process.env.s3FileKeyHttp
const s3Region = process.env.s3Region
const dynamodbTableName = process.env.dynamodbTableName
const dynamodbRegion = process.env.dynamodbRegion

describe('Connection', () => {
  describe('startMqtts', () => {
    it('should start MqttsAdapter successfully', async () => {
      const mqttsConfig = {
        destination: destinationS3 ?? '',
        localFilePath: localFilePathMqtts ?? '',
        mqttsBroker: mqttsBroker ?? '',
        clientId: clientId ?? '',
        caFilePath: caFilePath ?? '',
        topic: topic ?? '',
      };

      const connection = new Connection(mqttsConfig);
      await connection.startMqtts();

      // Add assertions based on your expectations, such as checking logs or using Jest matchers
      expect(console.log).toHaveBeenCalledWith('Attempting to start MqttsAdapter in Connection.ts');
      expect(console.log).toHaveBeenCalledWith('MqttsAdapter started successfully in Connection.ts');
    });
  });

//   describe('receiveMqttsMessage', () => {
//     it('should handle received MQTT messages correctly', () => {
//       const config = {
//         destination: 's3',
//         localFilePath: 'test-env/protocol-mqtts-test-local-saved-file.txt',
//         // ... other configurations
//       };

//       const connection = new Connection(config);

//       // Simulate receiving an MQTT message
//       const receivedTopic = 'testTopic';
//       const mockMessage = { timePublished: '2023-11-27 13:46:40' };
//       connection.receiveMqttsMessage(receivedTopic, mockMessage);

//       // Add assertions based on your expectations
//       // Example: expect(console.log).toHaveBeenCalledWith('This destination: s3');
//       // Example: expect(console.log).toHaveBeenCalledWith('This local file path: test-env/protocol-mqtts-test-local-saved-file.txt');
//       // Example: expect(console.log).toHaveBeenCalledWith('yearMonthDate: 2023-11-27');
//       // ... more assertions
//     });
//   });

  describe('startHttp', () => {
    it('should start HttpAdapter successfully', async () => {
      const httpConfig = {
        destination: destinationDynamodb ?? '',
        localFilePath: localFilePathHttp ?? '',
        httpPortNumber: httpPortNumber ?? 3000,
        httpRoute: httpRoute ?? '',
      };

      const connection = new Connection(httpConfig);
      await connection.startHttp();

      // Add assertions based on your expectations
      expect(console.log).toHaveBeenCalledWith('Attempting to start HttpAdapter in Connection.ts');
      expect(console.log).toHaveBeenCalledWith('HttpAdapter started successfully in Connection.ts');
    });
  });

  // Add more test cases for other methods and scenarios
});
