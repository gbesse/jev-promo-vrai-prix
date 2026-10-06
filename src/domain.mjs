import {
  str,
  obj,
  arrays,
  rows,
  integer,
  finite,
  safe,
  money,
  sum,
  boolean,
  one,
  refs,
  semantic,
  check,
  date,
  addYears,
} from "./helpers.mjs";
export const LIMIT =
  "Les observations disponibles ne constituent pas un historique national exhaustif. Le gain fidélité dépend de son utilisation et n’est pas une remise immédiate.";
export function validateInput(x) {}
export function prepare(x) {
  obj(x.offer);
  obj(x.reference);
  integer(x.offer.units, 1);
  integer(x.offer.quantityGrams, 1);
  money(x.offer.totalCents);
  money(x.offer.shippingCents);
  money(x.offer.loyaltyCents);
  money(x.reference.unitCents);
  str(x.offer.productCode);
  str(x.reference.productCode);
  integer(x.offer.advertisedDiscountPercent, 0, 100);
  date(x.reference.date);
  const r = refs(x.offer, x.reference);
  const upfront = sum([x.offer.totalCents, x.offer.shippingCents]);
  if (x.offer.loyaltyCents > upfront)
    throw new TypeError("Crédit fidélité supérieur au prix");
  const base = safe(x.reference.unitCents * x.offer.units);
  const net = upfront - x.offer.loyaltyCents;
  const ratio = base ? Math.round(((base - net) * 10000) / base) : null;
  const checks = [
    check(
      "produit",
      "Même produit de référence",
      x.offer.productCode === x.reference.productCode,
      r,
    ),
    check(
      "gain",
      "Remise annoncée atteinte sous conditions",
      ratio === null ? null : ratio >= x.offer.advertisedDiscountPercent * 100,
      r,
      "Distinguer paiement immédiat et crédit fidélité utilisable.",
    ),
  ];
  const pairs = [
    semantic(
      "conditions",
      "Conditions de la publicité",
      x.offer.description,
      x.offer.terms,
      refs(x.offer),
      "Les conditions du lot et de la fidélité soutiennent-elles toute la promesse de la publicité ?",
      true,
    ),
  ];
  return {
    checks,
    pairs,
    outputs: {
      paiementImmediatCentimes: upfront,
      coutApresFideliteCentimes: net,
      referencePanierCentimes: base,
      economieSousConditionsCentimes: base - net,
      remisePointsDeBase: ratio,
      prixAuKiloImmediatCentimes: Math.round(
        (upfront * 1000) / (x.offer.units * x.offer.quantityGrams),
      ),
      prixAuKiloApresFideliteCentimes: Math.round(
        (net * 1000) / (x.offer.units * x.offer.quantityGrams),
      ),
      observationReference: x.reference.date,
    },
  };
}
