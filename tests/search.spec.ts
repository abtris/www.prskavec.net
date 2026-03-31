import { test, expect } from '@playwright/test';

/**
 * Algolia search tests.
 *
 * The site uses instantsearch.js with the Algolia backend.
 * DOM structure:
 *   <a class="js-search"> — navbar search icon (toggle)
 *   <aside id="search">   — search overlay (hidden by default)
 *     <div id="search-box"> — instantsearch injects an <input> here
 *     <div id="search-hits"> — results container
 */

test.describe('Algolia search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page JS (including instantsearch) to initialise
    await page.waitForLoadState('networkidle');
  });

  test('search icon is present in navbar', async ({ page }) => {
    const searchIcon = page.locator('a.js-search').first();
    await expect(searchIcon).toBeVisible();
  });

  test('clicking search icon opens the search overlay', async ({ page }) => {
    const overlay = page.locator('aside#search');
    // Overlay starts hidden
    await expect(overlay).not.toBeVisible();

    await page.locator('a.js-search').first().click();

    await expect(overlay).toBeVisible({ timeout: 5_000 });
  });

  test('instantsearch renders an input inside #search-box', async ({ page }) => {
    await page.locator('a.js-search').first().click();

    // instantsearch.js injects <input class="ais-SearchBox-input"> (or similar)
    const input = page.locator('#search-box input');
    await expect(input).toBeVisible({ timeout: 5_000 });
  });

  test('typing a query returns results from Algolia', async ({ page }) => {
    await page.locator('a.js-search').first().click();

    const input = page.locator('#search-box input');
    await expect(input).toBeVisible({ timeout: 5_000 });

    await input.fill('go');

    // #search-hits becomes visible and contains at least one hit
    const hits = page.locator('#search-hits');
    await expect(hits).toBeVisible({ timeout: 10_000 });

    // Wait for at least one search-hit div from Algolia
    const firstHit = hits.locator('.search-hit').first();
    await expect(firstHit).toBeVisible({ timeout: 10_000 });

    // The hit should contain a link
    await expect(firstHit.locator('a')).toBeVisible();
  });

  test('search results contain a clickable link that navigates', async ({ page }) => {
    await page.locator('a.js-search').first().click();

    const input = page.locator('#search-box input');
    await expect(input).toBeVisible({ timeout: 5_000 });
    await input.fill('go');

    const firstHitLink = page.locator('#search-hits .search-hit a').first();
    await expect(firstHitLink).toBeVisible({ timeout: 10_000 });

    const href = await firstHitLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/prskavec\.net|^\//);
  });

  test('empty query hides the results container', async ({ page }) => {
    await page.locator('a.js-search').first().click();

    const input = page.locator('#search-box input');
    await expect(input).toBeVisible({ timeout: 5_000 });

    // Type something first so hits appear, then clear it
    await input.fill('go');
    await expect(page.locator('#search-hits')).toBeVisible({ timeout: 10_000 });

    await input.fill('');
    // The algolia-search.js sets display:none when query is empty
    await expect(page.locator('#search-hits')).toHaveCSS('display', 'none', { timeout: 5_000 });
  });

  test('no-match query shows "no results" message', async ({ page }) => {
    await page.locator('a.js-search').first().click();

    const input = page.locator('#search-box input');
    await expect(input).toBeVisible({ timeout: 5_000 });

    // A query unlikely to match anything in the index
    await input.fill('xyzzy1234noresults');

    const hits = page.locator('#search-hits');
    await expect(hits).toBeVisible({ timeout: 10_000 });
    await expect(hits.locator('.search-no-results')).toBeVisible({ timeout: 10_000 });
  });

  test('closing search overlay with × button hides it', async ({ page }) => {
    await page.locator('a.js-search').first().click();
    const overlay = page.locator('aside#search');
    await expect(overlay).toBeVisible({ timeout: 5_000 });

    // The close button is also a .js-search link
    await overlay.locator('a.js-search').click();
    await expect(overlay).not.toBeVisible({ timeout: 5_000 });
  });
});

