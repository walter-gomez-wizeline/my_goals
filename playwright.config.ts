import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/smoke',
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {},
  },
  projects: [
    {name:'desktop',use:{viewport:{width:1280,height:800}}},
    {name:'mobile',use:{viewport:{width:360,height:800}}},
  ],
  webServer: {
    command: 'npm run start -- --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout:30000,
  },
});
