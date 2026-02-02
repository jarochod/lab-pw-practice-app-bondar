import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("suite-1", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Charts", { exact: true }).click();
  });

  test("suite-1 | navigate to Echarts page", async ({ page }) => {
    await page.getByText("Echarts").click();
  });
});

test.describe("suite-2", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
  });

  test("suite-2 | the first test", async ({ page }) => {
    await page.getByText("Form Layouts").click();
  });

  test("suite-2 | navigate to datepicker page", async ({ page }) => {
    await page.getByText("Datepicker").click();
  });
});
