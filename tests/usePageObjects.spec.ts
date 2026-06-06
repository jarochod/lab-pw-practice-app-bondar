import { test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

// s6-ch46 | 46. First Page Object
// s6-ch47 | 47. Navigation Page Object
// s6-ch50 | 50. Date Picker Page Object
// s6-ch51 | 51. Page Objects Manager
// s8-ch62 | 62. Test Data Generator

test.beforeEach(async ({ page }) => {
  // Navigate to the local environment before each test execution
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  // Create a new instance of NavigationPage
  const pm = new PageManager(page);
  // Execute the navigation method
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("parametrized methods test", async ({ page }) => {
  const pm = new PageManager(page);

  // Generate random full name using Faker library
  const randomFullName = faker.person.fullName();
  // OLD: const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(100)}@test.com` (replaces only the first space)
  // FIX: Use regex / /g to replace all spaces in multi-part names and generate random valid email
  const randomEmail = `${randomFullName.replace(/ /g, '')}${faker.number.int(100)}@test.com`;

  await pm.navigateTo().formLayoutsPage();

  // High-level abstraction: we focus on "what" we do, not "how"
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOptions("test@test.com", "welcome1", "Option 2");

  // Reusing the same logic for different test cases
  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);
  //await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox("Jan Kowalski", "test@test.com", false);

  // Reusing methods for different date picker components
  await pm.navigateTo().datepickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5);
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(5,8);
});
