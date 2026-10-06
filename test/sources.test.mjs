import test from "node:test";
import assert from "node:assert/strict";
import { fetchPriceObservations } from "../src/sources.mjs";
test("Des observations partielles ne deviennent pas un historique exhaustif", async () => {
  const r = await fetchPriceObservations("12345678", {
    fetchImpl: async () => Response.json({ items: [{ price: 4 }], total: 200 }),
  });
  assert.equal(r.complete, false);
  assert.equal(r.observations.length, 1);
});
test("Un code arbitraire est rejeté avant le réseau", async () => {
  await assert.rejects(fetchPriceObservations("../x"), /numérique/);
});
