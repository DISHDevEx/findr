// Import necessary modules and classes
import { S3Uploader } from './storage-s3';
import fs from 'fs';

/**
 * AdapterUs class for managing object uploads to an AWS S3 bucket.
 */
class AdapterUs {
  private s3Uploader: S3Uploader;

  /**
   * Creates an instance of AdapterUs with the provided configuration.
   *
   * @param bucketName - The name of the Amazon S3 bucket.
   * @param fileKey - The key to identify the uploaded object within the bucket.
   * @param region - The AWS region where the S3 bucket is located.
   */
  constructor(bucketName: string, fileKey: string, region: string) {
    this.s3Uploader = new S3Uploader(bucketName, fileKey, region);
  }

  /**
   * Uploads an object to Amazon S3 and deletes the local file.
   *
   * @param localFilePath - The path to the local file to be uploaded and deleted.
   * @returns A Promise that resolves when the upload is successful and the local file is deleted, or rejects on error.
   */
  uploadObjectAndDeleteLocalFile(localFilePath: string): Promise<void> {
    // Create a readable stream from the local file
    const fileStream = fs.createReadStream(localFilePath);

    return this.s3Uploader.uploadObject(fileStream)
      .then(() => {
        // After successful upload, delete the local file
        fs.unlinkSync(localFilePath);
      });
  }
}

export { AdapterUs };
