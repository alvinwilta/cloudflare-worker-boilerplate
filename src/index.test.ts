import { unstable_dev } from "wrangler";
import type { Unstable_DevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

// TODO: Create tests
describe("Worker", () => {
  let worker: Unstable_DevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should return 200 on home route", async () => {
    const resp = await worker.fetch();
    expect(resp.status).toBe(200);
    const text = await resp.text();
    expect(text).toBe(JSON.stringify({ msg: "Server up and running" }));
  });
});
