// Currently doesn't support Wonky's "(from timeslot xx)"
'use client';

import copy from 'copy-to-clipboard';
import moment from 'moment-timezone';
import { Fragment, useState } from 'react';
import ToastMessage, { notify } from '@/components/ToastMessage';

interface NotIn {
	threadUrl: string | null;
	user: string;
}

export const enum Timeslot {
	One,
	Two,
	Three,
}

const timeslotMap = {
	emoji: [':one:', ':two:', ':three:'],
	eggst: ['+1', '+6', '+12'],
	header: ['Timeslot 1', 'Timeslot 2', 'Timeslot 3'],
	hour: [18, 23, 5], // hours in America/Toronto
} as const;

const slotFormat = (timeslot: Timeslot, format: keyof timeslotMap) => timeslotMap[format][timeslot];

export const convertToDiscordUrl = (url: string) => {
	const match = /discord.com\/channels\/(?<channelId>\d+)\/(?<messageId>\d+)/.exec(url);
	if (match) {
		const { channelId, messageId } = match.groups;
		return `discord://-/channels/${channelId}/${messageId}`;
	}

	return url;
};

const zipRegex = (res: RegExp[], flags: string) => new RegExp(res.map((re) => re.source).join(''), flags);

export const parseNotInMessage = (input: string): NotIn[] => {
	const timeslotRegex = zipRegex(
		[/Timeslot\s*(?<timeslotEmoji>:[a-z]+:):/, /(?<notins>(?:.|\n)+?)/, /(?=Timeslot|\(no pings were sent\)|$)/],
		'g',
	);
	const matches = [...input.matchAll(timeslotRegex)];

	return matches.flatMap((match) => {
		const emoji = match.groups.timeslotEmoji;
		const timeslot = timeslotMap.emoji.indexOf(emoji);
		if (timeslot === -1) return null;

		return match.groups.notins
			.trim()
			.split('\n')
			.flatMap((line) => {
				const threadMatch = /\[thread]\(<(?<url>[^>]+)>\)/.exec(line);
				const threadUrl = threadMatch ? convertToDiscordUrl(threadMatch.groups.url.trim()) : null;
				const userMatches = line.match(/<@\d+> \(`[^)]+`\)/g);

				return userMatches.map(
					(user: string): NotIn => ({
						timeslot,
						user,
						threadUrl,
					}),
				);
			});
	});
};

export default function NotInMessageGeneratorPage() {
	const [notInMessage, setNotInMessage] = useState('');
	const [copiedElements, setCopiedElements] = useState<{ [key: number]: { [key: number]: boolean } }>({});

	const copyToClipboard = (text: string, timeslotIndex: number, userIndex: number): void => {
		const copyResult = copy(text);

		if (copyResult) {
			notify('Message copied');

			setCopiedElements((prev) => ({
				...prev,
				[timeslotIndex]: {
					...prev[timeslotIndex],
					[userIndex]: true,
				},
			}));
		}
	};

	const generateOutput = () => {
		const notins = parseNotInMessage(notInMessage);
		const outputElements: ReturnType<typeof Fragment>[] = [];

		for (const timeslot of Timeslot) {
			const hour = slotFormat(timeslot, 'hour');
			const date = moment().tz('America/Toronto').hour(hour).minute(0).second(0);
			const discordTimestamp = `<t:${date.unix()}:t>`;

			outputElements.push(
				<Fragment key={`header-${timeslot}`}>
					<h4>{slotFormat(timeslot, 'header')}</h4>
				</Fragment>,
			);

			for (const [userIndex, userEntry] of notins) {
				const { user, threadUrl } = userEntry;
				const textToBeCopied = `${user}. Courtesy reminder to join your coop ASAP! You will receive a strike if you don’t join by +${Number.parseInt(timeslot, 10) + 5} (${discordTimestamp} in your time zone).`;
				const isCopied = copiedElements[timeslot]?.[userIndex];

				outputElements.push(
					<Fragment key={`${timeslot}-${userIndex}`}>
						<p>
							{threadUrl && (
								<a href={threadUrl} target="_blank" rel="noopener noreferrer">
									[Thread]
								</a>
							)}
							{isCopied ? ' ✅ ' : ' ❌ '}
							{textToBeCopied}
						</p>
						<button onClick={() => copyToClipboard(textToBeCopied, timeslot, userIndex)}>Copy to Clipboard</button>
					</Fragment>,
				);
			}
		}

		return outputElements;
	};

	return (
		<div style={{ margin: '2rem 1rem' }}>
			<ToastMessage />
			<h1>NotIn Message Generator</h1>
			<p style={{ display: 'flex', flexDirection: 'column' }}>
				<label htmlFor="#notInMessage">Not in message from Wonky</label>
				<textarea
					name="notInMessage"
					id="notInMessage"
					value={notInMessage}
					onChange={(event) => setNotInMessage(event.target.value)}
					style={{ margin: '1rem 0' }}
					rows={10}
				/>
			</p>

			{generateOutput()}
		</div>
	);
}
