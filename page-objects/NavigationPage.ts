import { Locator, Page } from "@playwright/test";

// s6-ch46 | 46. First Page Object
// s6-ch47 | 47. Navigation Page Object
// s6-ch48 | 48. Locators in Page Objects

// Page Object class to handle main navigation links
export class NavigationPage {
  readonly page: Page;
  readonly formLayoutsMenuItem: Locator;
  readonly datepickerMenuItem: Locator;
  readonly smartTableMenuItem: Locator;
  readonly toastrMenuItem: Locator;
  readonly tooltipMenuItem: Locator;


  constructor(page: Page) {
    this.page = page;
    this.formLayoutsMenuItem = page.getByText("Form Layouts");
    this.datepickerMenuItem = page.getByText("Datepicker");
    this.smartTableMenuItem = page.getByText("Smart Table");
    this.toastrMenuItem = page.getByText("Toastr");
    this.tooltipMenuItem = page.getByText("Tooltip");
  }

  // Method to navigate to the Form Layouts section
  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.formLayoutsMenuItem.click();
  }

  async datepickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.datepickerMenuItem.click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.smartTableMenuItem.click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.toastrMenuItem.click();
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.tooltipMenuItem.click();
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

