import { test as base, expect } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";

type ToolshopFixtures = {
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
};

// Cada prueba recibe sus propios Page Objects y el contexto aislado de Playwright.
export const test = base.extend<ToolshopFixtures>({
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});
export { expect };
