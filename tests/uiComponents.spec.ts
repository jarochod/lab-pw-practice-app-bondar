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
    const usingTheGridEmailInput = page.locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    // .fill() is the standard way to clear and set a value instantly
    await usingTheGridEmailInput.fill("test@test.com");

    // .clear() manually empties the input field
    await usingTheGridEmailInput.clear();

    // .pressSequentially() simulates real keyboard typing (useful for testing UI reactions/validations)
    // The 'delay' property adds a pause between each keystroke in milliseconds
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {delay: 200});

    // Generic assertion: First, extract the value, then compare it using standard Jest-like syntax
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    // Locator assertion: A more powerful Playwright-specific way to verify the value
    // This supports auto-retrying until the condition is met
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  // s5-ch34 | 34. Radio Buttons
  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {hasText: "Using the Grid"});

    // Use .check() to select a radio button.
    // We use { force: true } because Nebular (and many UI kits) visually hides
    // the actual <input> element. Playwright won't click it otherwise.
    await usingTheGridForm.getByRole("radio", { name: "Option 1" }).check({ force: true });

    // Generic assertion: Manual check of the state using .isChecked()
    const radioStatus = await usingTheGridForm.getByRole("radio", { name: "Option 1" }).isChecked();
    expect(radioStatus).toBeTruthy();

    // Locator assertion: The preferred way, built-in auto-retries for the checked state
    await expect(usingTheGridForm.getByRole("radio", { name: "Option 1" })).toBeChecked();

    // Selecting a second radio button automatically unchecks the first one (standard radio behavior)
    await usingTheGridForm.getByRole("radio", { name: "Option 2" }).check({ force: true });

    // Verifying the state after change: Option 1 should now be false, Option 2 should be true
    expect(await usingTheGridForm.getByRole("radio", { name: "Option 1" }).isChecked()).toBeFalsy();
    expect(await usingTheGridForm.getByRole("radio", { name: "Option 2" }).isChecked()).toBeTruthy();
  });
});

// s5-ch35 | 35. Checkboxes
test("checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  // click() toggles the checkbox; force: true bypasses actionability checks
  // await page.getByRole("checkbox", { name: "Hide on click" }).click({ force: true });

  // check() ensures the checkbox is selected;
  // await page.getByRole("checkbox", { name: "Hide on click" }).check({ force: true });

  // uncheck() ensures it is deselected
  await page.getByRole("checkbox", { name: "Hide on click" }).uncheck({ force: true });

  // Selecting a specific checkbox by its role and name
  await page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" }).check({ force: true });

  // Iterating through all checkboxes on the page
  const allBoxes = await page.getByRole("checkbox");
  for (const box of await allBoxes.all()) {
    await box.uncheck({ force: true });
    // Verify that the checkbox is unchecked
    expect(await box.isChecked()).toBeFalsy();
  }
});

// s5-ch36 | 36. Lists and Dropdowns
test("lists and dropdowns", async ({ page }) => {
  // Locate the dropdown component in the header (the trigger element)
  const dropDownsMenu = page.locator("ngx-header nb-select");

  // OPTIONAL: Initial click if you want to perform a standalone action before the loop
  await dropDownsMenu.click();

  // REMINDER: getByRole is best for standard HTML elements
  // page.getByRole("list"); // Use this when the list is built with a <ul> tag
  // page.getByRole("listitem"); // Use this when the list is built with <li> tags

  // DIFFERENT APPROACHES:
  // const optionList = page.getByRole("list").locator("nb-option"); // Chaining locator with role
  const optionList = page.locator("nb-option-list nb-option"); // Direct locator for the custom Nebular option list

  // ASSERTION EXAMPLES:
  // Check if the list contains all expected values at once
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

  // Single interaction example
  await optionList.filter({ hasText: "Cosmic"}).click();

  const header = page.locator("nb-layout-header");

  // ASSERTION EXAMPLE: Checking specific CSS property value
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");


  // Data for the test loop: theme name as key, expected RGB color as value
  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  // LOOP: Iterate through the colors object to test each theme automatically
  for (const color in colors) {
    // 1. Open the dropdown menu
    await dropDownsMenu.click();

    // 2. Select the option by filtering through the list using the current color name
    await optionList.filter({ hasText: color }).click();

    // 3. Verify if the header background color changed to the correct RGB value
    await expect(header).toHaveCSS("background-color", colors[color]);
  }
});

// s5-ch37 | 37. Tooltips
test("tooltips", async ({ page }) => {
  // Navigate to the specific section in the application
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  // Locate the card container that holds the tooltip buttons
  const toolTipCard = page.locator("nb-card", {hasText: "Tooltip Placements"});

  // Simulate mouse hover over the button to trigger the tooltip
  await toolTipCard.getByRole("button", {name: "Top"}).hover();

  // Locate the tooltip using ARIA role (if defined in the HTML)
  // page.getByRole("tooltip");

  // Method 1: Generic Assertion (fetching text to a variable)
  // Extracting text content manually from the nb-tooltip element
  const tooltip_txt = await page.locator("nb-tooltip").textContent();
  expect(tooltip_txt).toEqual("This is a tooltip");

  // Method 2: Locator Assertion (Web-First) - RECOMMENDED
  // Playwright automatically waits for the element to appear and match the text
  const tooltip = page.locator("nb-tooltip");
  await expect(tooltip).toHaveText("This is a tooltip");
});
