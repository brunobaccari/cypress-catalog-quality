import { defineConfig } from "cypress";
for (const key of ['BASE_URL', 'API_BASE_URL', 'TEST_PASSWORD']) {
  if (!process.env[key]) throw new Error(`Configure ${key} em .env ou no ambiente`);
}

export default defineConfig({
  video: false,
  expose: { apiUrl: process.env.API_BASE_URL },
  env: { testPassword: process.env.TEST_PASSWORD },
  retries: 0,
  reporter: "junit",
  reporterOptions: { mochaFile: "results/junit-[hash].xml", toConsole: true },
  e2e: {
    baseUrl: process.env.BASE_URL,
    supportFile: "cypress/support/e2e.ts",
    testIsolation: true,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
  },
});
