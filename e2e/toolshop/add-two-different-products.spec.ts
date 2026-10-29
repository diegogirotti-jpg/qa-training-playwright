import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Agregar dos productos distintos", async ({ page }) => {
    // 1. Desde carrito limpio, abrir Combination Pliers ($14.15) y agregar una unidad.
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByRole("link", { name: /^Combination Pliers/ }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();

    // 2. Volver al catálogo, abrir Pliers ($12.01) y agregar una unidad.
    await page.locator('[data-test="nav-home"]').click();
    await page.getByRole("link", { name: /^Pliers Compare/ }).click();
    await expect(page.locator('[data-test="product-name"]')).toHaveText("Pliers");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();

    // 3. Abrir el carrito y comprobar dos filas independientes con cantidad 1 y total general $26.16.
    await page.locator('[data-test="nav-cart"]').click();
    const cartRows = page.locator("tbody tr");
    await expect(cartRows).toHaveCount(2);
    const combinationPliersRow = cartRows.filter({ hasText: /^Combination Pliers/ });
    const pliersRow = cartRows.filter({ hasText: /^Pliers/ });
    await expect(combinationPliersRow).toContainText("$14.15");
    await expect(combinationPliersRow.locator('input[data-test="product-quantity"]')).toHaveValue("1");
    await expect(pliersRow).toContainText("$12.01");
    await expect(pliersRow.locator('input[data-test="product-quantity"]')).toHaveValue("1");
    await expect(page.getByRole("row", { name: /Total.*\$26\.16/ })).toBeVisible();
  });
});
