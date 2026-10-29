import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Cambiar la cantidad desde el carrito", async ({ page }) => {
    // 1. Desde carrito limpio, agregar una Combination Pliers ($14.15).
    await page.goto("https://practicesoftwaretesting.com/");
    await page.getByRole("link", { name: /^Combination Pliers/ }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(
      page.getByRole("alert", { name: "Product added to shopping cart." }),
    ).toBeVisible();

    // 2. Abrir carrito y cambiar Quantity for Combination Pliers de 1 a 2.
    await page.locator('[data-test="nav-cart"]').click();
    const quantity = page.locator('input[data-test="product-quantity"]');
    await expect(quantity).toHaveValue("1");
    await quantity.fill("2");
    await quantity.press("Tab");

    // 3. Verificar cantidad 2, importe de fila $28.30 y total general esperado $28.30.
    await expect(quantity).toHaveValue("2");
    await expect(
      page.getByRole("alert", { name: "Product quantity updated." }),
    ).toBeVisible();
    await expect(page.locator('[data-test="line-price"]')).toHaveText(
      "$228.30",
    );
    await expect(
      page.getByRole("row", { name: /Total.*\$28\.30/ }),
    ).toBeVisible();
  });
});
