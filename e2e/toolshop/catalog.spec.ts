import { expect, test } from "@playwright/test";

test.describe("Ordenamiento del catálogo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("Ordenar productos por precio de menor a mayor", async ({ page }) => {

    const sortSelect = page.locator('select[data-test="sort"]');

    await expect(sortSelect).toBeVisible();

    await expect(
      page.locator('a[href*="/product/"] [data-test="product-price"]').first(),
    ).toBeVisible();

    await sortSelect.selectOption("price,asc");
    await expect(sortSelect).toHaveValue("price,asc");

    await expect
      .poll(async () => {
        const priceTexts = await page
          .locator('a[href*="/product/"] [data-test="product-price"]')
          .allTextContents();

        const prices = priceTexts.map((text) => {
          const match = /^\$([\d,]+\.\d{2})$/.exec(text.trim());

          return match ? Number(match[1].replace(/,/g, "")) : Number.NaN;
        });

        return {
          hasAtLeastTwo: prices.length >= 2,
          allFinite: prices.every(Number.isFinite),
          nonDecreasing: prices.every(
            (price, index) => index === 0 || prices[index - 1] <= price,
          ),
        };
      })
      .toMatchObject({
        hasAtLeastTwo: true,
        allFinite: true,
        nonDecreasing: true,
      });
  });
});
