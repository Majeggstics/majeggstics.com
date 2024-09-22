import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/contract-boost-calculator');

	await expect(page).toHaveTitle(/Contract Boost Calculator/);
});
