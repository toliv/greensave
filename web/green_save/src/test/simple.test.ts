// sum.test.js
import { createCaller } from "@/server";
import { expect, test } from "vitest";

test("adds 1 + 2 to equal 3", async () => {
  const c = createCaller({});

  const r = await c.greeting();

  expect(r).toEqual("hello");
});
