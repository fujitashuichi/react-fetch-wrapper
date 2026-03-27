import { styleText } from "node:util";
import { ProtocolError } from "../errors/protocol.js";
import type z from "zod";
import { SchemaError } from "../errors/schema.js";

export class ApiPipeline<T extends Response | unknown> {
  constructor(private promise: Promise<T>) {}

  // ok状態を確保する
  // resを返す
  ensureOk(this: ApiPipeline<Response>): ApiPipeline<Response> {
    const next: Promise<Response> = (async () => {
      const res: Response = await this.promise;
      if (!res.ok) throw new ProtocolError(res.status);

      return res;
    })();

    return new ApiPipeline(next);
  }

  // jsonをパースする
  // jsonを返す
  json(this: ApiPipeline<Response>): ApiPipeline<unknown> {
    const next: Promise<unknown> = (async () => {
      const res: Response = await this.promise;
      return res.json();
    })();

    return new ApiPipeline(next);
  }

  // jsonからデータを確定する
  // 使えるデータを返す
  async execute<T extends z.ZodType>(this: ApiPipeline<unknown>, schema: T): Promise<z.infer<T>> {
    const json: unknown = await this.promise;
    const parsed = schema.safeParse(json);

    if (!parsed.success) throw new SchemaError(parsed.error.message);

    return parsed.data;
  }
}
