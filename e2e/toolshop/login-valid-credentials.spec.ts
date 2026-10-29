import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

function getCredentials(): { email: string; password: string } {
  const email = process.env.TOOLSHOP_EMAIL;
  const password = process.env.TOOLSHOP_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing required environment variables: TOOLSHOP_EMAIL and TOOLSHOP_PASSWORD.");
  }

  return { email, password };
}

test.describe("Autenticación", () => {
  test("Login con credenciales válidas", async ({ page }) => {
    // 1. Start with a new isolated Playwright test context and open /auth/login.
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // 2. Read TOOLSHOP_EMAIL and TOOLSHOP_PASSWORD from process.env; never print them. If either is absent, fail with a clear missing-environment-variable error without revealing values.
    const { email, password } = getCredentials();

    // 3. Submit the supplied credentials using the verified email, password, and Login controls.
    await loginPage.login(email, password);

    // 4. Verify successful authentication by leaving /auth/login and hiding the Login form.
    await expect(page).not.toHaveURL(/\/auth\/login\/?$/);
    await expect(loginPage.loginHeading).toBeHidden();
  });
});
