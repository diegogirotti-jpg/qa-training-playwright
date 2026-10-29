import { expect, test } from "@playwright/test";

test.describe("Catálogo y carrito", () => {
  test("Agregar una unidad al carrito", async ({ page }) => {
    // 1. Desde estado limpio, abrir el catálogo y localizar Combination Pliers.
    await page.goto("https://practicesoftwaretesting.com/");
    const productLink = page.getByRole("link", { name: /^Combination Pliers/ });
    await expect(productLink).toBeVisible();

    // 2. Abrir el detalle, comprobar precio $14.15 y cantidad inicial 1.
    await productLink.click();
    await expect(page.getByRole("heading", { name: "Combination Pliers" })).toBeVisible();
    await expect(page.getByText("$14.15", { exact: true })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Quantity" })).toHaveValue("1");

    // 3. Pulsar Add to cart; comprobar aviso de agregado y badge 1.
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();
    await expect(page.locator('[data-test="nav-cart"]')).toHaveText("1");

    // 4. Abrir el carrito; verificar una fila con Combination Pliers, cantidad 1, precio y total $14.15.
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page.getByRole("row", { name: /Combination Pliers.*\$14\.15.*\$14\.15/ })).toBeVisible();
    await expect(page.getByRole("row", { name: /Total.*\$14\.15/ })).toBeVisible();
  });
});
