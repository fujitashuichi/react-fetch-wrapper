import z from "zod";

const errorMap = {
  500: "InternalServerError",
  404: "NotFoundError",
  403: "ForbiddenError",
  401: "UnAuthorizedError"
} as const;

const createResponse = ({ ok, status, statusText, json }: {
  ok: boolean, status: number, statusText?: string, json?: any
}) => {
  return {
    ok,
    status,
    statusText,
    json: async () => {
      setTimeout(() => {}, 100);
      return json
    }
  } as unknown as Response;
}


export const responseMock = {
  okResponseSchema: () => {
    return z.literal("dummy")
  },

  okResponse: (status: 200 | 201) => {
    return createResponse({
      ok: true,
      status,
      json: "dummy"
    });
  },

  notOkResponse: (status: 500 | 404 | 403 | 401) => {
    return createResponse({
      ok: false,
      status: status,
      statusText: errorMap[status]
    });
  }
}
