// s4-ch31 | 31. Auto-Waiting
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();

  // Extend test timeout by 2 seconds to handle potential network latency
  testInfo.setTimeout(testInfo.timeout + 2000);
});

test("Auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // Playwright automatically waits for the element to be visible and enabled before clicking.
  /*
  await successButton.click();
  const text =  await successButton.textContent();
  expect(text).toEqual("Data loaded with AJAX get request.");
  */

  // Explicitly waiting for the element to be attached to the DOM before fetching all text contents.
  /*
  await successButton.waitFor({state: "attached"});
  const text_all = await successButton.allTextContents();
  expect(text_all).toContain("Data loaded with AJAX get request.");
  */

  // Web-first assertions have a built-in retry mechanism and wait until the condition is met.
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {timeout: 20000});
});

// Exploring manual waiting strategies when standard auto-waiting is not sufficient.
test("Alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // Wait for a specific selector to appear in the DOM.
  // ___ wait for element
  // await page.waitForSelector(".bg-success");

  // Wait for a specific API network response to be received.
  // ___ wait for particular response
  await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

  // Wait until there are no network connections for at least 500ms (use with caution).
  // ___ wait for network calls to be completed (NOT RECOMMENDED)
  // await page.waitForLoadState("networkidle");

  const text_all = await successButton.allTextContents();
  expect(text_all).toContain("Data loaded with AJAX get request.");
});

// s4-ch32 | 32. Timeouts
test("Timeouts", async ({ page }) => {
  // Manually set test-level timeout
  // test.setTimeout(16500);

  // Triple the default test timeout (useful for debugging/slow environments)
  test.slow();

  const successButton = page.locator(".bg-success");

  // Override action-level timeout for this specific click
  // await successButton.click({timeout: 16000});

  await successButton.click();
});
