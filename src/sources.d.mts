import type { Document } from "./index.mjs";
export function fetchPriceObservations(
  code: string,
  options?: { fetchImpl?: typeof fetch; signal?: AbortSignal },
): Promise<{
  observations: unknown[];
  complete: boolean;
  total: number;
  document: Document;
}>;
