import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

// s8-ch66 | 66. Environment Variables
// s8-ch67 | 67. Configuration File

require('dotenv').config();

export default defineConfig<TestOptions>({
  // --- Global timeouts and reporting ---
  timeout: 40000,
  globalTimeout: 60000,
  expect: {
    timeout: 20000
  },
  retries: 1,
  reporter: 'html',

  // --- Default configuration for all tests ---
  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',

    // Dynamic URL selection based on environment variables
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
      : process.env.STAGING === '1' ? 'http://localhost:4202/'
      : 'http://localhost:4200/',

    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },

  // --- Project and environment definitions ---
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/'
      },
    },
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        video: {
          mode: 'on',
          size: { width: 1920, height: 1080 }
        }
      },
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    }
  ]
});
