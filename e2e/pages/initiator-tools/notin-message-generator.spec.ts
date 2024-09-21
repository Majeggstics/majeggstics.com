import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/initiator-tools/notin-message-generator');

	await expect(page).toHaveTitle(/Notin Message Generator/i);
});
