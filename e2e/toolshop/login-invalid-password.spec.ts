import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.use({ storageState: { cookies: [], origins: [] } });

function getNegativeAccountEmail(): string {
  const negativeEmail = process.env.TOOLSHOP_NEGATIVE_EMAIL;
  const validLoginEmail = process.env.TOOLSHOP_EMAIL;

  if (!negativeEmail) {
    throw new Error("Missing required environment variable: TOOLSHOP_NEGATIVE_EMAIL.");
  }
  if (!validLoginEmail) {
    throw new Error("Missing required environment variable TOOLSHOP_EMAIL; it is required to verify the negative account is distinct.");
  }
  if (negativeEmail.trim().toLowerCase() === validLoginEmail.trim().toLowerCase()) {
    throw new Error("TOOLSHOP_NEGATIVE_EMAIL must identify a different test account than TOOLSHOP_EMAIL.");
  }

  return negativeEmail;
}

function getFictionalWrongPassword(): string {
  const validPassword = process.env.TOOLSHOP_PASSWORD;
  const fictionalPassword = "Fictional-E2E-Wrong-Password-987!";
  return validPassword === fictionalPassword ? `${fictionalPassword}-not-valid` : fictionalPassword;
}

test.describe("Autenticación", () => {
  test("Login con el mismo correo y una contraseña incorrecta", async ({ page }) => {
    // Open a fresh login session for the enabled negative-test account.
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const negativeEmail = getNegativeAccountEmail();
    const wrongPassword = getFictionalWrongPassword();
    await loginPage.login(negativeEmail, wrongPassword);

    const accountLockedMessage = page.getByText(/Account locked/i);
    await expect(loginPage.invalidCredentialsMessage.or(accountLockedMessage)).toBeVisible();

    if (await accountLockedMessage.isVisible()) {
      throw new Error("The negative-login test account reported 'Account locked'; it is not an acceptable authentication result.");
    }

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login\/?$/);
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(page.locator('[data-test="nav-sign-in"]')).toBeVisible();
  });
});
