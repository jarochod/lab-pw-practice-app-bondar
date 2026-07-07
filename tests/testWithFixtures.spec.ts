import { test } from "../test-options";
import { faker } from "@faker-js/faker";

// s8-ch68 | Fixtures
// refactor: s8-ch68 | 68. Fixtures - custom generic approach complying with DRY and POM

test("navigate to form page", async ({ pm }) => {
  // PageManager navigation flow
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("parametrized methods test", async ({ page, pm, formLayoutsPage }) => {
  // Generate dynamic test data
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(/ /g, '')}${faker.number.int(100)}@test.com`;

  // Form page fixture provides required page state
  await pm.onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOptions(
      process.env.USERNAME,
      process.env.PASSWORD,
      "Option 2"
    );

  // Capture screenshots for verification
  await page.screenshot({ path: "screenshots/formsLayoutsPage.png" });
  const buffer = await page.screenshot();
  console.log(buffer.toString("base64"));

  await pm.onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);

  await page.locator("nb-card", { hasText: "Inline form" })
    .screenshot({ path: "screenshots/inlineForm.png" });

  // Continue flow using PageManager navigation
  await pm.navigateTo().datepickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5);
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(5, 8);
});
