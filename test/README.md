# Testing

This section provides instructions on how to use the test files located in the `/test` directory to ensure the functionality of the adapters. There files are written in typescript.

## Test Files

### 1. `extract-year-month-date.test.ts`

This test file checks the functionality of the `extract-year-month-date.ts` helper function for extracting year, month, and date from timestamps.

### 2. `filename-utility.test.ts`

Tests the functionality of the `filename-utility.ts` helper utility for managing filenames.

### 3. `message-save-local.test.ts`

Tests the `message-save-local.ts` helper function for saving received messages locally with updated filenames based on timestamps.

### 4. `protocol-mqtt-test.ts`

Validates the behavior of the `protocol-mqtt.ts` file, which manages downstream and upstream connections for the MQTT protocol.

### 5. `storage-index.test.ts`

Tests the `storage-index.ts` file, which determines the direction of traffic (downstream or upstream) to or from storage services based on the received parameters.

### 6. `storage-s3.test.ts`

Validates the behavior of the `storage-s3.ts` file, which handles file upload and download from the local machine to the S3 storage service.

## How to Use

1. Remove .js Suffix in Import Statements:

   In the test files, ensure that the import statements for associated files under the `/src/adapters/` directory do not have a .js suffix. For example, change:

   ```typescript
   import { extractYearMonthDate } from '../src/adapters/extract-year-month-date.js';
2. To run tests for one file, use the following command at the repository's root level:
```console
    npm test <test-file-path>
```
3. To run all tests, use the following command at the repository's root level:
```console
    npm test
```

## Coding style check command:
```console
    npx eslint --fix <file-path>
```
