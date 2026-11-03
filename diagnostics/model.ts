export type Product = { name: string; price: string; href: string | null };
export type Observation = {
  id: "BUG-002" | "BUG-003";
  capturedAt: string;
  browser: string;
  platform: string;
  osRelease: string;
  url: string;
  complete: boolean;
  reproduced: boolean;
  data: Record<string, unknown>;
  measurements: Record<string, number>;
};

// Trabaja en centavos para comparar importes sin introducir error de coma flotante.
export function priceInCents(value: string): number | null {
  const match = /^\$([\d,]+)\.(\d{2})$/.exec(value.trim());
  return match ? Number(match[1].replaceAll(",", "")) * 100 + Number(match[2]) : null;
}

export function measurePrices(products: Product[]) {
  const values = products.map((p) => priceInCents(p.price));
  const valid = products.length >= 2 && values.every((p) => p !== null && Number.isSafeInteger(p));
  const violations = valid ? values.slice(1).filter((p, i) => values[i]! > p!).length : 0;
  return { valid, cards: products.length, adjacentPairs: Math.max(0, products.length - 1), violations };
}

export function classify(observation: Observation | undefined, status: string) {
  if (!observation?.complete) return "INCONCLUSO";
  if (status === "failed" && observation.reproduced) return "HALLAZGO_REPRODUCIDO";
  if (status === "passed" && !observation.reproduced) return "SIN_HALLAZGO";
  return "INCONCLUSO";
}
