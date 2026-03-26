import { Fetcher, type Init } from "./fetcher.js";
import type { ZodSchema } from "zod/v3";


const METHODS = ["get", "post", "put", "delete"] as const;

export class ApiClient {
  path: string = "";

  constructor(path: string) {
    this.path = path;
  }


  private readonly fetcher = () => new Fetcher(this.path);

  private async request(method: typeof METHODS[number], init: Init, schema: ZodSchema) {
    return this.fetcher()[method](init)
      .ensureOk()
      .json()
      .execute(schema);
  }

  get = (init: Init, schema: ZodSchema) => this.request("get", init, schema);
  post = (init: Init, schema: ZodSchema) => this.request("post", init, schema);
  put = (init: Init, schema: ZodSchema) => this.request("put", init, schema);
  delete = (init: Init, schema: ZodSchema) => this.request("delete", init, schema);
}
