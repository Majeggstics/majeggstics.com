import { test, expect } from '@playwright/test';
import { stripIndent } from 'common-tags';

test.beforeEach(
	async ({ page }) => void (await page.goto('/initiator-tools/notin-fails-generator')),
);

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/Notin Fails Generator/);
});

test('displays from-timeslot players where they signed up', async ({ page }) => {
	await page.getByRole('textbox').first().fill(stripIndent`
		Not in :egg_fusion: **Banana** :egg_fusion: - \`banana\`:

		Timeslot :one::
		<:grade_aaa:11> [coop1](<carpet>) ([thread](<disc>)): <@11> (\`foo\`) (from timeslot 2)
		<:grade_aaa:11> [coop2](<carpet>) ([thread](<disc>)): <@22> (\`bar\`)

		Timeslot :two::
		<:grade_aaa:11> [coop3](<carpet>) ([thread](<disc>)): <@33> (\`baz\`)

		(no pings were sent)
	`);

	await expect(page.getByRole('textbox').last()).toContainText(
		/## Banana \+1 notins(?:.|\n)*bar(?:.|\n)*## Banana \+6 notins(?:.|\n)*foo/,
	);
});
