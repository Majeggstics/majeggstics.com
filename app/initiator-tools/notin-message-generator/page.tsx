// Currently doesn't support Wonky's "(from timeslot xx)"
'use client';

import copy from 'copy-to-clipboard';
import { Fragment, useState, useCallback } from 'react';
import ToastMessage, { notify } from '@/components/ToastMessage';
import { Timeslot, useExtractNotins } from '@/components/initiator-tools';

export default function NotInMessageGeneratorPage() {
	const [notInMessage, setNotInMessage] = useState('');
	const [copiedElements, setCopiedElements] = useState<{
		[key: number]: { [key: number]: boolean };
	}>({});

	const copyToClipboard = useCallback(
		(text: string, timeslotIndex: number, userIndex: number): void => {
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
		},
		[],
	);

	const notins = useExtractNotins(notInMessage);

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

			{Object.entries(notins).map(([timeslotEmoji, users]) => {
				const timeslot = Timeslot.fromEmoji(timeslotEmoji)!;

				return (
					<Fragment key={`header-${timeslot.index}`}>
						<h4>{timeslot.format('header')}</h4>
						{users.map(({ user, threadUrl }, userIndex) => {
							const textToBeCopied = `${user}. Courtesy reminder to join your coop ASAP! You will receive a strike if you don’t join by ${timeslot.format('eggst')} (${timeslot.format('discord')} in your time zone).`;
							const isCopied = copiedElements[timeslot.index]?.[userIndex];

							return (
								<Fragment key={`${timeslot.index}-${userIndex}`}>
									<p>
										{threadUrl && (
											<a href={threadUrl} target="_blank" rel="noopener noreferrer">
												[Thread]
											</a>
										)}
										{isCopied ? ' ✅ ' : ' ❌ '}
										{textToBeCopied}
									</p>
									<button
										onClick={() => copyToClipboard(textToBeCopied, timeslot.index, userIndex)}
									>
										Copy to Clipboard
									</button>
								</Fragment>
							);
						})}
					</Fragment>
				);
			})}
		</div>
	);
}
