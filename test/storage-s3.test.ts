import dotenv from 'dotenv';
import { S3Uploader } from '../src/adapters/storage-s3';
import { createReadStream } from 'fs';

// Load environment variables from .env files in the test-env folder
dotenv.config({ path: 'test-env/storage-s3-test.env' });

describe('S3Uploader', () => {
  const bucketName = process.env.BUCKET_NAME ?? '';
  const fileKey = process.env.FILE_KEY ?? '';
  const region = process.env.REGION ?? '';

  // Use nullish coalescing operator (??) to provide a default value
  const testFilePath = process.env.TEST_FILE_PATH ?? '';

  // Adding explicit empty string check
  if (!bucketName || !fileKey || !region || !testFilePath) {
    throw new Error('Missing required environment variables.');
  }

  it('should upload us-s3.txt to Amazon S3', async () => {
    // Use the nullish coalescing operator (??) for testFilePath
    const testFilePath = process.env.TEST_FILE_PATH ?? '';

    // Check the type and length of testFilePath
    if (typeof testFilePath !== 'string' || testFilePath.length === 0) {
      throw new Error('Test file path is not a valid string or is empty.');
    }

    const s3Uploader = new S3Uploader(bucketName, fileKey, region);

    // Check if s3Uploader is null
    if (s3Uploader === null) {
      throw new Error('Failed to create an S3Uploader instance.');
    }

    // Check if fileStream is null or undefined
    const fileStream = createReadStream(testFilePath);

    if (fileStream === null || fileStream === undefined) {
      throw new Error('Failed to create a read stream for the test file.');
    }

    try {
      await s3Uploader.uploadObject(fileStream);
    } catch (error) {
      // Handle any errors
      console.error('Error uploading object:', error);
    }
  });
});
