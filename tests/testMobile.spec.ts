import { test, expect } from "@playwright/test";

// s8-ch72 | 72. Mobile Device Emulator

test("input fields", async ({ page }, testInfo) => {
  await page.goto("/");

  // Open menu for mobile project only
  if (testInfo.project.name === "mobile") {
    await page.locator(".sidebar-toggle").click();
  }

  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();

  // Close menu on mobile to reveal content
  if (testInfo.project.name === "mobile") {
    await page.locator(".sidebar-toggle").click();
  }

  // Locate the input field
  const usingTheGridEmailInput = page.locator("nb-card", { hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" });

  // Interaction variants with input
  await usingTheGridEmailInput.fill("test@test.com");
  await usingTheGridEmailInput.clear();
  await usingTheGridEmailInput.pressSequentially("test2@test.com");
});
