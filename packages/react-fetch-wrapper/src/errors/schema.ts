import type { z } from "zod";

export class SchemaError extends Error {
  constructor(message: z.ZodError["message"]) {
    super(message);
    this.name = "SchemaError";
  }
}
