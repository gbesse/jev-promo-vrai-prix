import { analyze, toHtml, type Dossier, type Report } from "../src/index.mjs";
import { createJevClient } from "../src/jev.mjs";
import { importManifest } from "../src/adapters.mjs";
const dossier: Dossier = {
  id: "jev-promo-vrai-prix-demo",
  offer: {
    docId: "a",
    productCode: "DEMO-CAFE",
    units: 2,
    quantityGrams: 250,
    totalCents: 800,
    shippingCents: 0,
    loyaltyCents: 200,
    advertisedDiscountPercent: 25,
    description:
      "25 % d’économie avec 2 euros crédités sur la carte pour le lot de deux.",
    terms:
      "Lot de deux paquets à 8 euros. Carte requise ; crédit de 2 euros utilisable lors d’un achat ultérieur.",
  },
  reference: {
    docId: "b",
    productCode: "DEMO-CAFE",
    unitCents: 400,
    date: "2026-09-28",
  },
  documents: [
    {
      id: "a",
      text: "DEMO-CAFE\n2\n250\n800\n0\n200\n25\n25 % d’économie avec 2 euros crédités sur la carte pour le lot de deux.\nLot de deux paquets à 8 euros. Carte requise ; crédit de 2 euros utilisable lors d’un achat ultérieur.",
      source: {
        uri: "fixture:a",
        date: "2026-10-06",
        kind: "synthetique",
        licence: "CC0-1.0",
      },
    },
    {
      id: "b",
      text: "DEMO-CAFE\n400\n2026-09-28",
      source: {
        uri: "fixture:b",
        date: "2026-10-06",
        kind: "synthetique",
        licence: "CC0-1.0",
      },
    },
  ],
};
const report: Report = await analyze(dossier, {
  mode: "jev",
  provider: createJevClient({ apiKey: "test-de-type" }),
});
const html: string = toHtml(report);
void html;
const imported: Dossier = await importManifest("examples/manifest.json");
void imported;
// @ts-expect-error Les champs métier sont obligatoires.
await analyze({ id: "vide", documents: [] });
