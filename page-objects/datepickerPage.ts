import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

// s6-ch50 | 50. Date Picker Page Object

// Extends HelperBase to access shared page properties and utility methods
export class DatepickerPage extends HelperBase {
  constructor(page: Page) {
    // Passes the page object to the parent HelperBase class
    super(page);
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder("Form Picker");
    await calendarInputField.click();
    const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday);
    await expect(calendarInputField).toHaveValue(dateToAssert);
  }

  async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder("Range Picker");
    await calendarInputField.click();
    const DateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday);
    const DateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday);
    const dateToAssert = `${DateToAssertStart} - ${DateToAssertEnd}`;
    await expect(calendarInputField).toHaveValue(dateToAssert);
  }

  /**
   * Calculates the target date, navigates the calendar to the correct month,
   * and selects the day.
   * @param numberOfDaysFromToday - The number of days to add to the current date.
   * @returns The formatted date string used for assertions.
   */
  private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);

    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
    const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;

    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
      calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
    }

    // Select day while ignoring adjacent month days (.bounding-month)
    await this.page.locator(".day-cell:not(.bounding-month)").getByText(expectedDate, { exact: true }).click();
    return dateToAssert;
  }
}
