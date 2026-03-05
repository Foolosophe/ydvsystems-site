import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run build && npm run start",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120000,
  },
  use: {
    baseURL: "http://localhost:3000",
    locale: "fr-FR",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
})
