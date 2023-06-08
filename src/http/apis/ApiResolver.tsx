import Authentication from "./auth";

class ApiResolver {
  private apis: { [key: string]: any };

  constructor() {
    this.apis = {
      auth: Authentication.apis(),
    };
  }

  resolve(name: string, apiCall: string): any {
    if (!this.apis[name]) throw new Error(`Failed to resolve api [${name}]`);

    if (!this.apis[name][apiCall])
      throw new Error(`Failed to resolve api call [${apiCall}]`);

    return this.apis[name][apiCall];
  }
}

export default new ApiResolver();
