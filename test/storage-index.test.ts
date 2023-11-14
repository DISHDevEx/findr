/**
 * DataTransferHandler Test
 *
 * This test suite validates the behavior of the DataTransferHandler class when transferring data
 * from MQTT-S to S3.
 */
import { DataTransferHandler } from '../src/storage-index'; // Import the DataTransferHandler class
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: 'test-env/storage-index-test.env' });

describe('DataTransferHandler', () => {
  /**
   * Test the data transfer from MQTT-S to S3.
   *
   * It loads values from the .env file, including source, destination, and local file path.
   * Then, it initializes the S3 bucket, file key, and region.
   * Finally, it invokes the data transfer and expects it to complete without errors.
   */
  it('should transfer data from MQTT-S to S3', async () => {
    // Load values from the .env file
    const source = process.env.SOURCE ?? '';
    const destination = process.env.DESTINATION ?? '';
    const localFilePath = process.env.LOCAL_FILE_PATH ?? '';
    
    // Arrange
    const s3Bucket = process.env.S3_BUCKET ?? '';
    const s3FileKey = process.env.S3_FILE_KEY ?? '';
    const s3Region = process.env.S3_REGION ?? '';

    const dataTransferHandler = new DataTransferHandler(source, destination); // Use a different variable name
    
    // Act & Assert
    // Expect that the function completes without throwing an error
    await expect(async () => {
        await dataTransferHandler.fromMqttsToS3(localFilePath, s3Bucket, s3FileKey, s3Region);
    }).not.toThrowError();
  });
});
