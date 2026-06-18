import { test, expect } from "@playwright/test";

// s8-ch63 | 63. Test Retries
// s8-ch64 | 64. Parallel Execution

test.describe.configure({ mode: "parallel" });


test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Form Layouts page", () => {
  test.describe.configure({ retries: 2 });
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  // s5-ch33 | 33. Input Fields
  test("input fields", async ({ page}, testInfo) => {
    if (testInfo.retry) {
      // do something
      console.log(`To jest powtórzenie testu. Próba numer: ${testInfo.retry}`);
    }
    // Locate the specific input field using a parent container (nb-card) and role filtering
    const usingTheGridEmailInput = page.locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    // .fill() is the standard way to clear and set a value instantly
    await usingTheGridEmailInput.fill("test@test.com");

    // .clear() manually empties the input field
    await usingTheGridEmailInput.clear();

    // .pressSequentially() simulates real keyboard typing (useful for testing UI reactions/validations)
    // The 'delay' property adds a pause between each keystroke in milliseconds
    await usingTheGridEmailInput.pressSequentially("test2@test.com");

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

// s5-ch38 | 38. Dialog Boxes - page.on version (Listener)
test("dialog box", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  /**
   * EVENT LISTENER REGISTRATION:
   * We tell Playwright: "Whenever a dialog box appears from now on, execute this block".
   * This must be defined BEFORE the action that triggers the dialog (the click).
   */
  page.on("dialog", dialog => {
    // Verify if the dialog message text is correct
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    // Perform the "OK" action on the browser dialog
    dialog.accept();
  });

  // This action triggers the native browser dialog
  await page.getByRole("table").locator("tr", {hasText: "mdo@gmail.com"})
    .locator(".nb-trash").click();

  // Verify that the row with the email address was successfully removed
  await expect(page.locator("table tr").first()).not.toHaveText("mdo@gmail.com");
});

// s5-ch38 | 38. Dialog Boxes - Custom Promise Version (Bulletproof Solution)
test("Dialog Box - Custom Promise (Bulletproof Solution)", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1. Create a custom Promise that resolves only when the listener finishes its job
  const dialogHandled = new Promise<void>((resolve) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toEqual("Are you sure you want to delete?");
      await dialog.accept();
      resolve(); // Resolves the Promise
    });
  });

  // 2. Perform the click action. Even if the JS thread gets temporarily frozen,
  // the listener from step 1 will handle and close the dialog in the background.
  await page.locator(".nb-trash").first().click();

  // 3. Explicitly wait for confirmation that our custom Promise has been fully resolved
  await dialogHandled;

  // 4. Verify the final result
  await expect(page.locator("table tr").first()).not.toHaveText("mdo@gmail.com");
});

/*
// s5-ch38 | 38. Dialog Boxes - waitForEvent version (Promise)
// Doesn't work
// Deadlock: click() waits for the dialog to close,
// but dialog.accept() runs only after click() finishes.

test("dialog box with waitForEvent", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1. Initialize a Promise to wait for the dialog event.
  // Don't use 'await' here yet, or the test will hang before the click.
  const dialogPromise = page.waitForEvent("dialog");

  // 2. Perform the action that triggers the native browser dialog.
  await page.getByRole("table").locator("tr", {hasText: "mdo@gmail.com"})
    .locator(".nb-trash").click();

  // 3. Wait for the Promise to resolve and capture the dialog object.
  const dialog = await dialogPromise;

  // 4. Verify the message text and accept (click OK).
  expect(dialog.message()).toEqual("Are you sure you want to delete?");
  await dialog.accept();

  // 5. Verify that the row was successfully removed from the table.
  await expect(page.locator("table tr").first()).not.toHaveText("mdo@gmail.com");
});
*/

