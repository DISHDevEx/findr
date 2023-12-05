# Findr

`adapters.ts` will take parameters from an API call to invoke `connections.ts`. `connections.ts` will invoke `mqtts.ts`, `http.ts`, `s3.ts`, and `dynamodb.ts`, as well as `processors.ts`.

## How to Use:

In the repo's root directory, run the following command to start the Findr listener to receive API calls with parameters:

```console
node dist/adapters.ts
```
or
```console
npm run adapters
```
## repo structure:
```
findr/
│
├── src/
│   ├── adapters.ts
│   │
│   ├── adapters/
│   │   ├── mqtts.ts
│   │   ├── http.ts
│   │   ├── s3.ts
│   │   ├── dynamodb.ts
│   │
│   ├── connections.ts
│   │
│   ├── processors.ts    
│       
│       
│       
│       

```



### Adapters

- `adapters.ts`: Main file for managing adapters.

### Connections

- `connections.ts`: Main file for connecting adapters.

### Adapters Folder

- `mqtts.ts`: Module for connecting MQTTS device.
- `http.ts`: Module for connecting HTTP device.
- `s3.ts`: Module for connecting AWS S3.
- `dynamodb.ts`: Module for connecting AWS DynamoDB.

### Processors

- `processors.ts`: File containing data processors.


## Files

- **mqtts.ts**
- **http.ts**
- **s3.ts**
- **dynamodb.ts**
- **connections.ts**
- **processors.ts**
- **adapters.ts**

### For Traffic from IoT Devices

1. Use `adapters.ts` as the entry point.
2. Pass the following parameters to `adapters-index.ts` with API calls:

    - **source**: Downstream protocol (e.g., mqtts).
    - **destination**: Upstream protocol (e.g., s3).
    - **localFilePath**: Local file name to receive the IoT data. 
    - **mqttsBroker**: Required if the source is mqtts., use the example format ***mqtts://broker-public-ip:broker-mqtts-port-number***.
    - **topic**: Required if the source is mqtts.
    - **clientId**: Required if the source is mqtts.
    - **caFilePath**: Required if the source is mqtts.
    - **httpPortNumber**: Required if the source is http.
    - **httpRoute**: Required if the source is http.
    - **s3BucketName**: Required if the destination is s3.
    - **s3FileKey**: Required if the destination is s3.
    - **s3Region**: Required if the destination is s3.
    - **dynamodbTableName**: Required if the destination is dynamodb.
    - **dynamodbRegion**: Required if the destination is dynamodb.
