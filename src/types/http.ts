export const protocolErrorNameMap = {
  500: "InternalServerError",
  400: "InvalidRequestError",
  401: "UnAuthorizedError",
  403: "ForbiddenError",
  404: "NotFoundError"
} as const;
