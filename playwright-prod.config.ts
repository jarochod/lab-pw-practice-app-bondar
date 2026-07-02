import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

// s8-ch67 | 67. Configuration File

require('dotenv').config();

export default defineConfig<TestOptions>({
  // --- Global configuration (Production) ---
  reporter: 'html',
  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: 'http://localhost:4200/',
  },

  // --- Target test execution environment ---
  projects: [
    {
      name: 'chromium',
    }
  ]
});
