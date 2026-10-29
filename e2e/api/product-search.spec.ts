import { expect, test } from "@playwright/test";

const productsSearchEndpoint = "https://api.practicesoftwaretesting.com/products/search";

type ProductSearchResult = {
  name: string;
  price: number;
};

type ProductSearchResponse = {
  data: ProductSearchResult[];
  total: number;
};

function isProductSearchResponse(value: unknown): value is ProductSearchResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;
  return (
    Array.isArray(response.data) &&
    typeof response.total === "number" &&
    response.data.every(
      (product) =>
        typeof product === "object" &&
        product !== null &&
        typeof (product as Record<string, unknown>).name === "string" &&
        typeof (product as Record<string, unknown>).price === "number",
    )
  );
}

test.describe("Búsqueda de productos por API", () => {
  test("Buscar un producto existente por nombre", async ({ request }) => {
    const response = await request.fetch(productsSearchEndpoint, {
      method: "QUERY",
      headers: { "Content-Type": "application/json" },
      data: { q: "Combination Pliers" },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/application\/json/i);

    const body: unknown = await response.json();
    expect(isProductSearchResponse(body)).toBe(true);
    if (!isProductSearchResponse(body)) {
      throw new Error("Product search response did not match the expected structure.");
    }

    expect(body.total).toBe(1);
    expect(body.data).toHaveLength(1);
    const product = body.data[0];
    expect(product).toBeDefined();
    if (!product) {
      throw new Error("Expected one matching product in the search response.");
    }
    expect(product.name).toBe("Combination Pliers");
    expect(product.price).toBe(14.15);
  });

  test("Buscar un producto inexistente", async ({ request }) => {
    const response = await request.fetch(productsSearchEndpoint, {
      method: "QUERY",
      headers: { "Content-Type": "application/json" },
      data: { q: "zzqv-no-product-987654" },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/application\/json/i);

    const body: unknown = await response.json();
    expect(isProductSearchResponse(body)).toBe(true);
    if (!isProductSearchResponse(body)) {
      throw new Error("Product search response did not match the expected structure.");
    }

    expect(body.data).toEqual([]);
    expect(body.total).toBe(0);
  });
});
