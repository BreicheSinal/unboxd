import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /wear the unknown/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /how it works/i })).toBeVisible();
});
