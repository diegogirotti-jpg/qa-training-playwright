import { test, expect } from "@playwright/test";

test("el carrito muestra el total de una unidad", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page
    .locator('[data-test="product-01M63VYGM1BTD7VC7NE4MBD2WF"]')
    .click();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.locator('[data-test="nav-cart"]').click();
  await expect(page.locator('[data-test="cart-total"]')).toHaveText("$14.15");
});
