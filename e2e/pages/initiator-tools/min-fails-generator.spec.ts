import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/initiator-tools/min-fails-generator');

	await expect(page).toHaveTitle(/Min Fails Generator/i);
});
