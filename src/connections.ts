import MqttsAdapter from './adapters/mqtts.js'
import HttpAdapter from './adapters/http.js'
import Processors from './processors.js';
import fs from 'fs';




interface AdapterConfig {
    destination: string;
    localFilePath: string;
    mqttsBroker?: string;
    // protocol: MqttProtocol;
    clientId?: string;
    caFilePath?: string;
    topic?: string;
    httpPortNumber?: number;
    httpRoute?: string;
    s3BucketName?: string;
    s3FileKey?: string;
    s3Region?: string;
    dynamodbTableName?: string;
    dynamodbRegion?: string;
  }

class Connection {
    private destination: string;
    private localFilePath: string;
    private mqttsBroker?: string;
    // protocol: MqttProtocol;
    private clientId?: string;
    private caFilePath?: string;
    private topic?: string;
    private httpPortNumber?: number;
    private httpRoute?: string;
    private s3BucketName?: string;
    private s3FileKey?: string;
    private s3Region?: string;
    private dynamodbTableName?: string;
    private dynamodbRegion?: string;
    private currentDate: string | null;
    private processors: Processors;
    constructor(config: AdapterConfig) {
        this.destination = config.destination;
        this.localFilePath = config.localFilePath;
        this.mqttsBroker = config.mqttsBroker;
        this.clientId = config.clientId;
        this.caFilePath = config.caFilePath;
        this.topic = config.topic;
        this.httpPortNumber = config.httpPortNumber;
        this.httpRoute = config.httpRoute;
        this.s3BucketName = config.s3BucketName;
        this.s3FileKey = config.s3FileKey;
        this.s3Region = config.s3Region;
        this.dynamodbTableName = config.dynamodbTableName;
        this.dynamodbRegion = config.dynamodbRegion;
        this.currentDate = null;
        this.processors = new Processors(this.destination, this.localFilePath);
    }

    public startMqtts(){
        const mqttsBroker = this.mqttsBroker || '';
        const clientId = this.clientId || '';
        const caFilePath = this.caFilePath || '';
        const topic = this.topic || '';
        const mqttsAdapter = new MqttsAdapter(mqttsBroker, clientId, caFilePath, topic, this.receiveMqttsMessage.bind(this))
        console.log('try to::: startMqtts() in connection.ts');
        mqttsAdapter.startClient()
        console.log('complete::: startMqtts() in connection.ts');
    }

    public receiveMqttsMessage(receivedTopic: string, message: object){
        // will invoke another class
        console.log(`Type: ${typeof receivedTopic}, Value: ${receivedTopic}`);
        console.log(`Type: ${typeof message}, Value: ${message}`);
        console.log(`This destination: ${this.destination}`);
        console.log(`This local file path: ${this.localFilePath}`);
        const receivedMessage = message.toString();
        const yearMonthDate = this.processors.extractYearMonthDate(JSON.parse(receivedMessage).timePublished);
        console.log(`yearMonthDate: ${yearMonthDate}`);
        if (this.currentDate !== null) {
            if (this.currentDate === yearMonthDate) {
                console.log(`Before this.messageSaver.saveMessage(receivedMessage);`);
                this.processors.saveMessage(receivedMessage);
                console.log(`After this.messageSaver.saveMessage(receivedMessage);`);
            } else {
                console.log(`this.currentDate !== yearMonthDate`);
                const oldFileName = this.processors.constructFileName(this.localFilePath, this.currentDate);
                console.log(`oldFileName: ${oldFileName}`);
                console.log(`Type: ${typeof this.destination}, Value: ${this.destination}`);
                console.log(`Type: ${typeof this.s3BucketName}, Value: ${this.s3BucketName}`);
                console.log(`Type: ${typeof this.s3FileKey}, Value: ${this.s3FileKey}`);
                console.log(`Type: ${typeof this.s3Region}, Value: ${this.s3Region}`);
                console.log(`Type: ${typeof this.dynamodbTableName}, Value: ${this.dynamodbTableName}`);
                console.log(`Type: ${typeof this.dynamodbRegion}, Value: ${this.dynamodbRegion}`);


                if (this.destination === 's3' && this.s3BucketName !== undefined && this.s3FileKey !== undefined && this.s3Region !== undefined) {
                    console.log(`Upload to s3 from mqtts`);
                    const newS3FileKey = this.processors.constructFileName(this.s3FileKey, this.currentDate);
                    this.processors.fromIotToS3(oldFileName, this.s3BucketName, newS3FileKey, this.s3Region);
                }
                if (this.destination === 'dynamodb' && this.dynamodbTableName !== undefined && this.dynamodbRegion !== undefined) {
                    console.log(`Upload to dynamodb from mqtts`);
                    this.processors.fromIotToDynamoDB(oldFileName, this.dynamodbTableName, this.dynamodbRegion);
                }

    
                const newFileName = this.processors.constructFileName(this.localFilePath, yearMonthDate);
                this.processors.changeFilePath(newFileName);
                this.processors.createFile(newFileName);
                this.currentDate = yearMonthDate;
        
                this.processors.saveMessage(receivedMessage);
            }
        } else {
            this.currentDate = yearMonthDate;
    
            const newFileName = this.processors.constructFileName(this.localFilePath, this.currentDate);
            this.processors.changeFilePath(newFileName);
            this.processors.createFile(newFileName);
            this.processors.saveMessage(receivedMessage);
        }
    

    }
    

