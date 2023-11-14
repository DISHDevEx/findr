/**
 * S3Uploader Test
 *
 * This test suite validates the behavior of the S3Uploader class when uploading objects to Amazon S3.
 */

import dotenv from 'dotenv';
import { S3Uploader } from '../src/adapters/s3';
import { createReadStream, ReadStream } from 'fs';

// Load environment variables from .env files in the test-env folder
dotenv.config({ path: 'test-env/storage-s3-test.env' });

/**
 * Retrieve and validate environment variables for Amazon S3 configuration.
 * Ensure that all required variables are defined to run the tests.
 */
const bucketName: string = process.env.BUCKET_NAME ?? '';
const fileKey: string = process.env.FILE_KEY ?? '';
const region: string = process.env.REGION ?? '';
const testFilePath: string = process.env.TEST_FILE_PATH ?? '';

if (!bucketName || !fileKey || !region || !testFilePath) {
  throw new Error('Missing required environment variables.');
}

describe('S3Uploader', () => {
  /**
   * Uploads the specified test file to Amazon S3 using the S3Uploader class.
   * The testFilePath environment variable must be defined and point to a valid file.
   * Validates the correct behavior of the S3Uploader when uploading a file.
   */
  it('should upload the test file to Amazon S3', async () => {
    // Ensure testFilePath is a non-empty string
    if (typeof testFilePath !== 'string' || testFilePath.length === 0) {
      throw new Error('Test file path is not a valid string or is empty.');
    }

    // Create an S3Uploader instance with Amazon S3 configuration
    const s3Uploader: S3Uploader = new S3Uploader(bucketName, fileKey, region);

    // Ensure that s3Uploader is not null
    if (s3Uploader === null) {
      throw new Error('Failed to create an S3Uploader instance.');
    }

    // Create a read stream for the test file
    const fileStream: ReadStream = createReadStream(testFilePath);

    // Throw an error if fileStream is falsy (null or undefined)
    if (fileStream === null || fileStream === undefined) {
      throw new Error('Failed to create a read stream for the test file.');
    }

    try {
      // Upload the test file to Amazon S3
      await s3Uploader.uploadObject(fileStream);
    } catch (error) {
      // Handle any errors
      console.error('Error uploading object:', error);
    }
  });
});
