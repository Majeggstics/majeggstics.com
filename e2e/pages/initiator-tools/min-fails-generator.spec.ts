import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => void (await page.goto('/initiator-tools/min-fails-generator')));

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/Min Fails Generator/i);
});

test('generates output', async ({ page }) => {
	await page.getByRole('textbox').fill(`
		## Minimum check for <:egg_unknown:> Contract Name
		### Formula \`Majeggstics 24h\`, Timeslot :two:
		** **
		<:grade_aaa:111> [**\`coop\`**](<carpet>) ([**thread**](<discord_url_1>))
		<:grade_aaa:111> [**\`koop\`**](<carpet>) ([**thread**](<discord_url_2>))
		* \`ign\` (@ discord_name) (E1): \`1T\`/\`1q\` (\`0%\`). Spent 9 <:b_icon_token:1123683788258549861>, <:clock:1123686591412576357> 11h36m. Ongoing boosts: supreme tach, epic bb

		(no pings were sent)
	`);

	await expect(page.getByText('Copy to Clipboard').nth(0)).toBeVisible();
});

test.only('extracts timeslot', async ({ page, context }) => {
	await page.getByRole('textbox').fill(`
		## Minimum check for :egg_unknown: Contract Name
		### Formula \`Majeggstics 24h\`, Timeslot :one:
	`);

	await expect(page.getByRole('heading', { name: /coops in danger/i })).toContainText('+1');
});
