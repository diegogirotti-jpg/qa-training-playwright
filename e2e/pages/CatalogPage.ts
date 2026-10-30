import { expect, type Locator, type Page } from "@playwright/test";

export class CatalogPage {
  readonly cards: Locator;
  readonly prices: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly sortSelect: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator('a[href*="/product/"]');
    this.prices = this.cards.locator('[data-test="product-price"]');
    this.searchInput = page.getByRole("textbox", { name: "Search" });
    this.searchButton = page.getByRole("button", { name: "Search", exact: true });
    this.sortSelect = page.locator('[data-test="sort"]');
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
    await expect(this.prices.first()).toBeVisible();
  }

  async returnHome(): Promise<void> {
    await this.page.locator('[data-test="nav-home"]').click();
    await expect(this.prices.first()).toBeVisible();
  }

  async openProduct(name: string): Promise<void> {
    const card = this.cards.filter({ has: this.page.getByText(name, { exact: true }) });
    await expect(card).toHaveCount(1);
    await card.click();
    await expect(this.page.locator('[data-test="product-name"]')).toHaveText(name);
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async priceValues(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((text) => {
      const match = /^\$([\d,]+\.\d{2})$/.exec(text.trim());
      return match ? Number(match[1].replace(/,/g, "")) : Number.NaN;
    });
  }
}