// s5-ch39 | 39. Web Tables (Part 1)
test("web tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1. Get the row by any text present in that row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click(); // Scoped locator: clicks edit only within this row

  // Targeting the editor input by placeholder and updating value
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click(); // Click confirm/checkmark icon

  // 2. Get the row based on a value in a specific column (more precise)
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();

  // Locate row with text "11" AND ensure the 2nd column (index 1) actually contains "11"
  const targetRowById = page.getByRole("row", { name: "11" }).filter({
    has: page.locator("td").nth(1).getByText("11")
  });

  await targetRowById.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page.locator("input-editor").getByPlaceholder("E-mail").fill("test@test.com");
  await page.locator(".nb-checkmark").click();

  // Assertion: Verify that the 6th column (index 5) displays the updated email
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");


// s5-ch40 | 40. Web Tables (Part 2)
  // 3. Define an array of age values to test the table filter functionality
  const ages = ["20", "30", "40", "200"];

  for (let age of ages) {
    // Locate the filter input by its placeholder, clear existing value and type new age
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);

    // Wait for the table to filter the data (handling the UI debounce)
    await page.waitForTimeout(500);

    // Get all rows currently visible in the table body
    const ageRows = page.locator("tbody tr");

    // Iterate through each row returned by the locator
    for(let row of await ageRows.all()){
      // Get the text from the last cell (Age column)
      const cellValue = await row.locator("td").last().textContent();

      if (age === "200"){
        // If age is "200", we expect no results and a specific empty state message
        expect(await page.getByRole("table").textContent()).toContain("No data found");
      } else {
        // Otherwise, verify that the row's age matches the applied filter
        expect(cellValue).toEqual(age);
      }
    }
  }
});

// s5-ch41 | 41. Date Picker (Part 1)
// s5-ch42 | 42. Date Picker (Part 2)
test("datepicker", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  // Create a date object and add 100 days to current date
  let date = new Date();
  date.setDate(date.getDate() + 10);

  // Extract date components for selection and validation
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("En-US", {month: "short"});
  const expectedMonthLong = date.toLocaleString("En-US", {month: "long"});
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  // Read current month and year visible in the date picker
  let calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;

  // Loop to navigate through the calendar until the target month/year is reached
  while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
    calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
  }

  // NOT RECOMMENDED: [class="..."] fails if the day has the 'today' class added
  // await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();

  // RECOMMENDED: Select day cell while ignoring adjacent month days (.bounding-month)
  // Dot notation (.) ensures the element is found even with extra classes like 'today'
  await page.locator(".day-cell:not(.bounding-month)").getByText(expectedDate, {exact: true}).click();

  // Assertion to verify that the input value matches the selected date
  await expect(calendarInputField).toHaveValue(dateToAssert);
});

// s5-ch43 | 43. Sliders
test("sliders", async ({ page }) => {
  /*
  // --- Approach 1: Attribute Update (commented out) ---
  // Fast but bypasses the UI layer - modifies the DOM directly.

  const tempGauge = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger circle");
  const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger");

  // Use .evaluate to run JS in the browser and change the coordinates of the circle
  await tempGauge.evaluate( node => {
     node.setAttribute("cx", "232.63098833543773");
     node.setAttribute("cy", "232.63098833543773");
  });

  // Trigger a click to ensure the component registers the manual DOM change
  await tempGauge.click();
  await expect(tempBox).toContainText("30");
*/
  // --- Approach 2: Mouse movement ---
  // Best practice for E2E - mimics a real user interaction.

  const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger");

  // Scroll the element into the viewport to make it interactable
  await tempBox.scrollIntoViewIfNeeded();

  // Retrieve the element's position and dimensions
  const box = await tempBox.boundingBox();

  // Calculate the center coordinates of the slider
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  // Execute the Drag-and-Drop sequence:
  await page.mouse.move(x, y);       // Hover over the center
  await page.mouse.down();            // Press mouse button
  await page.mouse.move(x + 80, y);   // Move 80px to the right
  await page.mouse.move(x + 80, y + 120); // Move 120px down
  await page.mouse.up();              // Release mouse button

  // Assert that the text value has updated correctly
  await expect(tempBox).toContainText("30");
});



