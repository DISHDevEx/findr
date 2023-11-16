import dotenv from 'dotenv';
import HttpAdapter from '../src/adapters/http';
import axios from 'axios';

dotenv.config({ path: 'test-env/test.env' });

describe('HttpAdapter', () => {
    // Load environment variables
    const SOURCE_HTTP = process.env.SOURCE_HTTP ?? '';
    // const DESTINATION_S3 = process.env.DESTINATION_S3 ?? '';
    const DESTINATION_DYNAMODB = process.env.DESTINATION_DYNAMODB ?? '';
    const FILE_PATH = process.env.LOCAL_FILE_PATH ?? '';
    // const S3_BUCKET = process.env.S3_BUCKET ?? '';
    // const S3_FILE_KEY = process.env.S3_FILE_KEY ?? '';
    // const S3_REGION = process.env.S3_REGION ?? '';
    const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME ?? '';
    const DYNAMODB_REGION = process.env.DYNAMODB_REGION ?? '';
    const HTTP_PORT_NUMBER = process.env.HTTP_PORT_NUMBER ?? '';
    const HTTP_ROUTE = process.env.HTTP_ROUTE ?? '';

    const httpDynamodbConfig = {
        source: SOURCE_HTTP,
        destination: DESTINATION_DYNAMODB,
        httpPortNumber: HTTP_PORT_NUMBER,
        httpRoute: HTTP_ROUTE,
        messageFilePath: FILE_PATH,
        dynamodbTableName: DYNAMODB_TABLE_NAME,
        dynamodbRegion: DYNAMODB_REGION,
    };

    let httpDynamodbAdapter: HttpAdapter;

    beforeAll(() => {
        httpDynamodbAdapter = new HttpAdapter(httpDynamodbConfig);
    });    

    afterAll(() => {
        // Stop the server after all tests
        httpDynamodbAdapter.stopServer();
    });
    

    it('should create an instance of HttpAdapter', () => {
        expect(httpDynamodbAdapter).toBeInstanceOf(HttpAdapter);
    });

    it('should start the server and be reachable', async () => {

        // Use expect.assertions to make sure assertions are called
        expect.assertions(2);

        try {
            // Start the server
            httpDynamodbAdapter.startServer();

            // Wait for a short time to allow the server to start
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Make a request to the server
            const response = await axios.get(`http://localhost:${httpDynamodbAdapter['httpPortNumber']}`);

            // Expectations
            expect(response.status).toBe(200);
            expect(response.data).toContain('Server is running');
        } catch (error) {
            // If an error occurs, fail the test with the error message
            console.log(`Server test failed with error: ${error}`);
        }
    });


    it('should handle a received message without errors', async () => {

        // Simulate received data
        const simulatedData = {
            companyName: 'abc',
            departmentName: 'xyz',
            deviceId: 123,
            timePublished: '2023-11-07 09:57:16',
        };

        // Use expect.assertions to make sure assertions are called
        expect.assertions(1);

        try {
            // Call the handleMessage function with the simulated data
            await httpDynamodbAdapter.handleMessage(simulatedData);

            // If the function completes without throwing an error, the test should pass
            expect(true).toBe(true);
        } catch (error) {
            // If an error occurs, fail the test with the error message
            console.log(`handleMessage failed with error: ${error}`);
        }
    });

    // Add more test cases for different scenarios
});
