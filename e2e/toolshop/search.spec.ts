import { expect, test } from "@playwright/test";

test.describe("Búsqueda", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");

    await expect(
      page.locator('a[href*="/product/"] [data-test="product-price"]').first(),
    ).toBeVisible();
  });

  test("Buscar un producto por nombre", async ({ page }) => {
    // 1. Desde catálogo limpio, escribir 'Combination Pliers' en Search.
    await page
      .getByRole("textbox", { name: "Search" })
      .fill("Combination Pliers");

    // 2. Pulsar Search.
    await page.getByRole("button", { name: "Search" }).click();

    // 3. Verificar que aparece Combination Pliers como único resultado.
    await expect(
      page.getByRole("heading", { name: "Searched for: Combination Pliers" }),
    ).toBeVisible();
    await expect(
      page.getByText("1 product found for 'Combination Pliers'", {
        exact: true,
      }),
    ).toBeVisible();
    const results = page.locator('a[href*="/product/"]');
    await expect(results).toHaveCount(1);
    await expect(results).toContainText("Combination Pliers");
  });

  test("Buscar un texto sin coincidencias", async ({ page }) => {
    // 1. Desde catálogo limpio, escribir 'zzqv-no-product-987654' en Search.
    await page
      .getByRole("textbox", { name: "Search" })
      .fill("zzqv-no-product-987654");

    // 2. Pulsar Search.
    await page.getByRole("button", { name: "Search" }).click();

    // 3. Verificar que no hay productos y aparece 'There are no products found.'
    await expect(
      page.getByText("There are no products found.", { exact: true }),
    ).toBeVisible();
    await expect(page.locator('a[href*="/product/"]')).toHaveCount(0);
  });
});
