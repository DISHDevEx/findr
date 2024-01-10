import axios from 'axios'

/**
 * HttpAdapter is a class that sets up an HTTP server using Express to receive messages.
 * @class
 */
class HttpAdapter {
  /**
   * IP address of the HTTP server.
   * @private
   * @type {string}
   */
  private readonly httpIp: string

  /**
   * Key to extract the HTTP response from the server's response data.
   * @private
   * @type {string}
   */
  private readonly httpResponseKey: string

  /**
   * Interval (in milliseconds) at which HTTP requests are sent.
   * @private
   * @type {number}
   */
  private readonly httpRequestInterval: number

  /**
   * Port number on which the HTTP server will listen.
   * @private
   * @type {number}
   */
  private readonly httpPortNumber: number

  /**
   * Route for receiving HTTP messages.
   * @private
   * @type {string}
   */
  private readonly httpRoute: string

  /**
   * Callback function to process received HTTP messages.
   * @private
   * @type {(message: object) => void}
   */
  private readonly receiveHttpMessage: (message: object) => void

  /**
   * Constructs an HttpAdapter instance.
   *
   * @param {string} httpIp - IP address of the HTTP server.
   * @param {string} httpResponseKey - Key to extract the HTTP response from the server's response data.
   * @param {number} httpPortNumber - Port number on which the HTTP server will listen.
   * @param {string} httpRoute - Route for receiving HTTP messages.
   * @param {number} httpRequestInterval - Interval (in milliseconds) at which HTTP requests are sent.
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
    this.receiveHttpMessage = receiveHttpMessage
  }

  /**
   * Method to send an HTTP request.
   * @private
   */
  private sendRequest (): void {
    const httpUrl = `http://${this.httpIp}:${this.httpPortNumber}/${this.httpRoute}`
    console.log(`HTTP url: ${httpUrl}`)

    axios.post(httpUrl, { request: 'findr adapter' })
      .then(response => {
        const responseFromIoT = response.data[this.httpResponseKey]
        const responseFromIoTJson = JSON.stringify(responseFromIoT)
        console.log(`responseFromIoTJson: ${responseFromIoTJson}`)
        this.receiveHttpMessage(responseFromIoT)
        console.log('Received HTTP IoT message')
      })
      .catch(error => {
        // Handle error if needed
        console.error('Error sending HTTP request:', error)
      })
  }

  /**
   * Method to start the HTTP server and initiate periodic HTTP requests.
   * @public
   */
  public startServer (): void {
    console.log('Starting HTTP server')
    setInterval(() => {
      console.log('Sending HTTP request')
      this.sendRequest()
    }, this.httpRequestInterval)
  }
}

export default HttpAdapter