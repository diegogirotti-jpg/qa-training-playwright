import { defineConfig, devices } from "@playwright/test";

// Independiente del config principal: no carga .env ni usa autenticación.
export default defineConfig({
  testDir: "./diagnostics/specs",
  outputDir: "diagnostic-output/test-results",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  workers: 1,
  retries: 0,
  fullyParallel: false,
  forbidOnly: true,
  reporter: [
    ["line"],
    ["html", { outputFolder: "diagnostic-output/playwright-report", open: "never" }],
    ["./diagnostics/standard-reporter.ts"],
  ],
  use: {
    baseURL: "https://with-bugs.practicesoftwaretesting.com",
    storageState: { cookies: [], origins: [] },
    locale: "en-US",
    timezoneId: "America/Argentina/Mendoza",
    navigationTimeout: 45_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
