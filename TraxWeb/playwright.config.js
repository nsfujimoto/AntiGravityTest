const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/e2e',
    webServer: {
        command: 'npx http-server ./src -p 8080',
        port: 8080,
        reuseExistingServer: !process.env.CI,
    },
    use: {
        baseURL: 'http://localhost:8080',
    },
});
