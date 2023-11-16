# Updated repo structure:
```
findr/
│
├── src/
│   ├── adapters.ts
│   │
│   ├── adapters/
│   │   ├── mqtt.ts
│   │   ├── http.ts
│   │   ├── s3.ts
│   │   ├── dynamodb.ts
│   │
│   ├── connections/
│       ├── mqtts-to-s3.ts
│       ├── mqtts-to-dynamodb.ts
│       ├── http-to-s3.ts
│       ├── http-to-dynamodb.ts
│       ├── processors.ts

```



### Adapters

- `adapters.ts`: Main file for managing adapters.

### Connections Folder

- `mqtts-to-s3.ts`: Module for connecting MQTT data to S3.
- `mqtts-to-dynamodb.ts`: Module for connecting MQTT data to DynamoDB.
- `http-to-s3.ts`: Module for connecting HTTP data to S3.
- `http-to-dynamodb.ts`: Module for connecting HTTP data to DynamoDB.
- `processors.ts`: File containing data processors.


# Adapters

This directory contains adapters for handling traffic from IoT devices and managing communication with storage services. These files are written in typescript.

## Files

- **protocol-index.ts**: Entry point for handling traffic. Determines the downstream protocol and invokes the associated protocol class.
- **adapters/mqtt.ts**: Manages downstream and upstream connections for MQTT protocol.
- **storage-index.ts**: Determines the direction of traffic (downstream or upstream) and invokes the appropriate storage service.
- **adapters/s3.ts**: Handles file upload and download from the local machine to the S3 storage service.
- **utilities/message-save-local.ts**: Helper function to save received messages locally with updated filenames based on timestamps.
- **utilities/filename-utility.ts**: Helper utility for managing filenames.
- **utilities/extract-year-month-date.ts**: Helper function for extracting year, month, and date from timestamps in received message.

## How to Use

### For Traffic from IoT Devices

1. Use `protocol-index.ts` as the entry point.
2. Pass the following parameters to `protocol-index.ts`:

   - **SOURCE**: Downstream protocol (e.g., mqtts).
   - **DESTINATION**: Storage service (e.g., s3).
   - **MQTT_BROKER**: If the source is mqtts, use the example format ***mqtts://broker-public-ip:broker-mqtts-port-number***.
   - **PROTOCOL**: Required if the source is mqtts.
   - **MESSAGE_FILE_PATH**: Path to save the received message.
   - **CLIENT_ID**: Required if the source is mqtts (current machine's client ID).
   - **CA_FILE_PATH**: Required if the source is mqtts for TLS/SSL connection.
   - **S3_BUCKET**: Required if the storage service is S3.
   - **S3_FILE_KEY**: Required if the storage service is S3.
   - **S3_REGION**: Required if the storage service is S3.
   - **TOPIC**: Required if the source is mqtts.

### For Traffic from Storage Service to End User

1. Use `storage-index.ts` as the entry point.
2. Pass the required parameters to `storage-index.ts` based on the direction of traffic.

Feel free to customize this template further based on your project's specific details and requirements.

### Passing Parameters using Environment File to start ```storage-index.ts```.

1. Create a folder named `prod-env` at the same directory level as `src` and `test`.
2. Inside `prod-env`, create a file named `protocol-index.env`.
3. To start adapter, run this command at repo's root level:
```console
    node run adapter
```
