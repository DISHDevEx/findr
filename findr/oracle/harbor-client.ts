import axios from 'axios';

class HarborClient {
  private harborUrl: string;
  private username: string;
  private password: string;

  constructor(harborUrl: string, username: string, password: string) {
    this.harborUrl = harborUrl;
    this.username = username;
    this.password = password;
  }

  private getAuthToken() {
    return 'Basic ' + Buffer.from(`${this.username}:${this.password}`).toString('base64');
  }

  async listProjects(): Promise<any> {
    const response = await axios.get(`${this.harborUrl}/api/projects`, {
      headers: { 'Authorization': this.getAuthToken() }
    });
    return response.data;
  }

  async createProject(projectName: string): Promise<void> {
    await axios.post(`${this.harborUrl}/api/projects`, {
      project_name: projectName
    }, {
      headers: { 'Authorization': this.getAuthToken() }
    });
  }
}

export default HarborClient;