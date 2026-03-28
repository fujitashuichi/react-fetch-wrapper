import { ProtocolError } from "../errors/protocol.js";
import { Fetcher, type Init } from "./fetcher.js";
import { SchemaError } from "../errors/schema.js";
import type z from "zod";
import { styleText } from "node:util";


const METHODS = ["get", "post", "put", "delete"] as const;

export class ApiClient {
  path: string = "";

  constructor(path: string) {
    this.path = path;
  }


  private readonly fetcher = () => new Fetcher(this.path);

  private async request(method: typeof METHODS[number], init: Init, schema: z.ZodType) {
    try {
      return this.fetcher()[method](init)
        .ensureOk()
        .json()
        .execute(schema);
    } catch (e: unknown) {
      if (e instanceof ProtocolError) {
        process.stdout.write(styleText(
          ["bgRedBright"],
          `\nfetch failed with ${e.status}\n\n`
        ));
      }

      if (e instanceof SchemaError) {
        process.stdout.write(styleText(
          ["bgRedBright"],
          `\nreceived invalid data:\n ${e.message}\n\n`
        ));
      }
    }
  }

  get = (init: Init, schema: z.ZodType) => this.request("get", init, schema);
  post = (init: Init, schema: z.ZodType) => this.request("post", init, schema);
  put = (init: Init, schema: z.ZodType) => this.request("put", init, schema);
  delete = (init: Init, schema: z.ZodType) => this.request("delete", init, schema);
}
