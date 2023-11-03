import { S3Uploader } from './us-s3-class.js';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const localFilePath = process.env.LOCAL_FILE_PATH;

// Initialize an S3Uploader instance with configuration from environment variables
const s3Uploader = new S3Uploader(
  process.env.BUCKET_NAME,   // The name of the Amazon S3 bucket.
  process.env.FILE_KEY,      // The key to identify the uploaded object within the bucket.
  process.env.REGION         // The AWS region where the S3 bucket is located.
  // Additional parameters can be added as needed.
);

/**
 * Uploads an object to Amazon S3 based on the provided local file path.
 */
const uploadObject = () => {
  // Create a readable stream from the local file
  const fileStream = fs.createReadStream(localFilePath);

  // Upload the object to Amazon S3
  s3Uploader.uploadObject(fileStream)
    .then(() => {
      console.log('Object uploaded successfully.');
    })
    .catch((error) => {
      console.error('Failed to upload the object:', error);
    });
};

// Perform the object upload
uploadObject();
