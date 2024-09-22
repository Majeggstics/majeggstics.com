import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/initiator-tools/notin-fails-generator');

	await expect(page).toHaveTitle(/Notin Fails Generator/);
});