    public startHttp(){
        const httpPortNumber = this.httpPortNumber || 3000;
        const httpRoute = this.httpRoute || '';
        const httpAdapter = new HttpAdapter(httpPortNumber, httpRoute, this.receiveHttpMessage.bind(this))
        console.log('try to::: startHttp() in connection.ts');
        httpAdapter.startServer()
        console.log('complete::: startHttp() in connection.ts');
    }

    public receiveHttpMessage(message: object){
        // will invoke another class
        // console.log(`Type: ${typeof message}, Value: ${message}`);
        // console.log(`This destination: ${this.destination}`);
        // console.log(`This local file path: ${this.localFilePath}`);
        const receivedMessage = JSON.stringify(message);
        const yearMonthDate = this.processors.extractYearMonthDate(JSON.parse(receivedMessage).timePublished);
        // console.log(`yearMonthDate: ${yearMonthDate}`);
        if (this.currentDate !== null) {
            if (this.currentDate === yearMonthDate) {
                console.log(`Before this.messageSaver.saveMessage(receivedMessage);`);
                this.processors.saveMessage(receivedMessage);
                console.log(`After this.messageSaver.saveMessage(receivedMessage);`);
            } else {
                console.log(`this.currentDate !== yearMonthDate`);
                const oldFileName = this.processors.constructFileName(this.localFilePath, this.currentDate);
                console.log(`oldFileName: ${oldFileName}`);
                console.log(`Type: ${typeof this.destination}, Value: ${this.destination}`);
                console.log(`Type: ${typeof this.s3BucketName}, Value: ${this.s3BucketName}`);
                console.log(`Type: ${typeof this.s3FileKey}, Value: ${this.s3FileKey}`);
                console.log(`Type: ${typeof this.s3Region}, Value: ${this.s3Region}`);
                console.log(`Type: ${typeof this.dynamodbTableName}, Value: ${this.dynamodbTableName}`);
                console.log(`Type: ${typeof this.dynamodbRegion}, Value: ${this.dynamodbRegion}`);

                if (this.destination === 's3' && this.s3BucketName !== undefined && this.s3FileKey !== undefined && this.s3Region !== undefined) {
                    console.log(`Upload to s3 from mqtts`);
                    const newS3FileKey = this.processors.constructFileName(this.s3FileKey, this.currentDate);
                    this.processors.fromIotToS3(oldFileName, this.s3BucketName, newS3FileKey, this.s3Region);
                }
                if (this.destination === 'dynamodb' && this.dynamodbTableName !== undefined && this.dynamodbRegion !== undefined) {
                    console.log(`Upload to dynamodb from mqtts`);
                    this.processors.fromIotToDynamoDB(oldFileName, this.dynamodbTableName, this.dynamodbRegion);
                }
    
                const newFileName = this.processors.constructFileName(this.localFilePath, yearMonthDate);
                this.processors.changeFilePath(newFileName);
                this.processors.createFile(newFileName);
                this.currentDate = yearMonthDate;
        
                this.processors.saveMessage(receivedMessage);
            }
        } else {
            this.currentDate = yearMonthDate;
    
            const newFileName = this.processors.constructFileName(this.localFilePath, this.currentDate);
            this.processors.changeFilePath(newFileName);
            this.processors.createFile(newFileName);
            this.processors.saveMessage(receivedMessage);
        }
    }


}

export default Connection