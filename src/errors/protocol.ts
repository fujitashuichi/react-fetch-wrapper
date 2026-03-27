
type Status =
  | 500
  | 400 | 401 | 403 | 404
  | number


const message = (status: Status) => {
  return `fetch failed with status: ${status}`
};

const errorNameMap = {
  500: "InternalServerError",
  400: "InvalidRequestError",
  401: "UnAuthorizedError",
  403: "ForbiddenError",
  404: "NotFoundError"
} as const;


export class ProtocolError extends Error {
  status: number | undefined;

  constructor (status: Status) {
    super(message(status));
    this.name = (errorNameMap as Record<number, string>)[status] ?? "ProtocolError";
    this.status = status;
  }
}
