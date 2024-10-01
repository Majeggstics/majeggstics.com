import { test, expect } from '@playwright/test';
import { stripIndent } from 'common-tags';

test.beforeEach(
	async ({ page }) => void (await page.goto('/initiator-tools/notin-message-generator')),
);

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/notin message generator/i);
});

test('displays from-timeslot players where they signed up', async ({ page }) => {
	await page.getByRole('textbox').fill(stripIndent`
		Not in :egg_supermaterial: **Federal Reggserve** :egg_supermaterial: - \`federal-reggserve\`:

		Timeslot :one::
		<:grade_aaa:11> [coop1](<carpet>) ([thread](<disc>)): <@11> (\`foo\`) (from timeslot 2)
		<:grade_aaa:11> [coop2](<carpet>) ([thread](<disc>)): <@22> (\`bar\`)

		Timeslot :two::
		<:grade_aaa:11> [coop3](<carpet>) ([thread](<disc>)): <@33> (\`baz\`)

		(no pings were sent)
	`);

	const timeslotOne = page.locator('section').filter({ hasText: /Timeslot 1/ });
	await expect(timeslotOne).toContainText('@22');

	const timeslotTwo = page.locator('section').filter({ hasText: /Timeslot 2/ });
	await expect(timeslotTwo).toContainText('@33');
	await expect(timeslotTwo).toContainText('@11');
});
