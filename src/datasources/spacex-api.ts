import { RESTDataSource } from "@apollo/datasource-rest";

 export class SpacexAPI extends RESTDataSource {

  baseURL = "https://api.spacexdata.com/v3/";

  getMissions() {
    return this.get("missions");
  }

  getPayload(payloadId) {
    return  this.get(`payloads/${payloadId}`);
  }
}
