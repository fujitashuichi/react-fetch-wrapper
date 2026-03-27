import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { responseMock } from "../__mock__/response.mock.js";
import { Fetcher } from "../core/fetcher.js";

describe("fetcher", () => {
  describe("正常型", () => {
    const fetcher = new Fetcher("/api");

    beforeEach(() => {
      vi.spyOn(global, "fetch").mockResolvedValue(responseMock.okResponse(200));
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("getメソッドは正常に成功する", async () => {
      const data = await fetcher.get().ensureOk().json().execute(responseMock.okResponseSchema());
      expect(data).toBe(await responseMock.okResponse(200).json());
    });
  });


  describe("異常型", () => {
    const fetcher = new Fetcher("/api");

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("getメソッドは正常に失敗する", () => {
      [500, 404, 403, 401].forEach(async (status) => {
        vi.spyOn(global, "fetch").mockResolvedValue(responseMock.notOkResponse(status));
        const data = await fetcher.get().ensureOk().json().execute(responseMock.okResponseSchema()).catch((err) => {
          console.log(err);
        });
        expect(data).toBe(undefined);
      });
    });
  });
});
