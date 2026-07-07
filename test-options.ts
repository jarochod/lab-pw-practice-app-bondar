import { test as base } from "@playwright/test";
import { PageManager } from "./page-objects/pageManager";

// s8-ch66 | 66. Environment Variables
// s8-ch68 | 68. Fixtures

export type TestOptions = {
  globalsQaURL: string;
  formLayoutsPage: string;
  pageManager: PageManager;
};

export const test = base.extend<TestOptions>({
  globalsQaURL: ["", { option: true }],

  formLayoutsPage: async ({ page }, use) => {
    console.log("Setup formLayoutsPage")
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
    await use("");
    console.log("Teardown formLayoutsPage");
  },

  pageManager: async ({ page, formLayoutsPage }, use) => {
    console.log("Setup pageManager")
    const pm = new PageManager(page);
    await use(pm);
    console.log("Teardown pageManager");
  },
});
