/**
 * DataTransferHandler Test
 *
 * This test suite validates the behavior of the DataTransferHandler class when transferring data
 * from MQTT-S to S3 and HTTP to DYNAMODB.
 */
import { DataTransferHandler } from '../src/storage-index'; // Import the DataTransferHandler class
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: 'test-env/test.env' });

// Load values from the .env file
const source_mqtts = process.env.SOURCE_MQTTS ?? '';
const destination_s3 = process.env.DESTINATION_S3 ?? '';
const source_http = process.env.SOURCE_HTTP ?? '';
const destination_dynamodb = process.env.DESTINATION_DYNAMODB ?? '';
const localFilePath = process.env.LOCAL_FILE_PATH ?? '';

// Arrange
const s3Bucket = process.env.S3_BUCKET ?? '';
const s3FileKey = process.env.S3_FILE_KEY ?? '';
const s3Region = process.env.S3_REGION ?? '';
const dynamodbTableName = process.env.DYNAMODB_TABLE_NAME ?? '';
const dynamodbRegion = process.env.DYNAMODB_REGION ?? '';

describe('DataTransferHandler', () => {
  /**
   * Test the data transfer from MQTT-S to S3.
   *
   * It loads values from the .env file, including source, destination, and local file path.
   * Then, it initializes the S3 bucket, file key, and region.
   * Finally, it invokes the data transfer and expects it to complete without errors.
   */
  it('should transfer data from MQTT-S to S3', async () => {


    const dataTransferHandler = new DataTransferHandler(source_mqtts, destination_s3); // Use a different variable name
    
    // Act & Assert
    // Expect that the function completes without throwing an error
    await expect(async () => {
        await dataTransferHandler.fromIotToS3(localFilePath, s3Bucket, s3FileKey, s3Region);
    }).not.toThrowError();
  });

  it('should transfer data from MQTT-S to S3', async () => {


    const dataTransferHandler = new DataTransferHandler(source_http, destination_dynamodb); // Use a different variable name
    
    // Act & Assert
    // Expect that the function completes without throwing an error
    await expect(async () => {
        await dataTransferHandler.fromIotToDynamoDB(dynamodbTableName, localFilePath, dynamodbRegion);
    }).not.toThrowError();
  });
});
