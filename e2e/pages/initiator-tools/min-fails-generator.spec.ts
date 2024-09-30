import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => void (await page.goto('/initiator-tools/min-fails-generator')));

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/min fails generator/i);
});

test('generates output', async ({ page }) => {
	await page.getByRole('textbox').fill(`
		## Minimum check for <:egg_unknown:111> Contract Name
		### Formula \`Majeggstics 24h\`, Timeslot :two:
		** **
		<:grade_aaa:111> [**\`coop\`**](<carpet>) ([**thread**](<discord_url_1>))
		<:grade_aaa:111> [**\`koop\`**](<carpet>) ([**thread**](<discord_url_2>))
		* \`ign\` (@ discord_name) (E1): \`1T\`/\`1q\` (\`0%\`). Spent 9 <:b_icon_token:1123683788258549861>, <:clock:1123686591412576357> 11h36m. Ongoing boosts: supreme tach, epic bb

		(no pings were sent)
	`);

	await expect(page.getByText('Copy to Clipboard').nth(0)).toBeVisible();
});

test('extracts timeslot', async ({ page }) => {
	await page.getByRole('textbox').fill(`
		## Minimum check for :egg_unknown: Contract Name
		### Formula \`Majeggstics 24h\`, Timeslot :one:
	`);

	await expect(page.getByRole('heading', { name: /coops in danger/i })).toContainText('+1');
});

test('skips green- and yellow-scrolled contracts', async ({ page }) => {
	await page.getByRole('textbox').fill(`
		## Minimum check for <:egg_prodigy:i444> Example Contract!
		### Formula \`Majeggstics 24h\`, Timeslot :three:
		** **
		<:grade_aaa:11> [**\`coop1\`**](<carpet>) <:green_scroll:11> ([**thread**](<link1>))
		* \`JoeySlowboost\` (@ large\\_tach\\_user) (Z1): \`1.00q\`/\`3.41q\` (\`29%\`). Spent 0 <:b_icon_token:11> <:clock:11> 8h0m

		<:grade_aaa:11> [**\`coop2\`**](<carpet>) ([**thread**](<link2>))
		* \`30hroffline\` (@ nocheckin) (Z3): \`72.6T\`/\`3.41q\` (\`2%\`). Spent 4 <:b_icon_token:1135903700389466182> <:clock:11> 30h12m


		<:grade_aaa:11> [**\`coop3\`**](<carpet>) <:yellow_scroll:11> ([**thread**](<link3>))
		* \`JackSlowboost\` (@ large\\_tach\\_my\\_beloved) (Z1): \`1.00q\`/\`3.41q\` (\`29%\`). Spent 0 <:b_icon_token:11> <:clock:11> 12h0m
	`);
});
