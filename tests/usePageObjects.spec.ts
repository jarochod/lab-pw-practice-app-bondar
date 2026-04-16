import { test } from "@playwright/test";
import { NavigationPage } from "../page-objects/NavigationPage";

// s6-ch46 | 46. First Page Object

test.beforeEach(async ({ page }) => {
  // Navigate to the local environment before each test execution
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  // Create a new instance of NavigationPage
  const navigateTo = new NavigationPage(page);
  // Execute the navigation method
  await navigateTo.formLayoutsPage();
});
