import { expect, test } from "../fixtures/toolshop.fixture";

const combinationPliers = "Combination Pliers";
const slipJointPliers = "Slip Joint Pliers";

test.describe("Carrito", () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.goto();
  });

  test("Agregar una unidad al carrito", async ({ page, catalogPage, productPage, cartPage }) => {
    await catalogPage.openProduct(combinationPliers);
    await expect(page.getByText("$14.15", { exact: true })).toBeVisible();
    await expect(productPage.quantity).toHaveValue("1");
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText("1");

    await cartPage.open();
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.quantity(combinationPliers)).toHaveValue("1");
    await expect(cartPage.row(combinationPliers)).toContainText("$14.15");
    await expect(cartPage.linePrice(combinationPliers)).toHaveText("$14.15");
    await expect(cartPage.total).toHaveText("$14.15");
  });

  test("Agregar dos unidades del mismo producto", async ({ catalogPage, productPage, cartPage }) => {
    await catalogPage.openProduct(combinationPliers);
    await expect(productPage.quantity).toHaveValue("1");
    await productPage.increaseQuantity();
    await expect(productPage.quantity).toHaveValue("2");
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText("2");

    await cartPage.open();
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.quantity(combinationPliers)).toHaveValue("2");
    await expect(cartPage.row(combinationPliers)).toContainText("$14.15");
    await expect(cartPage.linePrice(combinationPliers)).toHaveText("$28.30");
    await expect(cartPage.total).toHaveText("$28.30");
  });

  test("Agregar dos productos distintos", async ({ catalogPage, productPage, cartPage }) => {
    await catalogPage.openProduct(combinationPliers);
    await productPage.addToCart();
    await catalogPage.returnHome();
    await catalogPage.openProduct(slipJointPliers);
    await productPage.addToCart();

    await cartPage.open();
    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.row(combinationPliers)).toContainText("$14.15");
    await expect(cartPage.quantity(combinationPliers)).toHaveValue("1");
    await expect(cartPage.row(slipJointPliers)).toContainText("$9.17");
    await expect(cartPage.quantity(slipJointPliers)).toHaveValue("1");
    await expect(cartPage.total).toHaveText("$23.32");
  });

  test("Cambiar la cantidad desde el carrito", async ({ catalogPage, productPage, cartPage }) => {
    await catalogPage.openProduct(combinationPliers);
    await productPage.addToCart();
    await cartPage.open();
    await expect(cartPage.quantity(combinationPliers)).toHaveValue("1");
    await cartPage.changeQuantity(combinationPliers, 2);

    await expect(cartPage.quantity(combinationPliers)).toHaveValue("2");
    await expect(cartPage.linePrice(combinationPliers)).toHaveText("$28.30");
    await expect(cartPage.total).toHaveText("$28.30");
  });

  test("Eliminar un producto del carrito", async ({ catalogPage, productPage, cartPage }) => {
    await catalogPage.openProduct(combinationPliers);
    await productPage.addToCart();
    await catalogPage.returnHome();
    await catalogPage.openProduct(slipJointPliers);
    await productPage.addToCart();
    await cartPage.open();
    await cartPage.remove(slipJointPliers);

    await expect(cartPage.row(slipJointPliers)).toHaveCount(0);
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.quantity(combinationPliers)).toHaveValue("1");
    await expect(cartPage.row(combinationPliers)).toContainText("$14.15");
    await expect(cartPage.total).toHaveText("$14.15");
  });

  test("Eliminar el último producto", async ({ catalogPage, productPage, cartPage }) => {
    await catalogPage.openProduct(combinationPliers);
    await productPage.addToCart();
    await cartPage.open();
    await expect(cartPage.rows).toHaveCount(1);
    await cartPage.remove(combinationPliers);

    await expect(cartPage.rows).toHaveCount(0);
    await expect(cartPage.emptyMessage).toBeVisible();
  });
});
