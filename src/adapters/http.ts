import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';


class HttpAdapter {
  private http: Express;
  private httpPortNumber: number;
  private httpRoute: string;
  private receiveHttpMessage: (message: object) => void;

  constructor(
    httpPortNumber: number,
    httpRoute: string,
    receiveHttpMessage: (message: object) => void,
  ) {
    this.http = express();
    this.httpPortNumber = httpPortNumber;
    this.httpRoute = httpRoute;
    this.setupMiddleware();
    this.setupRoutes();
    this.receiveHttpMessage = receiveHttpMessage;
  }
  private setupMiddleware(): void {
    this.http.use(bodyParser.json());
  }

  private setupRoutes(): void {
      this.http.post(this.httpRoute as string, async (req: Request, res: Response) => {
          const message = req.body;
          // Process and store the received iot data
          console.log('Received iot message:', message);
          // Perform necessary actions with the data
          await this.receiveHttpMessage(message);

          res.send('Message received at server side successfully');
      });
  }
  public startServer(): void {
    this.http.listen(this.httpPortNumber, () => {
        console.log(`Server is running on http://localhost:${this.httpPortNumber}`);
    });
  }

  // public stopServer(): void {
  //   this.http.close();
  // }
  

}

export default HttpAdapter