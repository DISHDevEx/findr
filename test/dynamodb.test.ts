/**
 *  Test
 *
 * This test suite validates the behavior of the  class when uploading objects to Amazon .
 */

import dotenv from 'dotenv';
import { DynamoDBUploader } from '../src/adapters/dynamodb';

// Load environment variables from .env files in the test-env folder
dotenv.config({ path: 'test-env/test.env' });

/**
 * Retrieve and validate environment variables for Amazon  configuration.
 * Ensure that all required variables are defined to run the tests.
 */
const tableName: string = process.env.DYNAMODB_TABLE_NAME ?? '';
const filePath: string = process.env.LOCAL_FILE_PATH ?? '';
const region: string = process.env.DYNAMODB_REGION ?? '';

if (!tableName || !filePath || !region) {
  throw new Error('Missing required environment variables.');
}

describe('DynamodbUploader', () => {
  /**

   */
  it('should upload the test file to Amazon DynamoDB', async () => {
    // Ensure testFilePath is a non-empty string
    if (typeof filePath !== 'string' || filePath.length === 0) {
      throw new Error('Test file path is not a valid string or is empty.');
    }

    // Create 
    const dynamoDBUploader: DynamoDBUploader = new DynamoDBUploader(tableName, filePath, region);

    // Ensure that  is not null
    if (dynamoDBUploader === null) {
      throw new Error('Failed to create an  instance.');
    }

    try {
      // Upload the test file to Amazon 
      await dynamoDBUploader.uploadToDynamoDB();
    } catch (error) {
      // Handle any errors
      console.error('Error uploading object:', error);
    }
  });
});
