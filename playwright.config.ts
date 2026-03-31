import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://localhost:1313';
const isLocal = !process.env.BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  // Start Hugo locally when BASE_URL is not set (i.e. not CI / not prod run).
  webServer: isLocal ? {
    command: 'hugo server --disableFastRender',
    url: 'http://localhost:1313',
    reuseExistingServer: true,
    timeout: 60_000,
  } : undefined,

  use: {
    baseURL,
    actionTimeout: isLocal ? 10_000 : 15_000,
    navigationTimeout: isLocal ? 15_000 : 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});

