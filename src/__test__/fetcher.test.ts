import { beforeEach, describe, expect, it, vi } from "vitest"
import { responseMock } from "../__mock__/response.mock.js";
import { Fetcher } from "../core/fetcher.js";

describe("fetcher", () => {
  describe("正常型", () => {
    const fetcher = new Fetcher("/api");

    beforeEach(() => {
      vi.spyOn(global, "fetch").mockResolvedValue(responseMock.okResponse(200));
    });

    it("getメソッドは正常に成功する", async () => {
      const data = await fetcher.get().ensureOk().json().execute(responseMock.okResponseSchema());
      expect(data).toBe(await responseMock.okResponse(200).json());
    });
  });
});
