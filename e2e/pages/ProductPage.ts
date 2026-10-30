import { expect, type Locator, type Page } from "@playwright/test";

export class ProductPage {
  readonly quantity: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.quantity = page.getByRole("spinbutton", { name: "Quantity" });
    this.cartBadge = page.locator('[data-test="nav-cart"]');
  }

  async increaseQuantity(): Promise<void> {
    await this.page.getByRole("button", { name: "Increase quantity" }).click();
  }

  async addToCart(): Promise<void> {
    const addButton = this.page.getByRole("button", { name: "Add to cart" });
    await expect(addButton, "El producto debe estar disponible para agregarlo al carrito").toBeEnabled();
    await addButton.click();
    await expect(this.page.getByRole("alert", { name: "Product added to shopping cart." })).toBeVisible();
  }
}
