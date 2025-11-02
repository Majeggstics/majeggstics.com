import { DateTime } from 'luxon';
import { useMemo } from 'react';

const timeslotFormatMap = {
	emoji: [':one:', ':two:', ':three:'],
	eggst: ['+1', '+6', '+12'],
	join_deadline_eggst: ['+6', '+11', '+17'],
	header: ['Timeslot 1', 'Timeslot 2', 'Timeslot 3'],
} as const;

const timeslotHeaderRegex = /Timeslot\s*(?<emoji>:[a-z]+:):?/;

export class Timeslot {
	static One = new Timeslot(0);

	static Two = new Timeslot(1);

	static Three = new Timeslot(2);

	index: 0 | 1 | 2;

	private constructor(index: 0 | 1 | 2) {
		this.index = index;
	}

	format(as: 'eggst' | 'emoji' | 'header' | 'join_deadline_eggst' | 'join_deadline'): string {
		if (as === 'join_deadline') {
			const offset = [6, 11, 17][this.index];
			const time = DateTime.fromISO('09:00', { zone: 'America/Los_Angeles' }).plus({
				hours: offset,
			});
			return `<t:${time.toUnixInteger()}:t>`;
		}

		return timeslotFormatMap[as][this.index];
	}

	static fromEmoji(emoji: string | undefined): Timeslot | null {
		// Lint doesn't like switch case without undefined, though default handles that just fine...
		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		switch (emoji) {
			case ':one:':
				return Timeslot.One;
			case ':two:':
				return Timeslot.Two;
			case ':three:':
				return Timeslot.Three;
			default:
				return null;
		}
	}

	static fromNumeral(numeral: string | undefined): Timeslot | null {
		// Lint doesn't like switch case without undefined, though default handles that just fine...
		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		switch (numeral) {
			case '1':
				return Timeslot.One;
			case '2':
				return Timeslot.Two;
			case '3':
				return Timeslot.Three;
			default:
				return null;
		}
	}

	static fromWonkyMessage(input: string): Timeslot | null {
		const emoji = timeslotHeaderRegex.exec(input)?.groups!.emoji;
		return emoji ? Timeslot.fromEmoji(emoji) : null;
	}
}

export type UserSpec = {
	combinedIdentifier: string;
	discordId: string;
	ign: string;
};
export type NotIns = {
	threadUrl: string | null;
	users: UserSpec[];
};

export type NotInsPerTimeslot = Record<string, NotIns[]>;

export const zipRegex = (res: RegExp[], flags: string) =>
	new RegExp(res.map((re) => re.source).join(''), flags);

type TimeslotEmoji = string;
type ThreadUrl = string;
type FlatNotin = UserSpec & {
	threadUrl: ThreadUrl;
	timeslot: TimeslotEmoji;
};
export const parseNotInMessage = (input: string): NotInsPerTimeslot => {
	const timeslotRegex = zipRegex(
		[timeslotHeaderRegex, /(?<notins>(?:.|\n)+?)/, /(?=Timeslot|\(no pings were sent\)|$)/],
		'g',
	);

	const matches = [...input.matchAll(timeslotRegex)];

	const notins: Record<TimeslotEmoji, Record<ThreadUrl, UserSpec[]>> = {};

	// first, pull everything to flat objects, for ease of parsing
	const flatNotins: FlatNotin[] = matches.flatMap((match) => {
		const emoji = match.groups!.emoji;
		const timeslot = Timeslot.fromEmoji(emoji);
		if (timeslot === null) return [];

		notins[timeslot.format('emoji')] ??= {};

		return match
			?.groups!.notins!.trim()
			.split('\n')
			.filter((line) => line.length > 0)
			.flatMap((line) => {
				const httpUrl = /\[thread]\(<(?<url>[^>]+)>\)/.exec(line)?.groups!.url;
				const threadUrl = httpUrl?.trim() ?? '';
				const userMatches = [
					...line.matchAll(
						/<@(?<discordId>\d+)> \(`(?<ign>[^ ]+)`\)(?: \(from timeslot (?<fromTimeslot>\d)\))?/g,
					),
				];

				return userMatches.map((match) => {
					const { ign, discordId, fromTimeslot } = match.groups!;
					let timeslot = null;
					if (fromTimeslot) {
						timeslot = Timeslot.fromNumeral(fromTimeslot);
					}

					return {
						ign: ign!,
						discordId: discordId!,
						combinedIdentifier: `<@${discordId}> (\`${ign}\`)`,
						threadUrl,
						timeslot: timeslot ? timeslot.format('emoji') : emoji!,
					};
				});
			});
	});

	// collect down to a deeply nested object for ease of grouping
	for (const { ign, discordId, combinedIdentifier, threadUrl, timeslot } of flatNotins) {
		notins[timeslot] ??= {};
		notins[timeslot][threadUrl] ??= [];
		notins[timeslot][threadUrl].push({ ign, discordId, combinedIdentifier });
	}

	// and then simplify the structure a bit
	return Object.fromEntries(
		Object.entries(notins).map(([timeslot, threads]) => [
			timeslot,
			Object.entries(threads).map(([threadUrl, users]) => ({ threadUrl, users })),
		]),
	);
};

export const useExtractNotins = (input: string): NotInsPerTimeslot =>
	useMemo(() => parseNotInMessage(input), [input]);

type ParsedMins = {
	inDanger: string[];
	minFails: string[];
	notins: string[];
};
export const parseMinsMessage = (minsMessage: string): ParsedMins => {
	const inDanger = [];
	const notins = [];
	const minFails = [];

	let scrolled_coop = false;
	for (const line of minsMessage.split('\n')) {
		const trim = line.trim();
		if (/^<?:grade_\w+:(?:\d+>)?.+/.test(trim)) {
			scrolled_coop = /:(?:green|yellow)_scroll:/.test(trim);

			if (trim.includes(':warning:')) {
				inDanger.push(trim);
			}
		}

		if (scrolled_coop) {
			continue;
		}

		if (/is missing.$/.test(trim)) {
			notins.push(trim);
		} else if (/^\* `.+` \(@ .+\).+Spent \d+/.test(trim)) {
			minFails.push(trim);
		}
	}

	return { inDanger, notins, minFails };
};
