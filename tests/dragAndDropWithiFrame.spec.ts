import { expect } from "@playwright/test";
import { test } from "../test-options"

// s5-ch44 | 44. Drag & Drop with iFrames
// s8-ch66 | 66. Environment Variables

test("drag and drop with iframe", async ({ page, globalsQaURL }) => {
  // Navigate to the drag and drop demo page
  await page.goto(globalsQaURL);

  // Close cookie consent banner if it appears (prevents UI blocking)
  const consentButton = page.locator("button.fc-cta-consent");
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  // Locate the specific iframe using the parent's rel-title attribute
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

  // Method 1: Automatic drag and drop using the built-in .dragTo() helper
  // Targets "High Tatras 2" and drops it into the #trash element
  await frame
    .locator("#gallery li h5", { hasText: "High Tatras 2" })
    .dragTo(frame.locator("#trash"));

  // Method 2: More precise control using the Mouse API (Manual Drag & Drop)
  // 1. Hover over the "High Tatras 4" element
  await frame.locator("#gallery li h5", { hasText: "High Tatras 4" }).hover();
  // 2. Press the mouse button down
  await page.mouse.down();
  // 3. Move the mouse to the target (#trash) while holding down
  await frame.locator("#trash").hover();
  // 4. Release the mouse button to perform the drop
  await page.mouse.up();

  // Assertion: Verify that both items are now present inside the trash list
  await expect(frame.locator("#trash li h5")).toHaveText([
    "High Tatras 2",
    "High Tatras 4",
  ]);
});

// s5-ch44 | 44. iFrames | Action: Delete via Trash Icon (Manual steps)
test("drag and drop with iframe 2", async ({ page, globalsQaURL }) => {
  // Open demo page
  await page.goto(globalsQaURL);

  // Close cookie consent banner if it appears (prevents UI blocking)
  const consentButton = page.locator("button.fc-cta-consent");
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  // Switch context to iframe with gallery
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

  // Delete "High Tatras 2" by clicking trash icon inside its <li>
  await frame
    .locator("#gallery li", { hasText: "High Tatras 2" })
    .locator(".ui-icon-trash")
    .click();

  // Delete "High Tatras 4" the same way
  await frame
    .locator("#gallery li", { hasText: "High Tatras 4" })
    .locator(".ui-icon-trash")
    .click();

  // Assert both items were moved to trash (appear as <li> inside #trash)
  await expect(frame.locator("#trash li h5")).toHaveText([
    "High Tatras 2",
    "High Tatras 4",
  ]);
});

// s5-ch44 | 44. iFrames | Action: Delete via Trash Icon (Refactored with Helper)
test("drag and drop with iframe 3", async ({ page, globalsQaURL }) => {
  // Open demo page
  await page.goto(globalsQaURL);

  // Close cookie consent banner if it appears (prevents UI blocking)
  const consentButton = page.locator("button.fc-cta-consent");
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  // Switch to gallery iframe
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

  // Helper: delete item from gallery by its title
  const deleteImage = async (title: string) => {
    await frame
      .locator("#gallery li", { hasText: title })
      .locator(".ui-icon-trash")
      .click();
  };

  // Delete two images
  await deleteImage("High Tatras 2");
  await deleteImage("High Tatras 4");

  // Assertion: verify images appear in trash
  const trashItems = frame.locator("#trash li h5");
  await expect(trashItems).toHaveText(["High Tatras 2", "High Tatras 4"]);
});
