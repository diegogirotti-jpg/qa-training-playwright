import { test as base, expect, type Page } from "@playwright/test";
import os from "node:os";
import { measurePrices, type Observation, type Product } from "../model";

const test = base.extend<{ observation: Observation }>({
  observation: async ({ page, browser }, use, testInfo) => {
    const observation: Observation = {
      id: testInfo.title.startsWith("BUG-002") ? "BUG-002" : "BUG-003",
      capturedAt: new Date().toISOString(), browser: `Chromium ${browser.version()}`,
      platform: process.platform, osRelease: os.release(), url: "",
      complete: false, reproduced: false, data: {}, measurements: {},
    };
    try {
      await use(observation);
    } finally {
      observation.capturedAt = new Date().toISOString();
      observation.url = page.url();
      await testInfo.attach("observation", {
        body: JSON.stringify(observation, null, 2), contentType: "application/json",
      });
      // La falta de captura no debe ocultar la causa principal de un fallo.
      if (!page.isClosed()) {
        try {
          await testInfo.attach("visible-screen", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
          await testInfo.attach("visible-text", { body: await page.locator("body").innerText(), contentType: "text/plain" });
        } catch (error) {
          await testInfo.attach("capture-error", { body: String(error), contentType: "text/plain" });
        }
      }
    }
  },
});

async function products(page: Page): Promise<Product[]> {
  return page.locator('a.card[href*="/product/"]').evaluateAll((cards) => cards.map((card) => ({
    name: card.querySelector('[data-test="product-name"]')?.textContent?.trim() ?? "",
    price: card.querySelector('[data-test="product-price"]')?.textContent?.trim() ?? "",
    href: card.getAttribute("href"),
  })));
}

test("BUG-002 Home debe volver al catálogo desde Contacto", async ({ page, observation }) => {
  await page.goto("/#/contact", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();
  const home = page.getByRole("link", { name: "Home", exact: true });
  observation.data = { beforeUrl: page.url(), homeHref: await home.getAttribute("href") };
  await home.click();
  try {
    await expect(page).toHaveURL(/\/(?:#\/?)?$/);
    await expect(page.locator('a.card[href*="/product/"]').first()).toBeVisible();
  } finally {
    const contactVisible = await page.getByRole("heading", { name: "Contact", exact: true }).isVisible();
    const actualUrl = page.url();
    observation.data = { ...observation.data, actualUrl, contactVisible };
    observation.complete = true;
    observation.reproduced = new URL(actualUrl).hash === "#/contact" && contactVisible;
    observation.measurements = { attempts: 1, unexpectedContactDestinations: observation.reproduced ? 1 : 0 };
  }
});

test("BUG-003 Price Low - High debe mostrar precios no decrecientes", async ({ page, observation }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-test="product-price"]').first()).toBeVisible();
  const select = page.locator('[data-test="sort"]');
  observation.data = { selectedLabel: "Price (Low - High)", before: await products(page) };
  // Espera una respuesta real de catálogo posterior a la selección; no pausas fijas.
  const responsePromise = page.waitForResponse((response) =>
    response.request().method() === "GET" &&
    new URL(response.url()).pathname === "/products" &&
    new URL(response.url()).searchParams.has("sort"));
  await select.selectOption({ label: "Price (Low - High)" });
  const response = await responsePromise;
  observation.data = { ...observation.data, requestUrl: response.url(), responseStatus: response.status() };
  expect(response.status(), "El catálogo debe responder antes de evaluar su orden").toBe(200);
  await expect(page.locator('[data-test="product-price"]').first()).toBeVisible();
  const payload = await response.json();
  const names = Array.isArray(payload.data) ? payload.data.map((p: { name: string }) => p.name) : [];
  expect(names.length, "La respuesta debe contener productos").toBeGreaterThan(1);
  await expect.poll(async () => (await products(page)).map(p => p.name), {
    message: "La UI debe mostrar los productos de la respuesta de orden",
  }).toEqual(names);

  const actual = await products(page);
  const measured = measurePrices(actual);
  observation.data = { ...observation.data, selectedValue: await select.inputValue(), products: actual };
  observation.measurements = { attempts: 1, cards: measured.cards, adjacentPairs: measured.adjacentPairs, ascendingViolations: measured.violations };
  observation.complete = measured.valid;
  observation.reproduced = measured.valid && measured.violations > 0;
  expect(measured.valid, "Al menos dos precios válidos son necesarios para evaluar el orden").toBe(true);
  expect(measured.violations, "Cada precio debe ser menor o igual que el siguiente").toBe(0);
});
