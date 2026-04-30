import { Page } from "@playwright/test";

// s6-ch49 | 49. Parametrized Methods

export class FormLayoutsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method to handle "Using the Grid" form with dynamic data
  async submitUsingTheGridFormWithCredentialsAndSelectOptions(email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator("nb-card", { hasText: "Using the Grid" });
    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingTheGridForm.getByRole("textbox", { name: "Password" }).fill(password);
    await usingTheGridForm.getByRole("radio", { name: optionText }).check({ force: true });
    await usingTheGridForm.getByRole("button").click();
  }

  /**
   * This method will fill out the Inline form with user details
   * @param name - should be first and last name
   * @param email - valid email for the test user
   * @param rememberMe - true or false to save the user session
   */
  async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
    const inlineForm = this.page.locator("nb-card", { hasText: "Inline form" });
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);

    const checkbox = inlineForm.getByRole("checkbox");
    // Conditional logic for the checkbox state
    if (rememberMe) {
      await checkbox.check({ force: true });
    } else {
      await checkbox.uncheck({ force: true });
    }
    await inlineForm.getByRole("button").click();
  }
}
