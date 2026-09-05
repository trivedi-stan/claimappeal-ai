import { test, expect } from "@playwright/test";

test.describe("ClaimAppeal AI E2E User Flows", () => {
  test("landing page renders with hero section and CTA buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ClaimAppeal AI/i);

    // Verify key elements
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Check CTA link
    const cta = page.getByRole("link", { name: /Start Your Appeal/i }).first();
    await expect(cta).toBeVisible();
  });

  test("pricing page renders all 3 pricing tiers", async ({ page }) => {
    await page.goto("/pricing");

    await expect(page.getByText("Free", { exact: false })).toBeVisible();
    await expect(page.getByText("Pro", { exact: false })).toBeVisible();
    await expect(page.getByText("Business", { exact: false })).toBeVisible();
  });

  test("auth pages are accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();

    await page.goto("/signup");
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();

    await page.goto("/forgot-password");
    await expect(page.getByLabel(/Email/i)).toBeVisible();
  });
});
