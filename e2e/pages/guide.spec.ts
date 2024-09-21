import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/guide');

	await expect(page).toHaveTitle(/Majeggstics Guide/i);
});
