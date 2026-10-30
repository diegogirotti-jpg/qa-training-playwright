import { expect, test } from "@playwright/test";

test.describe("Carrito", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("Agregar una unidad al carrito", async ({ page }) => {
    // 1. Desde estado limpio, abrir el catálogo y localizar Combination Pliers.
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
    await expect(
      page
        .locator("tbody tr")
        .filter({ hasText: /^Combination Pliers/ })
        .locator('input[data-test="product-quantity"]'),
    ).toHaveValue("1");
    await expect(page.getByRole("row", { name: /Combination Pliers.*\$14\.15.*\$14\.15/ })).toBeVisible();
    await expect(page.getByRole("row", { name: /Total.*\$14\.15/ })).toBeVisible();
  });

  test("Agregar dos unidades del mismo producto", async ({ page }) => {
    // 1. Desde estado limpio, abrir Combination Pliers ($14.15).
    await page.getByRole("link", { name: /^Combination Pliers/ }).click();
    await expect(page.getByRole("heading", { name: "Combination Pliers" })).toBeVisible();

    // 2. Incrementar Quantity de 1 a 2 y comprobar que el valor es 2.
    const quantity = page.getByRole("spinbutton", { name: "Quantity" });
    await expect(quantity).toHaveValue("1");
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(quantity).toHaveValue("2");

    // 3. Pulsar Add to cart; comprobar aviso de agregado y badge 2.
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();
    await expect(page.locator('[data-test="nav-cart"]')).toHaveText("2");

    // 4. Abrir el carrito y comprobar una fila de Combination Pliers, cantidad 2, importe $28.30 y total $28.30.
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page.locator('input[data-test="product-quantity"]')).toHaveValue("2");
    await expect(page.getByRole("row", { name: /Combination Pliers.*\$14\.15.*\$28\.30/ })).toBeVisible();
    await expect(page.getByRole("row", { name: /Total.*\$28\.30/ })).toBeVisible();
  });

  test("Agregar dos productos distintos", async ({ page }) => {
    // 1. Desde carrito limpio, abrir Combination Pliers ($14.15) y agregar una unidad.
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

  test("Cambiar la cantidad desde el carrito", async ({ page }) => {
    // 1. Desde carrito limpio, agregar una Combination Pliers ($14.15).
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
    await expect(page.locator('[data-test="line-price"]')).toHaveText("$28.30");
    await expect(
      page.getByRole("row", { name: /Total.*\$28\.30/ }),
    ).toBeVisible();
  });

  test("Eliminar un producto del carrito", async ({ page }) => {
    // 1. Desde estado limpio, agregar una Combination Pliers ($14.15) y un Pliers ($12.01).
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

  test("Eliminar el último producto", async ({ page }) => {
    // 1. Desde estado limpio, agregar una Combination Pliers ($14.15).
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
