import { test, expect } from '@playwright/test';

/**
 * Search overlay tests.
 *
 * The new theme ships a command-palette modal that queries the Algolia
 * blog_hugo index directly via REST (search-only key). DOM shape:
 *
 *   button[data-search-trigger]      — header trigger
 *   #search-overlay                  — modal container, [data-open] toggled
 *   #search-input                    — the search field
 *   #search-results > li > a.search-hit  — each result row
 *   #search-empty                    — empty / no-results state
 */

test.describe('Search overlay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Defer-loaded script — make sure it's wired up before interacting.
    await page.waitForFunction(() =>
      document.querySelector('[data-search-trigger]') !== null
    );
  });

  test('header shows a search trigger button', async ({ page }) => {
    const trigger = page.locator('[data-search-trigger]');
    await expect(trigger).toBeVisible();
  });

  test('clicking the trigger opens the overlay', async ({ page }) => {
    const overlay = page.locator('#search-overlay');
    await expect(overlay).toHaveAttribute('data-open', 'false');

    await page.locator('[data-search-trigger]').click();

    await expect(overlay).toHaveAttribute('data-open', 'true');
    await expect(page.locator('#search-input')).toBeFocused();
  });

  test('pressing "/" opens the overlay from the page body', async ({ page }) => {
    const overlay = page.locator('#search-overlay');
    await page.locator('body').click();
    await page.keyboard.press('/');
    await expect(overlay).toHaveAttribute('data-open', 'true');
    await expect(page.locator('#search-input')).toBeFocused();
  });

  test('typing a query returns hits from Algolia', async ({ page }) => {
    await page.locator('[data-search-trigger]').click();
    await page.locator('#search-input').fill('go');

    const firstHit = page.locator('#search-results .search-hit').first();
    await expect(firstHit).toBeVisible({ timeout: 10_000 });

    await expect(firstHit.locator('.search-hit-title')).toBeVisible();
    await expect(firstHit.locator('.search-hit-section')).toBeVisible();
  });

  test('hits are real links that navigate when clicked', async ({ page }) => {
    await page.locator('[data-search-trigger]').click();
    await page.locator('#search-input').fill('go');

    const firstHit = page.locator('#search-results .search-hit').first();
    await expect(firstHit).toBeVisible({ timeout: 10_000 });

    const href = await firstHit.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/|prskavec\.net/);

    await firstHit.click();
    await expect(page).not.toHaveURL('/');
  });

  test('a query with no matches shows the empty state', async ({ page }) => {
    await page.locator('[data-search-trigger]').click();
    await page.locator('#search-input').fill('xyzzy1234noresults');

    const empty = page.locator('#search-empty');
    await expect(empty).toHaveAttribute('data-visible', 'true', { timeout: 10_000 });
    await expect(empty).toContainText(/no results/i);
  });

  test('Esc closes the overlay', async ({ page }) => {
    await page.locator('[data-search-trigger]').click();
    const overlay = page.locator('#search-overlay');
    await expect(overlay).toHaveAttribute('data-open', 'true');

    await page.keyboard.press('Escape');
    await expect(overlay).toHaveAttribute('data-open', 'false');
  });

  test('clicking the backdrop closes the overlay', async ({ page }) => {
    await page.locator('[data-search-trigger]').click();
    const overlay = page.locator('#search-overlay');
    await expect(overlay).toHaveAttribute('data-open', 'true');

    await page.locator('.search-backdrop').click({ position: { x: 10, y: 10 } });
    await expect(overlay).toHaveAttribute('data-open', 'false');
  });

  test('arrow keys move selection between hits', async ({ page }) => {
    await page.locator('[data-search-trigger]').click();
    await page.locator('#search-input').fill('go');

    const hits = page.locator('#search-results .search-hit');
    await expect(hits.first()).toBeVisible({ timeout: 10_000 });

    await expect(hits.nth(0)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowDown');
    await expect(hits.nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(hits.nth(0)).toHaveAttribute('aria-selected', 'true');
  });
});
