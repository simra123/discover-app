import axios, { AxiosRequestConfig } from "axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
class HttpHandler {
  static baseUrl = "http://localhost:5000/";

  static makeRequest(
    endpoint: string,
    method: string,
    data?: any,
    cancleToken? : any 
  ): Promise<any> {
    const config: AxiosRequestConfig = {
      url: `${this.baseUrl}${endpoint}`,
      method,
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("isUserLogged"))}`,
      },
      cancelToken: cancleToken,
    };
    return axios(config);
  }
}

export default HttpHandler;