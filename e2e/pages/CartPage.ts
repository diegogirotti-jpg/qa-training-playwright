import { expect, type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly rows: Locator;
  readonly total: Locator;
  readonly emptyMessage: Locator;

  constructor(private readonly page: Page) {
    // Solo filas de productos: una tabla de especificaciones no tiene este input.
    this.rows = page.locator("tbody tr").filter({ has: page.locator('[data-test="product-quantity"]') });
    this.total = page.locator('[data-test="cart-total"]');
    this.emptyMessage = page.getByText("The cart is empty. Nothing to display.", { exact: true });
  }

  async open(): Promise<void> {
    await this.page.locator('[data-test="nav-cart"]').click();
    await expect(this.page).toHaveURL(/\/checkout\/?(?:\?.*)?$/);
    await expect(this.rows.first()).toBeVisible();
  }

  row(name: string): Locator {
    return this.rows.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  quantity(name: string): Locator {
    return this.row(name).locator('[data-test="product-quantity"]');
  }

  linePrice(name: string): Locator {
    return this.row(name).locator('[data-test="line-price"]');
  }

  async changeQuantity(name: string, quantity: number): Promise<void> {
    const input = this.quantity(name);
    await input.fill(String(quantity));
    await input.press("Tab");
    await expect(this.page.getByRole("alert", { name: "Product quantity updated." })).toBeVisible();
  }

  async remove(name: string): Promise<void> {
    // Selector existente: se mantiene hasta verificar un atributo estable en la UI.
    await this.row(name).locator("a.btn-danger").click();
    await expect(this.page.getByRole("alert", { name: "Product deleted." })).toBeVisible();
  }
}
