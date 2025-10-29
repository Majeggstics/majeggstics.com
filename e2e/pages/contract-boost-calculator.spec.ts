import { test, expect } from '@playwright/test';
import { type Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => void (await page.goto('/contract-boost-calculator')));

declare global {
	namespace PlaywrightTest {
		// this is an extension of an existing type and must remain an `interface`
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Matchers<R> {
			toBeBelow: (above: Locator) => Promise<R>;
		}
	}
}
expect.extend({
	async toBeBelow(below: Locator, above: Locator) {
		const assertionName = 'toBeBelow';
		let pass = true;
		let matcherResult: any;
		const belowPos = await below.boundingBox();
		const abovePos = await above.boundingBox();
		try {
			await expect(above).toBeVisible();
			await expect(below).toBeVisible();
			expect(belowPos).not.toBeNull();
			expect(abovePos).not.toBeNull();
			expect(belowPos!.y).toBeGreaterThan(abovePos!.y + abovePos!.height);
		} catch (error: any) {
			matcherResult = error.matcherResult;
			pass = false;
		}

		const message = () =>
			this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
			'\n\n' +
			`Expected: ${this.isNot ? 'not' : ''} > ${abovePos?.y} + ${abovePos?.height}\n` +
			(matcherResult ? `Received: ${belowPos?.y}` : '');

		return {
			message,
			pass,
			name: assertionName,
			expected: `> ${abovePos?.y}`,
			actual: `${belowPos?.y}`,
		};
	},
});

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle(/Contract Boost Calculator/);
});

test('errors when there are too many stones', async ({ page }) => {
	const ihrInputs = page.getByRole('group', { name: /IHR set/ });
	await ihrInputs.getByLabel(/T2/).fill('13');

	await expect(ihrInputs).toContainText(/More stones \(13\) than max/);

	await ihrInputs.getByLabel(/T2/).fill('7');

	await expect(ihrInputs).not.toContainText(/More stones \S+ than max/);

	await ihrInputs.getByLabel(/T3/).fill('7');
	await ihrInputs.getByLabel(/T4/).fill('7');

	await expect(ihrInputs).toContainText(/More stones \(21\) than max/);

	await expect(page.getByText(/More stones/)).toBeBelow(ihrInputs.getByLabel(/T2/));
});

test('locks bonus input open when not default', async ({ page }) => {
	if (!(await page.getByLabel(/boost duration/).isVisible())) {
		await page.getByRole('button', { name: /show bonus/i }).click();
	}

	await page.getByLabel(/boost duration/i).check();

	await expect(page.getByRole('button', { name: /hide bonus/i })).toBeDisabled();

	await page.getByRole('button', { name: /reset bonus/i }).click();

	await expect(page.getByLabel(/boost duration/i)).not.toBeChecked();
	await expect(page.getByRole('button', { name: /hide bonus/i })).toBeEnabled();
});

