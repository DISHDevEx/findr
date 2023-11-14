import { readFileSync } from 'fs';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';


export class DynamoDBUploader {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;
    private filePath: string;
  
    constructor(tableName: string, filePath: string, region: string) {
        this.tableName = tableName;
        this.filePath = filePath;
        this.dynamoDBClient = new DynamoDBClient({ region });
    }
  
    public async uploadToDynamoDB(): Promise<void> {
      console.log('uploading to dynamodb in dynamodb.ts')
      const fileContent = readFileSync(this.filePath, 'utf-8');
      const lines = fileContent.split('\n');
  
      for (const line of lines) {
        // Add a check to skip empty lines
        if (!line.trim()) {
          continue;
        }
  
        try {
          const data = JSON.parse(line);
  
          // Define the parameters for the PutItem command
          const params = {
            TableName: this.tableName,
            Item: {
              companyName: { S: data.companyName },
              departmentName: { S: data.departmentName },
              timePublished: { S: data.timePublished },
              deviceId: { N: data.deviceId.toString() }, // Use N for numeric attributes
              // Add other attributes as needed for your composite key
              // attributeName: { S: data.attributeName },
            },
          };
  
          // Create the PutItem command
          const command = new PutItemCommand(params);
  
          // Execute the PutItem command
          try {
            const result = await this.dynamoDBClient.send(command);
            console.log('Item uploaded:', result);
          } catch (error) {
            console.error('Error uploading item:', error);
          }
        } catch (error) {
          console.error('Error parsing line:', error);
        }
      }
    }
  }