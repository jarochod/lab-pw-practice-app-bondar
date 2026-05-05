import { Page } from "@playwright/test";

// s6-ch52 | 52. Page Objects Helper Base

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Universal wait method shared across different Page Objects
  async waitForNumberOfSeconds(timeInSeconds: number) {
    await this.page.waitForTimeout(timeInSeconds * 1000);
  }
}
