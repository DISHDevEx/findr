import { readFileSync } from 'fs'
import { DynamoDBClient, PutItemCommand, type PutItemOutput, type PutItemCommandInput } from '@aws-sdk/client-dynamodb'

/**
 * DynamoDBUploader is a class for uploading data to an Amazon DynamoDB table.
 */
export class DynamoDBUploader {
  /**
   * File path containing data to be uploaded.
   * @type {string}
   * @private
   */
  private readonly filePath: string

  /**
   * Amazon DynamoDB client instance.
   * @type {DynamoDBClient}
   * @private
   */
  private readonly dynamoDBClient: DynamoDBClient

  /**
   * Name of the DynamoDB table.
   * @type {string}
   * @private
   */
  private readonly tableName: string

  /**
   * Constructs a DynamoDBUploader instance.
   *
   * @param {string} filePath - The file path containing data to be uploaded.
   * @param {string} tableName - The name of the DynamoDB table.
   * @param {string} region - The AWS region where the DynamoDB table is located.
   */
  constructor (filePath: string, tableName: string, region: string) {
    this.filePath = filePath
    this.tableName = tableName
    this.dynamoDBClient = new DynamoDBClient({ region })
  }

  /**
   * Uploads data from the specified file to the DynamoDB table.
   *
   * @returns {Promise<void>} A Promise that resolves when the upload is successful, or rejects on error.
   */
  public async uploadToDynamoDB (): Promise<void> {
    console.log('Uploading to DynamoDB in dynamodb.ts')

    const fileContent = readFileSync(this.filePath, 'utf-8')
    const lines = fileContent.split('\n')

    for (const line of lines) {
      // Add a check to skip empty lines
      if (line.trim() === '' || line.trim() === null || line.trim() === undefined) {
        continue
      }

      try {
        const data = JSON.parse(line)

        // Define the parameters for the PutItem command
        const params: PutItemCommandInput = {
          TableName: this.tableName,
          Item: {
            companyName: { S: data.companyName },
            departmentName: { S: data.departmentName },
            timePublished: { S: data.timePublished },
            deviceId: { N: data.deviceId.toString() } // Use N for numeric attributes
            // Add other attributes as needed for your composite key
            // attributeName: { S: data.attributeName },
          }
        }

        try {
          const result: PutItemOutput = await this.dynamoDBClient.send(new PutItemCommand(params))
          console.log('Item uploaded:', result)
        } catch (error) {
          console.error('Error uploading item:', error)
        }
      } catch (error) {
        console.error('Error parsing line:', error)
      }
    }
  }
}