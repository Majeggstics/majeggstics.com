import { test, expect } from '@playwright/test';
import { url } from '/e2e/util';

test('has title', async ({ page }) => {
	await page.goto(url('/initiator-tools/min-fails-generator'));

	await expect(page).toHaveTitle(/Min Fails Generator/i);
});
