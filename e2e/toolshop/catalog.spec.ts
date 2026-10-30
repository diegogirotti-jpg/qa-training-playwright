import { expect, test } from "../fixtures/toolshop.fixture";

test.describe("Ordenamiento del catálogo", () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.goto();
  });

  test("Ordenar productos por precio de menor a mayor", async ({ catalogPage }) => {

    const sortSelect = catalogPage.sortSelect;

    await expect(sortSelect).toBeVisible();

    // La opción visible debe existir con el texto exacto antes de seleccionarla.
    await expect(
      sortSelect.locator("option", { hasText: "Price (Low - High)" }),
    ).toHaveCount(1);

    await sortSelect.selectOption({ label: "Price (Low - High)" });
    await expect(sortSelect).toHaveValue("price,asc");
    await expect(sortSelect.locator("option:checked")).toHaveText(
      "Price (Low - High)",
    );

    await expect
      .poll(async () => {
        const prices = await catalogPage.priceValues();

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
