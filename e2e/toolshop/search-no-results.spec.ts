import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Buscar un texto sin coincidencias", async ({ page }) => {
    // 1. Desde catálogo limpio, escribir 'zzqv-no-product-987654' en Search.
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByRole("textbox", { name: "Search" }).fill("zzqv-no-product-987654");

    // 2. Pulsar Search.
    await page.getByRole("button", { name: "Search" }).click();

    // 3. Verificar que no hay productos y aparece 'There are no products found.'
    await expect(page.getByText("There are no products found.", { exact: true })).toBeVisible();
    await expect(page.locator('a[href*="/product/"]')).toHaveCount(0);
  });
});
