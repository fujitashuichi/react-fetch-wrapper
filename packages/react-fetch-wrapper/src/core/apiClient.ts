import { ProtocolError } from "../errors/protocol.js";
import { Fetcher, type Init } from "./fetcher.js";
import { SchemaError } from "../errors/schema.js";
import type z from "zod";
import { styleText } from "node:util";


const METHODS = ["get", "post", "put", "delete"] as const;

type FetchProps = {
  schema: z.ZodType<any>,
  body?: any,
  init?: Init
}


export class ApiClient {
  url: string = "";

  constructor(url: string) {
    this.url = url;
  }


  private readonly fetcher = () => new Fetcher(this.url);

  private async request(method: typeof METHODS[number], schema: z.ZodType, body?: any, init?: Init) {
    try {
      return this.fetcher()[method](body, init)
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

  get = ({ schema, init }: FetchProps) => this.request("get", schema, init);
  post = ({ schema, body, init }: FetchProps) => this.request("post", schema, body, init);
  put = ({ schema, body, init }: FetchProps) => this.request("put", schema, body, init);
  delete = ({ schema, init }: FetchProps) => this.request("delete", schema, init);


  route = (path: string) => new ApiClient(`${this.url}${path}`);
}
