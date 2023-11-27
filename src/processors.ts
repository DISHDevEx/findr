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
   * Creates an instance of DataTransferHandler.
   * @param destination - The destination service.
   */
  constructor(destination: string, localSavePath: string) {
    this.destination = destination;
    this.localSavePath = localSavePath;
  }

  public changeFilePath(newFilePath: string) {
    this.localSavePath = newFilePath;
  }

  public saveMessage(message: string) {
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
   * Create a new file at the specified path.
   * @param filePath - The path of the new file to create.
   */
  public createFile(newFilePath: string) {
    writeFile(newFilePath, '', (err) => {
      if (err) {
        console.error('Error creating a new file:', err);
      }
    });
  }

    /**
   * Extracts the year, month, and date from a given timestamp string.
   *
   * @param timePublished - A string representing a timestamp.
   * @returns A string formatted as 'yyyy-mm-dd' representing the extracted year, month, and date.
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
   * Construct a file name by appending the published date to the existing file path.
   * @param pathFile - The path to the local file for saving messages.
   * @param publishedDate - The date to append to the file name.
   * @returns The updated file path with the published date.
   */
  public constructFileName(pathFile: string, publishedDate: string): string {
    const pathSegments = pathFile.split('/');
    const fileName = pathSegments.pop();

    if (typeof fileName === 'string') {
      // fileName is confirmed to be a string in this block
      const parts = fileName.split('.');

      if (parts.length === 1) {
        // If there's no dot, simply append the publishedDate
        return pathFile + '_' + publishedDate;
      } else {
        // If there are dot or dots, insert publishedDate in front of the last dot
        const extension = parts.pop();
        const name = parts.join('.');
        return pathSegments.join('/') + '/' + name + '_' + publishedDate + '.' + extension;
      }
    } else {
      // Handle the case where fileName is not a string (undefined or another type)
      return pathFile + '_' + publishedDate;
    }
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

export default Processors