import express, { type Request, type Response } from 'express'
import cors from 'cors'
import Connection from './connection.js'

const app = express()
// Ensure the value is not null or undefined before using it
const port = parseInt(process.env.API_PORT ?? '8080', 10)

app.use(cors()) // Enable CORS for all routes

app.use(express.json()) // Middleware to parse JSON request body

/**
 * Defines the endpoint to trigger the adapters based on the provided configuration.
 *
 * @param {string} source - The source of the data (e.g., 'mqtts' or 'http').
 * @param {string} destination - The destination service (e.g., 's3' or 'dynamodb').
 * @param {string} localFilePath - The local file path for saving messages.
 * @param {string} mqttsBroker - The MQTT broker address (applicable for 'mqtts' source).
 * @param {string} topic - The MQTT topic to subscribe to (applicable for 'mqtts' source).
 * @param {string} clientId - The MQTT client ID (applicable for 'mqtts' source).
 * @param {string} caFilePath - The file path of the Certificate Authority file (applicable for 'mqtts' source).
 * @param {number} httpPortNumber - The HTTP server port number (applicable for 'http' source).
 * @param {string} httpRoute - The HTTP route to trigger (applicable for 'http' source).
 * @param {string} s3BucketName - The S3 bucket name for storage.
 * @param {string} s3FileKey - The S3 file key for storage.
 * @param {string} s3Region - The AWS region for S3.
 * @param {string} dynamodbTableName - The DynamoDB table name for storage.
 * @param {string} dynamodbRegion - The AWS region for DynamoDB.
 */
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
    dynamodbRegion
  } = req.body

  // Check if SOURCE and DESTINATION are defined
  if (source === undefined || destination === undefined) {
    return res.status(400).json({ error: 'SOURCE and DESTINATION are mandatory parameters.' })
  }

  // Your existing logic to start adapters based on parameters
  if (source === 'mqtts') {
    const connectionConfig = {
      destination,
      localFilePath,
      mqttsBroker,
      clientId,
      caFilePath,
      topic,
      s3BucketName,
      s3FileKey,
      s3Region,
      dynamodbTableName,
      dynamodbRegion
    }
    try {
      const connection = new Connection(connectionConfig)
      connection.startMqtts()
      return res.status(200).json({ message: 'MQTTS connection started successfully' })
    } catch (error) {
      // Handle any potential errors here
      return res.status(400).json({ 'Error on starting MQTTS adapter:': error })
    }
  } else if (source === 'http') {
    const connectionConfig = {
      destination,
      localFilePath,
      httpPortNumber: parseInt(httpPortNumber, 10),
      httpRoute,
      s3BucketName,
      s3FileKey,
      s3Region,
      dynamodbTableName,
      dynamodbRegion
    }
    try {
      const connection = new Connection(connectionConfig)
      connection.startHttp()
      return res.status(200).json({ message: 'HTTP connection started successfully' })
    } catch (error) {
      // Handle any potential errors here
      return res.status(400).json({ 'Error on starting HTTP adapter:': error })
    }
  } else {
    return res.status(400).json({ error: 'Invalid source. Expected "mqtts" or "http".' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})