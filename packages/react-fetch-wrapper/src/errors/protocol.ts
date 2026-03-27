import { protocolErrorNameMap } from "../types/http.js";

type Status =
  | 500
  | 400 | 401 | 403 | 404
  | number


const message = (status: Status) => {
  return `fetch failed with status: ${status}`
};


export class ProtocolError extends Error {
  status: number | undefined;

  constructor (status: Status) {
    super(message(status));
    this.name = (protocolErrorNameMap as Record<number, string>)[status] ?? "ProtocolError";
    this.status = status;
  }
}
