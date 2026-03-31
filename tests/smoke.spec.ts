import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Prskavec/i);
  });

  test('navigation bar is visible with expected links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav#navbar-main');
    await expect(nav).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Posts' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Talks' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Oncall Guide' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('about section is present with author name', async ({ page }) => {
    await page.goto('/');
    const about = page.locator('section#about');
    await expect(about).toBeVisible();
    await expect(about).toContainText('Ladislav Prskavec');
  });

  test('recent posts section is present', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section#posts');
    await expect(section).toBeVisible();
    // Should have at least one post card
    await expect(section.locator('.card, article').first()).toBeVisible();
  });

  test('talks section is present', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section#talks');
    await expect(section).toBeVisible();
    await expect(section.locator('.card, article').first()).toBeVisible();
  });

  test('contact section is present with Calendly link', async ({ page }) => {
    await page.goto('/');
    const contact = page.locator('section#contact');
    await expect(contact).toBeVisible();
    await expect(contact.getByRole('link', { name: /book|appointment|calendly/i })).toBeVisible();
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
    // Compact/List view renders li or article elements
    const items = page.locator('article, .media, li.media');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('post links navigate to post pages', async ({ page }) => {
    await page.goto('/post/');
    const firstLink = page.locator('article a, .media a, li.media a').first();
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
    const items = page.locator('article, .media, li.media');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('does not say "Upcoming" in heading (all talks are past)', async ({ page }) => {
    await page.goto('/talk/');
    const h1 = page.locator('h1').first();
    await expect(h1).not.toContainText('Upcoming');
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
    await expect(page.locator('article, .article-container, main')).toBeVisible();
    // Chapter should have meaningful text
    await expect(page.locator('body')).toContainText('roster');
  });

  test('tools page loads and has last-updated note', async ({ page }) => {
    await page.goto('/courses/how-to-make-oncall/tools/');
    await expect(page.locator('body')).toContainText('Last updated');
    // Should have a comparison table
    await expect(page.locator('table')).toBeVisible();
  });
});

