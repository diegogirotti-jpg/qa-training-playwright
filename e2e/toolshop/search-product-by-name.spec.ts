import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Buscar un producto por nombre", async ({ page }) => {
    // 1. Desde catálogo limpio, escribir 'Combination Pliers' en Search.
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByRole("textbox", { name: "Search" }).fill("Combination Pliers");

    // 2. Pulsar Search.
    await page.getByRole("button", { name: "Search" }).click();

    // 3. Verificar que aparece Combination Pliers como único resultado.
    await expect(page.getByRole("heading", { name: "Searched for: Combination Pliers" })).toBeVisible();
    await expect(page.getByText("1 product found for 'Combination Pliers'", { exact: true })).toBeVisible();
    const results = page.locator('a[href*="/product/"]');
    await expect(results).toHaveCount(1);
    await expect(results).toContainText("Combination Pliers");
  });
});
