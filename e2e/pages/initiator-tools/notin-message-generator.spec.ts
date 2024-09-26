import { test, expect } from '@playwright/test';

test.beforeEach(
	async ({ page }) => void (await page.goto('/initiator-tools/notin-message-generator')),
);

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/notin message generator/i);
});
