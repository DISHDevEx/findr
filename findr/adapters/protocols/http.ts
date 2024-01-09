import axios from 'axios'

/**
 * HttpAdapter is a class that sets up an HTTP server using Express to receive messages.
 */
class HttpAdapter {
  private readonly httpIp: string
  private readonly httpResponseKey: string
  private readonly httpRequestInterval: number


  /**
   * Port number on which the HTTP server will listen.
   * @type {number}
   * @private
   */
  private readonly httpPortNumber: number

  /**
   * Route for receiving HTTP messages.
   * @type {string}
   * @private
   */
  private readonly httpRoute: string

  /**
   * Callback function to process received HTTP messages.
   * @type {(message: object) => void}
   * @private
   */
  private readonly receiveHttpMessage: (message: object) => void

  /**
   * Constructs an HttpAdapter instance.
   *
   * @param {number} httpPortNumber - The port number on which the HTTP server will listen.
   * @param {string} httpRoute - The route for receiving HTTP messages.
   * @param {(message: object) => void} receiveHttpMessage - Callback function to process received HTTP messages.
   */
  constructor (
    httpIp: string,
    httpResponseKey: string,
    httpPortNumber: number,
    httpRoute: string,
    httpRequestInterval: number,
    receiveHttpMessage: (message: object) => void
  ) {
    this.httpIp = httpIp
    this.httpResponseKey = httpResponseKey
    this.httpRequestInterval = httpRequestInterval
    this.httpPortNumber = httpPortNumber
    this.httpRoute = httpRoute
    this.startServer = this.startServer.bind(this)
    this.receiveHttpMessage = receiveHttpMessage
  }

  /**
   * Method to send request.
   * @private
   */
  private sendRequest (): void {
    const httpUrl = `http://${this.httpIp}:${this.httpPortNumber}/${this.httpRoute}`
    console.log(`HTTP url: ${httpUrl}`)
    axios.post(httpUrl, {request: 'findr adapter'})
      .then(response => {
        const responseFromIoT = response.data[this.httpResponseKey]
        const responseFromIoTJson = JSON.stringify(responseFromIoT)
        console.log(`responseFromIoTJson: ${responseFromIoTJson}`)
        this.receiveHttpMessage(responseFromIoT)
        console.log('Received HTTP IoT message')
    })
  }

  /**
   * Method to start server.
   * @public
   */
  public startServer (): void {
    console.log('start startServer in http')
    const intervalId = setInterval(() => {
      console.log('complete startServer in http')
      this.sendRequest();
    }, this.httpRequestInterval);
  }

}

export default HttpAdapter