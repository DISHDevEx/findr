import fs from 'fs';
import { S3Uploader } from '../adapters/s3.js';
import { DynamoDBUploader } from '../adapters/dynamodb.js';

/**
 * Represents a handler for transferring data based on source and destination.
 */
class Processors {
  private destination: string;

  /**
   * Creates an instance of DataTransferHandler.
   * @param destination - The destination service.
   */
  constructor(destination: string) {
    this.destination = destination;
  }

  /**
   * Transfers data from 'mqtts' source to 's3' destination.
   *
   * @param localFilePath - The path to the local file to be transferred.
   * @param s3Bucket - The S3 bucket name.
   * @param s3FileKey - The S3 file key.
   * @param s3Region - The AWS region.
   * @throws Error if the source-destination combination is unsupported.
   */
  async fromIotToS3(
    localFilePath: string,
    s3Bucket: string,
    s3FileKey: string,
    s3Region: string
  ): Promise<void> {
    if (this.destination === 's3') {
      const s3Uploader = new S3Uploader(s3Bucket, s3FileKey, s3Region);
      const fileStream = fs.createReadStream(localFilePath);

      try {
        await s3Uploader.uploadObject(fileStream);
        // After successful upload, delete the local file
        fs.unlinkSync(localFilePath);
      } catch (error) {
        // Handle any potential errors here
        console.error('Error during upload:', error);
      }
    } else {
      throw new Error('Failed to upload to s3');
    }
  }


  async fromIotToDynamoDB(
    localFilePath: string,
    tableName: string,
    dynamoDBRegion: string
  ): Promise<void> {
    if (this.destination === 'dynamodb') {
      const dynamoDBUploader = new DynamoDBUploader(localFilePath, tableName, dynamoDBRegion);
      console.log('uploading to dynamodb in processor.ts');
      try {
        await dynamoDBUploader.uploadToDynamoDB();
        // After successful upload, delete the local file
        fs.unlinkSync(localFilePath);
      } catch (error) {
        // Handle any potential errors here
        console.error('Error during upload:', error);
      }
    } else {
      throw new Error('Failed to upload to dynamodb');
    }
  }
}

export { Processors };