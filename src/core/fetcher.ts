import { ApiPipeline } from "./apiPipeline.js";

type ContentType = "application/json" | "text/html";
type Credentials = "include" | "omit" | "same-origin";

export type Init = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  contentType: ContentType;
  credentials: Credentials;
  body: any;
};


export class Fetcher {
  path: string = "";

  constructor(path: string) {
    this.path = path;
  }

  get = (init?: Init) => new ApiPipeline(
    fetch(this.path, init)
  );

  post = (body: any, init?: Init) => new ApiPipeline(
    fetch(this.path, { ...init, body })
  );

  put = (body: any, init?: Init) => new ApiPipeline(
    fetch(this.path, { ...init, body })
  );

  delete = (body: any, init?: Init) => new ApiPipeline(
    fetch(this.path, { ...init, body })
  );
}
