import { test } from "@playwright/test";
import { NavigationPage } from "../page-objects/NavigationPage";
import { FormLayoutsPage } from "../page-objects/FormLayoutsPage";
import { DatepickerPage } from "../page-objects/DatepickerPage";

// s6-ch46 | 46. First Page Object
// s6-ch47 | 47. Navigation Page Object
// s6-ch50 | 50. Date Picker Page Object

test.beforeEach(async ({ page }) => {
  // Navigate to the local environment before each test execution
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  // Create a new instance of NavigationPage
  const navigateTo = new NavigationPage(page);
  // Execute the navigation method
  await navigateTo.formLayoutsPage();
  await navigateTo.datepickerPage();
  await navigateTo.smartTablePage();
  await navigateTo.toastrPage();
  await navigateTo.tooltipPage();
});

test("parametrized methods test", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  const onFormLayoutsPage = new FormLayoutsPage(page);
  const onDatepickerPage = new DatepickerPage(page);

  await navigateTo.formLayoutsPage();

  // High-level abstraction: we focus on "what" we do, not "how"
  await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOptions("test@test.com", "welcome1", "Option 2");

  // Reusing the same logic for different test cases
  await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox("John Smith", "John@test.com", true);
  await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox("Jan Kowalski", "test@test.com", false);

  // Reusing methods for different date picker components
  await navigateTo.datepickerPage();
  await onDatepickerPage.selectCommonDatePickerDateFromToday(5);
  await onDatepickerPage.selectDatepickerWithRangeFromToday(5,8);
});
