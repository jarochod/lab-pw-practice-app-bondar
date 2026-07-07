import { test as base } from "@playwright/test";
import { PageManager } from "./page-objects/pageManager";

// s8-ch66 | 66. Environment Variables
// s8-ch68 | Fixtures
// refactor: s8-ch68 | 68. Fixtures - custom generic approach complying with DRY and POM

// Definition of extended test options and fixture types
export type TestOptions = {
  globalsQaURL: string;
  homePage: string;
  pm: PageManager;
  formLayoutsPage: string;
};

export const test = base.extend<TestOptions>({
  // s8-ch66 | Environment Variables property
  globalsQaURL: ["", { option: true }],

  // Lifecycle fixture replacing global beforeEach hooks
  homePage: async ({ page }, use) => {
    await page.goto("/");
    await use("");
  },

  // Centralized PageManager instance dependent on homePage
  pm: async ({ page, homePage }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },

  // Enhanced fixture reusing POM logic instead of hardcoded selectors
  formLayoutsPage: async ({ pm }, use) => {
    await pm.navigateTo().formLayoutsPage();
    await use("");
  },
});