test('calcs an 8-tok', async ({ page }) => {
	// prettier-ignore
	let outputs = [
		[/runs out after/i, /10min/ ],
		[/ge cost/i       , /16,000/],
		[/online/i        , /3.125B/],
		[/offline/i       , /9.374B/],
		[/hab space/i     , /11.34B/],
		[/time to fill/i  , /∞/     ],
	];

	const out = page.locator('#output span');
	for (const match of outputs) await expect(out).toContainText(match);

	await page.getByLabel(/monocle/i).selectOption('T4L');
	await page.getByLabel(/chalice/i).selectOption('T4');
	await page.getByLabel(/gusset/i).selectOption('T2E');

	const ihrInputs = page.getByRole('group', { name: /ihr set/i });
	await ihrInputs.getByLabel(/t2/i).fill('4');
	await ihrInputs.getByLabel(/t3/i).fill('4');
	await ihrInputs.getByLabel(/t4/i).fill('4');

	const diliInputs = page.getByRole('group', { name: /dili set/i });
	await diliInputs.getByLabel(/t2/i).fill('4');
	await diliInputs.getByLabel(/t3/i).fill('4');
	await diliInputs.getByLabel(/t4/i).fill('4');

	if (await page.getByLabel(/boost duration/).isVisible()) {
		await page.getByRole('button', { name: /reset bonus/i }).click();
	} else {
		await page.getByRole('button', { name: /show bonus/i }).click();
	}

	await page.getByLabel(/boost duration/i).check();
	await page.getByLabel(/^IHR/).fill('2000');
	await page.getByLabel(/IHC/).fill('10');
	await page.getByLabel(/CIHR/).fill('2');

	// prettier-ignore
	outputs = [
		[/runs out after/i, /39min/      ],
		[/ge cost/i       , /16,000/     ],
		[/online/i        , /7.599B/     ],
		[/offline/i       , /15.198B/    ],
		[/hab space/i     , /12.701B/    ],
		[/time to fill/i  , /32min 19sec/],
	];

	for (const match of outputs) await expect(out).toContainText(match);
	await page.getByLabel(/monocle/i).selectOption('None');
	await page.getByLabel(/chalice/i).selectOption('None');
	await page.getByLabel(/gusset/i).selectOption('None');

	await ihrInputs.getByLabel(/t2/i).fill('0');
	await ihrInputs.getByLabel(/t3/i).fill('0');
	await ihrInputs.getByLabel(/t4/i).fill('0');

	await diliInputs.getByLabel(/t2/i).fill('0');
	await diliInputs.getByLabel(/t3/i).fill('0');
	await diliInputs.getByLabel(/t4/i).fill('0');

	if (await page.getByLabel(/boost duration/).isVisible()) {
		await page.getByRole('button', { name: /reset bonus/i }).click();
	} else {
		await page.getByRole('button', { name: /show bonus/i }).click();
		await page.getByRole('button', { name: /reset bonus/i }).click();
	}

	await page.getByRole('radio', { name: /8-tok/i }).click();

	// prettier-ignore
	outputs = [
		[/runs out after/i, /10min/ ],
		[/ge cost/i       , /16,000/],
		[/online/i        , /3.125B/],
		[/offline/i       , /9.374B/],
		[/hab space/i     , /11.34B/],
		[/time to fill/i  , /∞/     ],
	];

	for (const match of outputs) await expect(out).toContainText(match);
});

test('calcs a 5-tok', async ({ page }) => {
	// prettier-ignore
	await page.getByRole('radio', { name: '-token (Benson)' }).click();

	const out = page.locator('#output span');

	await page.getByLabel(/monocle/i).selectOption('T4');
	await page.getByLabel(/chalice/i).selectOption('T3E');
	await page.getByLabel(/gusset/i).selectOption('T2E');

	const ihrInputs = page.getByRole('group', { name: /ihr set/i });
	await ihrInputs.getByLabel(/t2/i).fill('0');
	await ihrInputs.getByLabel(/t3/i).fill('0');
	await ihrInputs.getByLabel(/t4/i).fill('6');

	const diliInputs = page.getByRole('group', { name: /dili set/i });
	await diliInputs.getByLabel(/t2/i).fill('0');
	await diliInputs.getByLabel(/t3/i).fill('2');
	await diliInputs.getByLabel(/t4/i).fill('6');

	if (await page.getByLabel(/boost duration/).isVisible()) {
		await page.getByRole('button', { name: /reset bonus/i }).click();
	} else {
		await page.getByRole('button', { name: /show bonus/i }).click();
	}

	await page.getByLabel(/^IHR/).fill('2000');
	await page.getByLabel(/IHC/).fill('10');
	await page.getByLabel(/CIHR/).fill('2');
	await page.getByLabel(/TE/).fill('36');

	// prettier-ignore
	const outputs = [
		[/runs out after/i, /18min/   ],
		[/ge cost/i       , /10,400/  ],
		[/online/i        , /790.855M/],
		[/offline/i       , /1.582B/  ], 
		[/hab space/i     , /12.701B/ ], 
		[/time to fill/i  , /∞/       ],
	];

	for (const match of outputs) await expect(out).toContainText(match);
});
