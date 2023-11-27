import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';

/**
 * HttpAdapter is a class that sets up an HTTP server using Express to receive messages.
 */
class HttpAdapter {
  /**
   * Express instance for handling HTTP requests.
   * @type {Express}
   * @private
   */
  private http: Express;

  /**
   * Port number on which the HTTP server will listen.
   * @type {number}
   * @private
   */
  private httpPortNumber: number;

  /**
   * Route for receiving HTTP messages.
   * @type {string}
   * @private
   */
  private httpRoute: string;

  /**
   * Callback function to process received HTTP messages.
   * @type {(message: object) => void}
   * @private
   */
  private receiveHttpMessage: (message: object) => void;

  /**
   * Constructs an HttpAdapter instance.
   *
   * @param {number} httpPortNumber - The port number on which the HTTP server will listen.
   * @param {string} httpRoute - The route for receiving HTTP messages.
   * @param {(message: object) => void} receiveHttpMessage - Callback function to process received HTTP messages.
   */
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

  /**
   * Sets up middleware for the Express instance.
   * @private
   */
  private setupMiddleware(): void {
    this.http.use(bodyParser.json());
  }

  /**
   * Sets up routes for handling HTTP POST requests.
   * @private
   */
  private setupRoutes(): void {
    this.http.post(this.httpRoute as string, async (req: Request, res: Response) => {
      const message = req.body;
      // Process and store the received IoT data
      console.log('Received IoT message:', message);
      // Perform necessary actions with the data
      await this.receiveHttpMessage(message);

      res.send('Message received at server side successfully');
    });
  }

  /**
   * Starts the HTTP server.
   */
  public startServer(): void {
    this.http.listen(this.httpPortNumber, () => {
      console.log(`Server is running on http://localhost:${this.httpPortNumber}`);
    });
  }
}

export default HttpAdapter;
