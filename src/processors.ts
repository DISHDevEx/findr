import fs from 'fs';
import { writeFile, existsSync, appendFile } from 'fs';
import { S3Uploader } from './s3.js';
import { DynamoDBUploader } from './dynamodb.js';

/**
 * Represents a handler for transferring data based on source and destination.
 */
class Processors {
  private destination: string;
  private localSavePath: string;

  /**
   * Creates an instance of Processors.
   * @param {string} destination - The destination service.
   * @param {string} localSavePath - The local path to save files.
   */
  constructor(destination: string, localSavePath: string) {
    this.destination = destination;
    this.localSavePath = localSavePath;
  }

  /**
   * Changes the local file path.
   * @param {string} newFilePath - The new local file path.
   */
  public changeFilePath(newFilePath: string): void {
    this.localSavePath = newFilePath;
  }

  /**
   * Saves a message to the local file.
   * @param {string} message - The message to be saved.
   */
  public saveMessage(message: string): void {
    if (existsSync(this.localSavePath)) {
      appendFile(this.localSavePath, message + '\n', (err) => {
        if (err) {
          console.error('Error appending message to file:', err);
        }
      });
    } else {
      writeFile(this.localSavePath, message + '\n', (err) => {
        if (err) {
          console.error('Error creating and writing to file:', err);
        }
      });
    }
  }

  /**
   * Creates a new file at the specified path.
   * @param {string} newFilePath - The path of the new file to create.
   */
  public createFile(newFilePath: string): void {
    writeFile(newFilePath, '', (err) => {
      if (err) {
        console.error('Error creating a new file:', err);
      }
    });
  }

  /**
   * Extracts the year, month, and date from a given timestamp string.
   * @param {string} timePublished - A string representing a timestamp.
   * @returns {string} A string formatted as 'yyyy-mm-dd' representing the extracted year, month, and date.
   * @throws {Error} Will throw an error if the provided timestamp string is invalid.
   *
   * @example
   * ```typescript
   * const timestamp = '2023-11-09T12:30:00Z';
   * const result = extractYearMonthDate(timestamp);
   * console.log(result); // Output: '2023-11-09'
   * ```
   */
  public extractYearMonthDate(timePublished: string): string {
    const date = new Date(timePublished);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid timestamp format. Please provide a valid ISO string.');
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Constructs a file name by appending the published date to the existing file path.
   * @param {string} pathFile - The path to the local file for saving messages.
   * @param {string} publishedDate - The date to append to the file name.
   * @returns {string} The updated file path with the published date.
   */
  public constructFileName(pathFile: string, publishedDate: string): string {
    const pathSegments = pathFile.split('/');
    const fileName = pathSegments.pop();

    if (typeof fileName === 'string') {
      const parts = fileName.split('.');

      if (parts.length === 1) {
        return pathFile + '_' + publishedDate;
      } else {
        const extension = parts.pop();
        const name = parts.join('.');
        return pathSegments.join('/') + '/' + name + '_' + publishedDate + '.' + extension;
      }
    } else {
      return pathFile + '_' + publishedDate;
    }
  }

  /**
   * Transfers data from 'mqtts' source to 's3' destination.
   * @param {string} localFilePath - The path to the local file to be transferred.
   * @param {string} s3Bucket - The S3 bucket name.
   * @param {string} s3FileKey - The S3 file key.
   * @param {string} s3Region - The AWS region.
   * @throws {Error} If the source-destination combination is unsupported.
   */
  async fromIotToS3(localFilePath: string, s3Bucket: string, s3FileKey: string, s3Region: string): Promise<void> {
    if (this.destination === 's3') {
      const s3Uploader = new S3Uploader(s3Bucket, s3FileKey, s3Region);
      const fileStream = fs.createReadStream(localFilePath);

      try {
        await s3Uploader.uploadObject(fileStream);
        fs.unlinkSync(localFilePath); // After successful upload, delete the local file
      } catch (error) {
        console.error('Error during upload:', error);
      }
    } else {
      throw new Error('Failed to upload to s3');
    }
  }

  /**
   * Transfers data from 'mqtts' source to 'dynamodb' destination.
   * @param {string} localFilePath - The path to the local file to be transferred.
   * @param {string} tableName - The DynamoDB table name.
   * @param {string} dynamoDBRegion - The DynamoDB region.
   * @throws {Error} If the source-destination combination is unsupported.
   */
  async fromIotToDynamoDB(localFilePath: string, tableName: string, dynamoDBRegion: string): Promise<void> {
    if (this.destination === 'dynamodb') {
      const dynamoDBUploader = new DynamoDBUploader(localFilePath, tableName, dynamoDBRegion);
      console.log('Uploading to DynamoDB in Processors.ts');
      try {
        await dynamoDBUploader.uploadToDynamoDB();
        fs.unlinkSync(localFilePath); // After successful upload, delete the local file
      } catch (error) {
        console.error('Error during upload:', error);
      }
    } else {
      throw new Error('Failed to upload to DynamoDB');
    }
  }
}

export default Processors;
