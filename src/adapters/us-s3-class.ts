import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

/**
 * S3Uploader is a class for uploading objects to an Amazon S3 bucket.
 */
export class S3Uploader {
  private s3: S3Client;
  private bucketName: string;
  private fileKey: string;

  /**
   * Constructs an S3Uploader instance.
   *
   * @param {string} bucketName - The name of the Amazon S3 bucket.
   * @param {string} fileKey - The key to identify the uploaded object within the bucket.
   * @param {string} region - The AWS region where the S3 bucket is located.
   */
  constructor(bucketName: string, fileKey: string, region: string) {
    this.s3 = new S3Client({ region });
    this.bucketName = bucketName;
    this.fileKey = fileKey;
  }

  /**
   * Uploads an object to the specified Amazon S3 bucket.
   *
   * @param {Buffer | Readable} data - The data to be uploaded, either as a Buffer or Readable stream.
   * @returns {Promise<void>} A Promise that resolves when the upload is successful, or rejects on error.
   */
  async uploadObject(data: Buffer | Readable): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: this.fileKey,
      Body: data,
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3.send(command);
      console.log(`Object uploaded to S3: s3://${this.bucketName}/${this.fileKey}`);
    } catch (error) {
      console.error(`Error uploading object to S3: ${error.message}`);
      throw error;
    }
  }
}
