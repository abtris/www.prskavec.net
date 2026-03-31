import { test, expect } from '@playwright/test';

/**
 * Algolia search tests.
 *
 * The site uses instantsearch.js with the Algolia backend.
 * DOM structure:
 *   nav#navbar-main a.nav-link.js-search  — navbar search icon (toggle)
 *   <aside id="search" class="search-results"> — overlay (visibility:hidden by default)
 *     Overlay becomes visible when <body> gets class "searching"
 *     <div id="search-box"> — instantsearch injects an <input class="ais-SearchBox-input"> here
 *     <div id="search-hits"> — results container
 *
 * Note: there is a second a.js-search (the ✕ close button) INSIDE the overlay which
 * is hidden; always select the navbar icon via a.nav-link.js-search.
 */

test.describe('Algolia search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page JS (including instantsearch) to initialise
    await page.waitForLoadState('networkidle');
  });

  test('search icon is present in navbar', async ({ page }) => {
    // The navbar icon has both nav-link and js-search classes; the overlay close
    // button has only js-search, so we must be specific to avoid picking the hidden one.
    const searchIcon = page.locator('a.nav-link.js-search');
    await expect(searchIcon).toBeVisible();
  });

  test('clicking search icon opens the search overlay', async ({ page }) => {
    // Overlay uses visibility:hidden by default; body gains class "searching" on open.
    const overlay = page.locator('aside#search');
    await expect(overlay).toBeHidden();

    await page.locator('a.nav-link.js-search').click();

    await expect(overlay).toBeVisible({ timeout: 5_000 });
  });

  test('instantsearch renders an input inside #search-box', async ({ page }) => {
    await page.locator('a.nav-link.js-search').click();

    // instantsearch.js injects <input class="ais-SearchBox-input"> (or similar)
    const input = page.locator('#search-box input');
    await expect(input).toBeVisible({ timeout: 5_000 });
  });

  test('typing a query returns results from Algolia', async ({ page }) => {
    await page.locator('a.nav-link.js-search').click();

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
    await page.locator('a.nav-link.js-search').click();

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
    await page.locator('a.nav-link.js-search').click();

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
    await page.locator('a.nav-link.js-search').click();

    const input = page.locator('#search-box input');
    await expect(input).toBeVisible({ timeout: 5_000 });

    // A query unlikely to match anything in the index
    await input.fill('xyzzy1234noresults');

    const hits = page.locator('#search-hits');
    await expect(hits).toBeVisible({ timeout: 10_000 });
    await expect(hits.locator('.search-no-results')).toBeVisible({ timeout: 10_000 });
  });

  test('closing search overlay with × button hides it', async ({ page }) => {
    await page.locator('a.nav-link.js-search').click();
    const overlay = page.locator('aside#search');
    await expect(overlay).toBeVisible({ timeout: 5_000 });

    // The ✕ close button inside the overlay also has class js-search (but NOT nav-link)
    await overlay.locator('a.js-search').click();
    await expect(overlay).toBeHidden({ timeout: 5_000 });
  });
});

