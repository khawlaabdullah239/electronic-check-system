import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5179',
    headless: false,
    screenshot: 'only-on-failure',
    channel: 'chrome',
  },
  webServer: {
    command: 'npx vite --port 5179',
    port: 5179,
    reuseExistingServer: true,
    timeout: 15000,
  },
});
