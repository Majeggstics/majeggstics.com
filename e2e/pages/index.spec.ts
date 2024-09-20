import { test, expect } from '@playwright/test';
import { url } from '/e2e/util';

test('has title', async ({ page }) => {
	await page.goto(url('/'));

	await expect(page).toHaveTitle(/The Majeggstics/);
});
