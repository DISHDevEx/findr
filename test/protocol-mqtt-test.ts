/**
 * MQTT Test
 *
 * This test suite validates the behavior of the MqttAdapter class when transferring data
 * from MQTT-S to storage services.
 */
import dotenv from 'dotenv';
import path from 'path';
import MqttAdapter from '../src/adapters/mqtt';
import { MqttProtocol } from 'mqtt';
import { promises as fsPromises} from 'fs';
import { S3 } from 'aws-sdk';
import fs from 'fs';

// Load environment variables from .env files in the test-env folder
dotenv.config({ path: 'test-env/protocol-mqtt-test.env' });



describe('MqttAdapter', () => {

    const SOURCE = process.env.SOURCE ?? '';
    const DESTINATION = process.env.DESTINATION ?? '';
    const PROTOCOL: MqttProtocol = process.env.PROTOCOL as MqttProtocol ?? '';
    const MESSAGE_FILE_PATH = process.env.MESSAGE_FILE_PATH ?? '';
    const CLIENT_ID = process.env.CLIENT_ID ?? '';
    const MQTT_BROKER = process.env.MQTT_BROKER ?? '';
    const CA_FILE_PATH = process.env.CA_FILE_PATH ?? '';
    const S3_BUCKET = process.env.S3_BUCKET ?? '';
    const S3_FILE_KEY = process.env.S3_FILE_KEY ?? '';
    const S3_REGION = process.env.S3_REGION ?? '';
    const TOPIC = process.env.TOPIC ?? '';


  const mqttAdapterConfig = {
    source: SOURCE!,
    destination: DESTINATION!,
    protocol: PROTOCOL!,
    messageFilePath: MESSAGE_FILE_PATH!,
    clientId: CLIENT_ID!,
    mqttBroker: MQTT_BROKER!,
    caFilePath: CA_FILE_PATH!,
    s3Bucket: S3_BUCKET,
    s3FileKey: S3_FILE_KEY,
    s3Region: S3_REGION,
    topic: TOPIC!,
  };

  let mqttAdapter: MqttAdapter;
  const currentDirectory = process.cwd();
  const messageA = '{"companyName":"abc","departmentName":"xyz","deviceId":123,"timePublished":"2023-11-07 09:57:16"}';
  const messageB = '{"companyName":"abc","departmentName":"xyz","deviceId":123,"timePublished":"2023-11-07 09:57:17"}';
  const messageC = '{"companyName":"abc","departmentName":"xyz","deviceId":123,"timePublished":"2023-11-08 09:57:16"}';

  const expectedDateA = messageA ? JSON.parse(messageA).timePublished.split(' ')[0] : ''; // Extract date from messageA
  const expectedFileNameA = `${path.dirname(MESSAGE_FILE_PATH)}/${path.basename(MESSAGE_FILE_PATH, path.extname(MESSAGE_FILE_PATH))}_${expectedDateA}${path.extname(MESSAGE_FILE_PATH)}`;
  const filePathA = path.join(currentDirectory, expectedFileNameA);

  beforeAll(() => {
    mqttAdapter = new MqttAdapter(mqttAdapterConfig);
  });

  afterAll(async () => {
    // End the MQTT client connection after all tests
    mqttAdapter.endClient();
    // Construct the file path to be deleted
    const fileToDelete = path.join(currentDirectory, 'test-env', 'protocol-mqtt-test-local-saved-file_2023-11-08.txt');

    try {
        // Try to unlink (delete) the file
        await fs.promises.unlink(fileToDelete);
        console.log(`File deleted: ${fileToDelete}`);
    } catch (error) {
        // Handle errors, e.g., file not found
        console.error(`Error deleting file: ${fileToDelete}`, error);
    }
  });

  it('should start the MQTT client', async () => {
    // Call the startClient method
    mqttAdapter.startClient();

    // Wait for the client to connect (you might need to adjust the delay)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify that the client is connected
    expect(mqttAdapter['client'].connected).toBe(true);

  });

  it('should handle incoming messages and create new files', async () => {

    // Use the same MQTT client instance to publish messages
    const messageBufferA = Buffer.from(messageA);
    mqttAdapter.handleMessage(TOPIC, messageBufferA);

    // Wait for messageA to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Wait for messageA to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Verify the existence of the file and its content after messageA
    try {
        await fsPromises.access(filePathA);
        // File exists
    } catch (error) {
        throw new Error(`File does not exist: ${filePathA}`);
    }
  

    // // Verify the existence of the file and its content after messageA
    // expect(fsPromises.stat(filePathA)).resolves.not.toBeTruthy(); // Ensure the file exists

    // Verify the content of the file after messageA
    const fileContentA = await fsPromises.readFile(filePathA, 'utf-8');
    const expectedContentA = `${JSON.stringify(JSON.parse(messageA))}\n`;

    expect(fileContentA).toEqual(expectedContentA);
    });

  it('should append new message to existing file', async () => {

    // Use the same MQTT client instance to publish messages
    const messageBufferB = Buffer.from(messageB);
    mqttAdapter.handleMessage(TOPIC, messageBufferB);

    // Wait for messageA to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Wait for messageA to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Verify the existence of the file and its content after messageA
    try {
        await fsPromises.access(filePathA);
        // File exists
    } catch (error) {
        throw new Error(`File does not exist: ${filePathA}`);
    }
    

    // // Verify the existence of the file and its content after messageA
    // expect(fsPromises.stat(filePathA)).resolves.not.toBeTruthy(); // Ensure the file exists

    // Verify the content of the file after messageA
    const fileContentB = await fsPromises.readFile(filePathA, 'utf-8');
    const expectedContentB = `${JSON.stringify(JSON.parse(messageA))}\n${JSON.stringify(JSON.parse(messageB))}\n`;

    expect(fileContentB).toEqual(expectedContentB);
    });

  it('should upload and delete old file, and create new file with new message', async () => {

    // Use the same MQTT client instance to publish messages
    const messageBufferC = Buffer.from(messageC);
    mqttAdapter.handleMessage(TOPIC, messageBufferC);

    // Wait for messageA to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const expectedDateC = messageC ? JSON.parse(messageC).timePublished.split(' ')[0] : ''; // Extract date from messageA
    const expectedFileNameC = `${path.dirname(MESSAGE_FILE_PATH)}/${path.basename(MESSAGE_FILE_PATH, path.extname(MESSAGE_FILE_PATH))}_${expectedDateC}${path.extname(MESSAGE_FILE_PATH)}`;
    const filePathC = path.join(currentDirectory, expectedFileNameC);
    
    try {
        // Try to access the file
        await fsPromises.access(filePathA);
    
        // If no error is thrown, the file exists
        throw new Error(`File still exists: ${filePathA}`);
    } catch (error) {
        // If an error is thrown, check if it's a "not found" error
        if (error.code === 'ENOENT') {
            // File does not exist, which is expected
            console.log('File has been deleted:', filePathA);
        } else {
            // Some other error occurred
            throw error;
        }
    }
    
    // // Verify the existence of the file and its content after messageA
    // expect(fsPromises.stat(filePathA)).resolves.not.toBeTruthy(); // Ensure the file exists

    // Verify the content of the file after messageA
    const fileContentC = await fsPromises.readFile(filePathC, 'utf-8');
    const expectedContentC = `${JSON.stringify(JSON.parse(messageC))}\n`;

    expect(fileContentC).toEqual(expectedContentC);

    

    // Check if the upload object exists in S3
    if (DESTINATION === 's3' && S3_BUCKET !== undefined && S3_FILE_KEY !== undefined && S3_REGION !== undefined) {
        const s3 = new S3({ region: S3_REGION });
        const s3ObjectKey = `${path.dirname(S3_FILE_KEY)}/${path.basename(S3_FILE_KEY, path.extname(S3_FILE_KEY))}${path.extname(S3_FILE_KEY)}`;
        try {
            await s3.headObject({ Bucket: S3_BUCKET, Key: s3ObjectKey }).promise();
            // If the file exists in S3, the test passes
            expect(true).toBeTruthy();
        } catch (error) {
            if (error.code === 'NotFound') {
                // If the file is not found in S3, throw an error to fail the test
                throw new Error(`File not found in S3: ${s3ObjectKey}`);
            } else {
                // For other errors, rethrow the error
                throw error;
            }
        }
    }


    });
});
