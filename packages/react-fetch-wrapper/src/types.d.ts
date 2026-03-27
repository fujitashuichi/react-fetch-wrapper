import { ZodSchema } from "zod";


export type PipelineValue = Response | unknown;

export interface IApiPipeline<T> {
  readonly promise: Promise<T>;

  ensureOk(): IApiPipeline<Response>;
  json(): IApiPipeline<unknown>;
  execute<S>(schema: ZodSchema<S>): Promise<S>;
}


export interface FetcherOptions extends RequestInit {}
