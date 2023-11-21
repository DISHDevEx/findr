import express, { Request, Response } from 'express';
import cors from 'cors';
import Connection from './connection.js';

const app = express();
const port = process.env.API_PORT || 8080;

app.use(cors()); // Enable CORS for all routes

app.use(express.json()); // Middleware to parse JSON request body

// Define the endpoint to trigger the adapters
app.post('/trigger-adapters', (req: Request, res: Response) => {
  // Extract parameters from the request body
  const {
    source,
    destination,
    localFilePath,
    mqttsBroker,
    topic,
    clientId,
    caFilePath,
    httpPortNumber,
    httpRoute,
    s3BucketName,
    s3FileKey,
    s3Region,
    dynamodbTableName,
    dynamodbRegion,
  } = req.body;

  // Check if SOURCE and DESTINATION are defined
  if (source === undefined || destination === undefined) {
    return res.status(400).json({ error: 'SOURCE and DESTINATION are mandatory parameters.' });
  }

  // Your existing logic to start adapters based on parameters
  if (source === 'mqtts') {
    const connectionConfig = {
      destination: destination,
      localFilePath: localFilePath,
      mqttsBroker: mqttsBroker,
      clientId: clientId,
      caFilePath: caFilePath,
      topic: topic,
      s3BucketName: s3BucketName,
      s3FileKey: s3FileKey,
      s3Region: s3Region,
      dynamodbTableName: dynamodbTableName,
      dynamodbRegion: dynamodbRegion,
    };
    try {
      const connection = new Connection(connectionConfig);
      connection.startMqtts();
      return res.status(200).json({ message: 'MQTTS connection started successfully' });
    } catch (error) {
      // Handle any potential errors here
      return res.status(400).json({ 'Error on starting MQTTS adapter:': error });
    }
  } else if (source === 'http') {
    const connectionConfig = {
      destination: destination,
      localFilePath: localFilePath,
      httpPortNumber: parseInt(httpPortNumber, 10),
      httpRoute: httpRoute,
      s3BucketName: s3BucketName,
      s3FileKey: s3FileKey,
      s3Region: s3Region,
      dynamodbTableName: dynamodbTableName,
      dynamodbRegion: dynamodbRegion,
    };
    try {
      const connection = new Connection(connectionConfig);
      connection.startHttp();
      return res.status(200).json({ message: 'HTTP connection started successfully' });
    } catch (error) {
      // Handle any potential errors here
      return res.status(400).json({ 'Error on starting HTTP adapter:': error });
    }
  } else {
    return res.status(400).json({ error: 'Invalid source. Expected "mqtts" or "http".' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
