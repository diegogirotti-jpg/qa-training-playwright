import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Eliminar un producto del carrito", async ({ page }) => {
    // 1. Desde estado limpio, agregar una Combination Pliers ($14.15) y un Pliers ($12.01).
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByRole("link", { name: /^Combination Pliers/ }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();
    await page.locator('[data-test="nav-home"]').click();
    await page.getByRole("link", { name: /^Pliers Compare/ }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();

    // 2. Abrir carrito y eliminar solo la fila Pliers.
    await page.locator('[data-test="nav-cart"]').click();
    const cartRows = page.locator("tbody tr");
    const pliersRow = cartRows.filter({ hasText: /^Pliers/ });
    await expect(pliersRow).toBeVisible();
    await pliersRow.locator("a.btn-danger").click();
    await expect(page.getByRole("alert", { name: "Product deleted." })).toBeVisible();

    // 3. Verificar que Combination Pliers permanece con cantidad 1 y total $14.15, sin Pliers.
    await expect(cartRows.filter({ hasText: /^Pliers/ })).toHaveCount(0);
    const combinationPliersRow = cartRows.filter({ hasText: "Combination Pliers" });
    await expect(combinationPliersRow).toHaveCount(1);
    await expect(combinationPliersRow.locator('input[data-test="product-quantity"]')).toHaveValue("1");
    await expect(combinationPliersRow).toContainText("$14.15");
    await expect(page.getByRole("row", { name: /Total.*\$14\.15/ })).toBeVisible();
  });
});
