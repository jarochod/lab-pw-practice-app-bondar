import { test as base } from "@playwright/test";

// s8-ch66 | 66. Environment Variables

export type TestOptions = {
  globalsQaURL: string;
};

export const test = base.extend<TestOptions>({
  globalsQaURL: ["", { option: true }],
});
