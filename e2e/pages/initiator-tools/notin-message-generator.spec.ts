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
	await expect(timeslotOne).toContainText('you don’t join by +6');

	const timeslotTwo = page.locator('section').filter({ hasText: /Timeslot 2/ });
	await expect(timeslotTwo).toContainText('@33');
	await expect(timeslotTwo).toContainText('@11');
	await expect(timeslotTwo).toContainText('you don’t join by +11');
});

test('keys copy-state from ign & thread url', async ({ page }) => {
	await page.getByRole('textbox').fill(stripIndent`
		Timeslot :one::
		<:grade_aaa:11> [coop1](<carpet>) ([thread](<disc1>)): <@11> (\`foo\`)
	`);

	const timeslotOne = page.locator('section').filter({ hasText: /Timeslot 1/ });

	await expect(timeslotOne).toContainText(/❌\s*<@11>/i);
	await page.getByRole('button', { name: /copy/i }).first().click();
	await expect(timeslotOne).toContainText(/✅\s*<@11>/i);

	// case one: notins are split across multiple messages and pasted after copy
	await page.getByRole('textbox').fill(stripIndent`
		Timeslot :one::
		<:grade_aaa:11> [coop1](<carpet>) ([thread](<disc1>)): <@11> (\`foo\`)
		<:grade_aaa:11> [coop2](<carpet>) ([thread](<disc2>)): <@22> (\`bar\`)
	`);

	// we should _not_ reset copied state
	await expect(timeslotOne).toContainText(/✅\s*<@11>/i);

	// case two: the same user is notin in both friday contracts (note threadurl)
	await page.getByRole('textbox').fill(stripIndent`
		Timeslot :one::
		<:grade_aaa:11> [coop1](<carpet>) ([thread](<disc3>)): <@11> (\`foo\`)
	`);

	// we _should_ reset copied state
	await expect(timeslotOne).toContainText(/❌\s*<@11>/i);
});

test('tests for usernames with special characters', async ({ page }) => {
	/* Add in other special characters in this test if other 
	characters in in game names are found to be problematic */

	await page.getByRole('textbox').fill(stripIndent`
		Not in :egg_supermaterial: **Federal Reggserve** :egg_supermaterial: - \`federal-reggserve\`:

		Timeslot :one::
		<:grade_aaa:11> [coop1](<carpet>) ([thread](<disc>)): <@11> (\`(foo<>?!-3)\`)
		<:grade_aaa:11> [coop2](<carpet>) ([thread](<disc>)): <@22> (\`()bar)(?!<>\`)

		Timeslot :two::
		<:grade_aaa:11> [coop3](<carpet>) ([thread](<disc>)): <@33> (\`baz ('<'*?)\`)
		<:grade_aaa:11> [coop3](<carpet>) ([thread](<disc>)): <@44> (\`a\`)

		(no pings were sent)
	`);

	const timeslotOne = page.locator('section').filter({ hasText: /Timeslot 1/ });
	await expect(timeslotOne).toContainText('(`(foo<>?!-3)`)');
	await expect(timeslotOne).toContainText('(`()bar)(?!<>`)');
	await expect(timeslotOne).toContainText('you don’t join by +6');

	const timeslotTwo = page.locator('section').filter({ hasText: /Timeslot 2/ });
	await expect(timeslotTwo).toContainText("(`baz ('<'*?)`)");
	await expect(timeslotTwo).toContainText('(`a`)');
	await expect(timeslotTwo).toContainText('you don’t join by +11');
});
