import { fetchPriceObservations } from "../src/sources.mjs";
const code = process.argv[2];
if (!code) {
  console.log(
    "Usage : node examples/open-prices.mjs CODE_PRODUIT — appel réseau explicite",
  );
} else {
  console.log(JSON.stringify(await fetchPriceObservations(code), null, 2));
}
