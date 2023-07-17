import { RESTDataSource } from "@apollo/datasource-rest";

 export class SpacexAPI extends RESTDataSource {

  baseURL = "https://api.spacexdata.com/v4/";

  getCapsules() {
    return this.get("capsules");
  }

  //getPayload(payloadId) {
  //  return  this.get(`payloads/${payloadId}`);
  //}
}
