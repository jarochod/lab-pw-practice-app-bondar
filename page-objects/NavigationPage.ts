import { Page } from "@playwright/test";

// s6-ch46 | 46. First Page Object

// Page Object class to handle main navigation links
export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the Form Layouts section
  async formLayoutsPage() {
    await this.page.getByText("Forms").click();
    await this.page.getByText("Form Layouts").click();
  }
}
