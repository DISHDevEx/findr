import { S3Uploader } from '../src/us-s3-class'; // Adjust the import path as needed
import { Readable } from 'stream';
import { createReadStream } from 'fs';

describe('S3Uploader', () => {
  const bucketName = 'mqtt-save';
  const fileKey = 'up/uss3clasststestsaved.txt';
  const region = 'us-east-1';

  it('should upload us-s3.txt to Amazon S3', async () => {
    const s3Uploader = new S3Uploader(bucketName, fileKey, region);

    // Replace 'us-s3.txt' with the actual path to your file
    const fileStream = createReadStream('./test/us-s3.txt');

    // You can use either a Buffer or Readable stream as data for uploadObject
    const data = fileStream;

    try {
      await s3Uploader.uploadObject(data);
    } catch (error) {
      // Handle any errors
      console.error('Error uploading object:', error);
    }
  });
});
