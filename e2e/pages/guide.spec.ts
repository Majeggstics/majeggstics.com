import { test, expect } from '@playwright/test';
import { url } from '/e2e/util';

test('has title', async ({ page }) => {
	await page.goto(url('/guide'));

	await expect(page).toHaveTitle(/Majeggstics Guide/i);
});
