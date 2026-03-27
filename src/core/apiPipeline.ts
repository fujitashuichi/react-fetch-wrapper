import { ProtocolError } from "../errors/protocol.js";
import type z from "zod";
import { SchemaError } from "../errors/schema.js";
import type { IApiPipeline } from "../types.js";

export class ApiPipeline<T extends Response | unknown> {
  constructor(
    readonly promise: Promise<T>
  ) {}


  // ok状態を確保する
  // resを返す
  ensureOk(this: IApiPipeline<Response>): IApiPipeline<Response> {
    const next: Promise<Response> = (async () => {
      const res: Response = await this.promise;
      if (!res.ok) throw new ProtocolError(res.status);

      return res;
    })();

    return new ApiPipeline(next);
  }

  // jsonをパースする
  // jsonを返す
  json(this: IApiPipeline<Response>): IApiPipeline<unknown> {
    const next: Promise<unknown> = (async () => {
      const res: Response = await this.promise;
      return res.json();
    })();

    return new ApiPipeline(next);
  }

  // jsonからデータを確定する
  // 使えるデータを返す
  async execute<T extends z.ZodType>(this: IApiPipeline<unknown>, schema: T): Promise<z.infer<T>> {
    const json: unknown = await this.promise;
    const parsed = schema.safeParse(json);

    if (!parsed.success) throw new SchemaError(parsed.error.message);

    return parsed.data;
  }
}
