import { expect, test } from "../fixtures/toolshop.fixture";

test.describe("Búsqueda", () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.goto();
  });

  test("Buscar un producto por nombre", async ({ page, catalogPage }) => {
    // Buscar desde el catálogo limpio: 'Combination Pliers' en Search.
    await catalogPage.search("Combination Pliers");

    // Verificar que aparece Combination Pliers como único resultado.
    await expect(
      page.getByRole("heading", { name: "Searched for: Combination Pliers" }),
    ).toBeVisible();
    await expect(
      page.getByText("1 product found for 'Combination Pliers'", {
        exact: true,
      }),
    ).toBeVisible();
    const results = catalogPage.cards;
    await expect(results).toHaveCount(1);
    await expect(results.locator('[data-test="product-name"]')).toHaveText("Combination Pliers");
  });

  test("Buscar un texto sin coincidencias", async ({ page, catalogPage }) => {
    // Buscar desde el catálogo limpio: 'zzqv-no-product-987654' en Search.
    await catalogPage.search("zzqv-no-product-987654");

    // Verificar que no hay productos y aparece 'There are no products found.'
    await expect(
      page.getByText("There are no products found.", { exact: true }),
    ).toBeVisible();
    await expect(catalogPage.cards).toHaveCount(0);
  });
});
