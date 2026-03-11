import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form Layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

// s5-ch33 | 33. Input Fields
  test("input fields", async ({ page }) => {
    // Locate the specific input field using a parent container (nb-card) and role filtering
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    // .fill() is the standard way to clear and set a value instantly
    await usingTheGridEmailInput.fill("test@test.com");

    // .clear() manually empties the input field
    await usingTheGridEmailInput.clear();

    // .pressSequentially() simulates real keyboard typing (useful for testing UI reactions/validations)
    // The 'delay' property adds a pause between each keystroke in milliseconds
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 200,
    });

    // Generic assertion: First, extract the value, then compare it using standard Jest-like syntax
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    // Locator assertion: A more powerful Playwright-specific way to verify the value
    // This supports auto-retrying until the condition is met
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });
});
