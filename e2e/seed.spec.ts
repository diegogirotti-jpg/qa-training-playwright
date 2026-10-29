import { test, expect } from "@playwright/test";

test("seed Toolshop", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await expect(page).toHaveTitle(/Toolshop/i);
});
