import { Page } from "@playwright/test";

// s6-ch46 | 46. First Page Object
// s6-ch47 | 47. Navigation Page Object

// Page Object class to handle main navigation links
export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method to navigate to the Form Layouts section
  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
  }

  async datepickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByText("Smart Table").click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click();
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  // Private helper to handle menu expansion logic
  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuTitle = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuTitle.getAttribute("aria-expanded");
    // Only click if the menu is currently collapsed
    if (expandedState == "false") await groupMenuTitle.click();
  }
}

/*
  // Alternative locator implementations for selectGroupMenuItem

  private async selectGroupMenuItem(groupItemTitle: string) {
    // Locating by ARIA role 'link' and accessible name
    const groupMenuLink = this.page.getByRole("link", { name: groupItemTitle });
    const expandedState = await groupMenuLink.getAttribute("aria-expanded");
    if (expandedState === "false") await groupMenuLink.click();
  }

  private async selectGroupMenuItem(groupItemText: string) {
    // Locating via CSS selector 'a' that contains specific text
    const groupMenuLink = this.page.locator("a", { hasText: groupItemText });
    const expandedState = await groupMenuLink.getAttribute("aria-expanded");
    if (expandedState === "false") await groupMenuLink.click();
  }
*/

