import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Prskavec/i);
  });

  test('navigation bar is visible with expected links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav[aria-label="Primary"]');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Index' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Talks' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Writing' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Oncall' })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Podcast/i })).toBeVisible();
  });

  test('hero contains author name', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toContainText('Ladislav Prskavec');
  });

  test('recent talks block has at least one row', async ({ page }) => {
    await page.goto('/');
    const talkRows = page.locator('main .talk-row');
    expect(await talkRows.count()).toBeGreaterThan(0);
  });

  test('contact email is exposed', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /ladislav@prskavec\.net/i }).first()).toBeVisible();
  });

  test('no placeholder subtitle copy is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('MY FANS')).toHaveCount(0);
  });
});

test.describe('Posts archive (/post/)', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/post/');
    await expect(page).toHaveTitle(/Posts/i);
  });

  test('shows a list of posts', async ({ page }) => {
    await page.goto('/post/');
    const items = page.locator('.talk-row');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('post links navigate to post pages', async ({ page }) => {
    await page.goto('/post/');
    const firstLink = page.locator('.talk-row').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();
    await firstLink.click();
    await expect(page).toHaveURL(/\/post\//);
  });
});

test.describe('Talks archive (/talk/)', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/talk/');
    await expect(page).toHaveTitle(/Talks/i);
  });

  test('shows a list of talks', async ({ page }) => {
    await page.goto('/talk/');
    const items = page.locator('.talk-row');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });
});

test.describe('Talk detail page', () => {
  test('loads and shows status chip + event name', async ({ page }) => {
    await page.goto('/talk/2025-04-23-cloudnative/');
    await expect(page.locator('h1')).toContainText('Terralith');
    await expect(page.locator('body')).toContainText('Cloud Native Prague');
  });

  test('media posters are present (lazy-loaded, no iframes yet)', async ({ page }) => {
    await page.goto('/talk/2025-04-23-cloudnative/');
    await expect(page.locator('.media-poster').first()).toBeVisible();
    await expect(page.locator('iframe')).toHaveCount(0);
  });
});

test.describe('OnCall Guide', () => {
  test('course index loads', async ({ page }) => {
    await page.goto('/courses/how-to-make-oncall/');
    await expect(page).toHaveTitle(/OnCall/i);
  });

  test('course index contains chapter links', async ({ page }) => {
    await page.goto('/courses/how-to-make-oncall/');
    const links = page.locator('a[href*="how-to-make-oncall"]');
    expect(await links.count()).toBeGreaterThan(3);
  });

  test('a chapter page loads and has content', async ({ page }) => {
    await page.goto('/courses/how-to-make-oncall/chapter01/');
    await expect(page.locator('article').first()).toBeVisible();
    await expect(page.locator('body')).toContainText(/roster/i);
  });

  test('tools page loads, has last-updated note and a table', async ({ page }) => {
    await page.goto('/courses/how-to-make-oncall/tools/');
    await expect(page.locator('body')).toContainText('Last updated');
    await expect(page.locator('.table-scroll table')).toBeVisible();
  });
});

test.describe('Annotated reader', () => {
  test('WebExpo 2026 reader loads with prose content', async ({ page }) => {
    await page.goto('/reader/2026-05-27-webexpo/');
    await expect(page.locator('h1')).toContainText('Under the Hood of AI');
    await expect(page.locator('.prose-editorial')).toBeVisible();
  });
});
