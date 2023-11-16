import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';
import { LocalMessageSaver } from '../utilities/message-save-local.js';
import { extractYearMonthDate } from '../utilities/extract-year-month-date.js';
import { FileNameUtility } from '../utilities/filename-utility.js';
import { DataTransferHandler } from '../storage-index.js';

interface HttpAdapterConfig {
  source: string;
  destination: string;
  httpPortNumber: number;
  httpRoute?: string;
  messageFilePath: string;
  s3Bucket?: string;
  s3FileKey?: string;
  s3Region?: string;
  dynamodbTableName?: string;
  dynamodbRegion?: string;
}

class HttpAdapter {
  private source: string;
  private destination: string;
  private http: Express;
  private port: number;
  private httpRoute?: string;
  private currentYearMonthDate: string | null = null;
  private messageFilePath: string;
  private messageSaver: LocalMessageSaver;
  private dataTransferHandler: DataTransferHandler;
  private s3Bucket?: string;
  private s3FileKey?: string;
  private s3Region?: string;
  private dynamodbTableName?: string;
  private dynamodbRegion?: string;

  constructor(config: HttpAdapterConfig) {
      this.source = config.source;
      this.destination = config.destination;
      this.http = express();
      this.port = config.httpPortNumber;
      this.httpRoute = config.httpRoute;
      this.messageFilePath = config.messageFilePath;
      this.s3Bucket = config.s3Bucket;
      this.s3FileKey = config.s3FileKey;
      this.s3Region = config.s3Region;
      this.dynamodbTableName = config.dynamodbTableName;
      this.dynamodbRegion = config.dynamodbRegion;
      this.setupMiddleware();
      this.setupRoutes();
      this.messageSaver = new LocalMessageSaver(this.messageFilePath);
      this.dataTransferHandler = new DataTransferHandler(this.source, this.destination);
  }

  private setupMiddleware(): void {
      this.http.use(bodyParser.json());
  }

  private setupRoutes(): void {
      this.http.post(this.httpRoute as string, async (req: Request, res: Response) => {
          const data = req.body;
          // Process and store the received iot data
          console.log('Received iot data:', data);
          // Perform necessary actions with the data
          await this.handleMessage(data);

          res.send('Data received at server side successfully');
      });
  }
  public handleMessage(data: Buffer): void {
      // console.log(`Received data: ${data.toString('utf-8')}`);
      const dataJson = JSON.stringify(data);
      console.log(`Received data: ${dataJson}`);
      console.log(`timePublished: ${JSON.parse(dataJson).timePublished}`);
  
      const yearMonthDate = extractYearMonthDate(JSON.parse(dataJson).timePublished);
      console.log(`yearMonthDate: ${yearMonthDate}`);
  
      if (this.currentYearMonthDate !== null) {
        if (this.currentYearMonthDate === yearMonthDate) {
          this.messageSaver.saveMessage(dataJson);
        } else {
          const oldFileName = FileNameUtility.constructFileName(this.messageFilePath, this.currentYearMonthDate);
          if (this.destination === 's3' && this.s3Bucket !== undefined && this.s3FileKey !== undefined && this.s3Region !== undefined) {
            this.dataTransferHandler.fromIotToS3(oldFileName, this.s3Bucket, this.s3FileKey, this.s3Region);
          } else if (this.destination === 'dynamodb' && this.dynamodbTableName !== undefined && this.dynamodbRegion !== undefined) {
              console.log('uploading to dynamodb in http.ts');
              this.dataTransferHandler.fromIotToDynamoDB(this.dynamodbTableName, oldFileName, this.dynamodbRegion);
          }
  
          const newFileName = FileNameUtility.constructFileName(this.messageFilePath, yearMonthDate);
          this.messageSaver.changeFilePath(newFileName);
          this.messageSaver.createFile(newFileName);
          this.currentYearMonthDate = yearMonthDate;
  
          this.messageSaver.saveMessage(dataJson);
        }
      } else {
        this.currentYearMonthDate = yearMonthDate;
  
        const newFileName = FileNameUtility.constructFileName(this.messageFilePath, this.currentYearMonthDate);
        this.messageSaver.changeFilePath(newFileName);
        this.messageSaver.createFile(newFileName);
        this.messageSaver.saveMessage(dataJson);
      }
  
    }


  public startServer(): void {
      this.http.listen(this.port, () => {
          console.log(`Server is running on http://localhost:${this.port}`);
      });
  }

  public stopServer(): void {
    this.http.close();
  }
}

export default HttpAdapter;