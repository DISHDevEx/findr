import { AdapterUs } from '../src/adapter-us'; // Adjust the import path as needed
import fs from 'fs'; // Import the fs module

describe('AdapterUs Tests', () => {
  it('should upload an object to AWS S3 and delete the local file', async () => {
    // Replace these values with your specific test parameters
    const bucketName = 'mqtt-save';
    const fileKey = 'up/dotenv.txt';
    const region = 'us-east-1';
    const localFilePath = '/home/ssm-user/mqtt_client/dotenvsave.txt';

    // Create an instance of the AdapterUs class with the test parameters
    const adapter = new AdapterUs(bucketName, fileKey, region);

    // Call the uploadObjectAndDeleteLocalFile method and assert the result
    await expect(adapter.uploadObjectAndDeleteLocalFile(localFilePath)).resolves.not.toThrow();
  });
});