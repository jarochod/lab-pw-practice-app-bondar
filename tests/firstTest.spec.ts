import { expect, test } from "@playwright/test";
import { filter } from "rxjs-compat/operator/filter";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

// s4-ch24 | 24. Locator Syntax Rules
test("Locator syntax rules", async ({ page }) => {
  // by Tag name
  await page.locator("input").first().click();

  // by ID
  page.locator("#inputEmail1");

  // by Class value
  page.locator(".shape-rectangle");

  // by atribute
  page.locator('[placeholder="Email"]');

  // by Class value (full)
  page.locator(
    '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]',
  );

  // combine different selectors
  page.locator('input[placeholder="Email"]');

  // by XPath (NOT RECOMMENDED)
  page.locator('//*[@id="inputEmail1"]');

  // by partial text match
  page.locator(':text("Using")');

  // by exact text match
  page.locator(':text-is("Using the Grid")');
});

// s4-ch25 | 25. User-Facing Locators
test("User facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").click();

  await page.getByText("Using the Grid").click();

  await page.getByTestId("SignIn").click();

  await page.getByTitle("IoT Dashboard").click();
});

// s4-ch26 | 26. Child Elements
test("Locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 1")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  await page.locator("nb-card").nth(3).getByRole("button").click();
});

// s4-ch27 | 27. Parent Elements
test("Locating parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

// s4-ch28 | 28. Reusing Locators
test("Reusing the locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  const passwordField = basicForm.getByRole("textbox", { name: "Password" });

  await emailField.fill("test@test.com");
  await passwordField.fill("Welcome123");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button", { name: "SUBMIT" }).click();

  await expect(emailField).toHaveValue("test@test.com");
});

// s4-ch29 | 29. Extracting Values
test("Extracting values", async ({ page }) => {
  // single test value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.getByRole("button").textContent();
  expect(buttonText).toEqual("Submit");

  // all text values
  const allRadioButtonsLabels = await page.locator("nb-radio").allTextContents();
  expect(allRadioButtonsLabels).toContain("Option 1");

  // input value
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test@test.com");

  // atribute value
  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});
