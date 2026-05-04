import { Page } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutsPage } from "../page-objects/formLayoutsPage";
import { DatepickerPage } from "../page-objects/datepickerPage";

// s6-ch51 | 51. Page Objects Manager

export class PageManager {
  private readonly page: Page;
  private readonly navigationPage: NavigationPage;
  private readonly formLayoutsPage: FormLayoutsPage;
  private readonly datepickerPage: DatepickerPage;

  constructor(page: Page) {
    this.page = page;
    // Initialize all page objects in one central place
    this.navigationPage = new NavigationPage(this.page);
    this.formLayoutsPage = new FormLayoutsPage(this.page);
    this.datepickerPage = new DatepickerPage(this.page);
  }

  // Returns the instance of the navigation page
  navigateTo() {
    return this.navigationPage;
  }

  // Returns the instance of the form layouts page
  onFormLayoutsPage() {
    return this.formLayoutsPage;
  }

  // Returns the instance of the datepicker page
  onDatepickerPage() {
    return this.datepickerPage;
  }
}
