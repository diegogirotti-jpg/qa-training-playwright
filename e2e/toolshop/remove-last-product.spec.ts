import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Eliminar el último producto", async ({ page }) => {
    // 1. Desde estado limpio, agregar una Combination Pliers ($14.15).
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByRole("link", { name: /^Combination Pliers/ }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();

    // 2. Abrir el carrito y eliminar la única fila.
    await page.locator('[data-test="nav-cart"]').click();
    const cartRows = page.locator("tbody tr");
    await expect(cartRows).toHaveCount(1);
    await cartRows.locator("a.btn-danger").click();
    await expect(page.getByRole("alert", { name: "Product deleted." })).toBeVisible();

    // 3. Verificar aviso de producto eliminado, ausencia de filas y mensaje exacto 'The cart is empty. Nothing to display.'
    await expect(cartRows).toHaveCount(0);
    await expect(page.getByText("The cart is empty. Nothing to display.", { exact: true })).toBeVisible();
  });
});
