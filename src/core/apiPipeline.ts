import { styleText } from "node:util";
import { ProtocolError } from "../errors/protocol.js";
import type { ZodSchema } from "zod/v3";
import type z from "zod";
import { SchemaError } from "../errors/schema.js";

export class ApiPipeline<T extends Response | unknown> {
  constructor(private promise: Promise<T>) {}

  // ok状態を確保する
  // resを返す
  ensureOk(this: ApiPipeline<Response>): ApiPipeline<Response> {
    const next = this.promise.then((res: Response) => {
      if (!(res instanceof Response)) {
        process.stdout.write(styleText(
          ["bgRed", "white"],
          "fetch failed: received data is not Response type"
        ));
        throw new Error(`fetch failed: required Response but received ${typeof res}`);
      };
      if (res instanceof Response && !res.ok) throw new ProtocolError(res.status);

      return res;
    });

    return new ApiPipeline(next);
  }

  // jsonをパースする
  // jsonを返す
  json(this: ApiPipeline<Response>): ApiPipeline<unknown> {
    const next = this.promise.then((res: { json: () => void; }) => {
      if (!(res instanceof Response)) {
        process.stdout.write(styleText(
          ["bgRed", "white"],
          `parse json failed: required Response but received ${typeof res}`
        ));
        throw new Error(`parse json failed: required Response but received ${typeof res}`);
      };
      res.json();
    });

    return new ApiPipeline(next);
  }

  // jsonからデータを確定する
  // 使えるデータを返す
  execute(this: ApiPipeline<unknown>, schema: ZodSchema): Promise<z.infer<typeof schema>> {
    const parsed = schema.safeParse(this.promise);
    if (!parsed.success) throw new SchemaError(parsed.error.message);

    return parsed.data;
  }
}
