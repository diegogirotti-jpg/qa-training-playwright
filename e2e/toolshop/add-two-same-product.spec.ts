import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Agregar dos unidades del mismo producto", async ({ page }) => {
    // 1. Desde estado limpio, abrir Combination Pliers ($14.15).
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByRole("link", { name: /^Combination Pliers/ }).click();
    await expect(page.getByRole("heading", { name: "Combination Pliers" })).toBeVisible();

    // 2. Incrementar Quantity de 1 a 2 y comprobar que el valor es 2.
    const quantity = page.getByRole("spinbutton", { name: "Quantity" });
    await expect(quantity).toHaveValue("1");
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(quantity).toHaveValue("2");

    // 3. Pulsar Add to cart.
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();

    // 4. Abrir el carrito y comprobar una fila de Combination Pliers, cantidad 2, importe $28.30 y total $28.30.
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page.locator('input[data-test="product-quantity"]')).toHaveValue("2");
    await expect(page.getByRole("row", { name: /Combination Pliers.*\$14\.15.*\$28\.30/ })).toBeVisible();
    await expect(page.getByRole("row", { name: /Total.*\$28\.30/ })).toBeVisible();
  });
});
