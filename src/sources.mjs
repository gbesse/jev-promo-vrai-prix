import { getJson, document } from "./io.mjs";
import { text } from "./index.mjs";
export async function fetchPriceObservations(code, { fetchImpl, signal } = {}) {
  text(code);
  if (!/^\d{8,14}$/.test(code))
    throw new TypeError("Code produit numérique de 8 à 14 chiffres requis");
  const u = new URL("https://prices.openfoodfacts.org/api/v1/prices");
  u.searchParams.set("product_code", code);
  u.searchParams.set("size", "100");
  const raw = await getJson(u.href, { fetchImpl, signal });
  if (
    !Array.isArray(raw.items) ||
    !Number.isSafeInteger(raw.total) ||
    raw.total < raw.items.length
  )
    throw new TypeError("Réponse Open Prices invalide");
  return {
    observations: raw.items,
    complete: raw.total === raw.items.length,
    total: raw.total,
    document: document("open-prices", JSON.stringify(raw), {
      uri: u.href,
      kind: "observations-prix",
      licence: "Vérifier les licences Open Prices",
    }),
  };
}
