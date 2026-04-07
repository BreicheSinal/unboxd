import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /get your mystery shirt/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /how it works/i }).first()).toBeVisible();
});
