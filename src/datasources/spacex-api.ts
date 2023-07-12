import { RESTDataSource } from "@apollo/datasource-rest";

export class SpacexAPI extends RESTDataSource{
  baseURL = "https://api.spacexdata.com/v3/";
}

getMissions(){
  return this.get('missions');
}

getPayload(payload_id: string){
  return this.get(`payloads/${payload_id}`);
}
