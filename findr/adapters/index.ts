import Connection from './connections.js'

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
const {
  SOURCE,
  DESTINATION,
  LOCAL_FILE_PATH,
  MQTTS_BROKER,
  TOPIC,
  CLIENT_ID,
  CA_FILE_PATH,
  HTTP_PORT_NUMBER,
  HTTP_ROUTE,
  S3_BUCKET_NAME,
  S3_FILE_KEY,
  S3_REGION,
  DYNAMODB_TABLE_NAME,
  DYNAMODB_REGION
} = process.env

// Assign default values using nullish coalescing operator
const source = SOURCE ?? ''
const destination = DESTINATION ?? ''
const localFilePath = LOCAL_FILE_PATH ?? ''
const mqttsBroker = MQTTS_BROKER ?? ''
const topic = TOPIC ?? ''
const clientId = CLIENT_ID ?? ''
const caFilePath = CA_FILE_PATH ?? ''
const httpPortNumber = HTTP_PORT_NUMBER ?? ''
const httpRoute = HTTP_ROUTE ?? ''
const s3BucketName = S3_BUCKET_NAME ?? ''
const s3FileKey = S3_FILE_KEY ?? ''
const s3Region = S3_REGION ?? ''
const dynamodbTableName = DYNAMODB_TABLE_NAME ?? ''
const dynamodbRegion = DYNAMODB_REGION ?? ''

// Check if any of the mandatory parameters are empty strings
const mandatoryParameters = [
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
]

if (mandatoryParameters.some(param => param === '')) {
  console.error('One or more mandatory parameters are empty strings.')
  process.exit(1)
}

// Your existing logic to start adapters based on parameters
if (source === '' || destination === '') {
  console.error('SOURCE and DESTINATION are mandatory parameters.')
  process.exit(1)
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
    console.log('MQTTS connection started successfully')
  } catch (error) {
    // Handle any potential errors here
    console.error('Error on starting MQTTS adapter:', error)
    process.exit(1)
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
    console.log('HTTP connection started successfully')
  } catch (error) {
    // Handle any potential errors here
    console.error('Error on starting HTTP adapter:', error)
    process.exit(1)
  }
} else {
  console.error('Invalid source. Expected "mqtts" or "http".')
  process.exit(1)
}