// Currently doesn't support Wonky's "(from timeslot xx)"
'use client';

import copy from 'copy-to-clipboard';
import { Fragment, useState, useCallback, useMemo } from 'react';
import ToastMessage from '@/components/ToastMessage';
import { Timeslot, useExtractNotins, type UserSpec } from '@/components/initiator-tools';
import { notify, useEventSetState } from '@/components/utils';

type NotInProps = {
	readonly threadUrl: string | null;
	readonly timeslotEmoji: string;
	readonly user: string;
};
const NotIn = ({ timeslotEmoji, user, threadUrl }: NotInProps) => {
	const timeslot = useMemo(() => Timeslot.fromEmoji(timeslotEmoji)!, [timeslotEmoji]);
	const [copied, setCopied] = useState<Boolean>(false);
	const text = useMemo(
		() =>
			`${user}. Courtesy reminder to join your coop ASAP! You will receive a strike if you don’t join by ${timeslot.format('eggst')} (${timeslot.format('discord')} in your time zone).`,
		[user, timeslot],
	);
	const handleCopy = useCallback(() => {
		if (copy(text)) {
			notify('Message copied');
			setCopied(true);
		}
	}, [text]);

	return (
		<>
			<button onClick={handleCopy}>Copy to Clipboard</button>
			<span>
				{threadUrl && (
					<a href={threadUrl} rel="noopener noreferrer" target="_blank">
						[Thread]
					</a>
				)}
			</span>
			<span>{copied ? ' ✅ ' : ' ❌ '}</span>
			<span>{text}</span>
		</>
	);
};

type TimeslotIdentifier = string;
type DiscordThreadUrl = string;
export default function NotInMessageGeneratorPage() {
	const [notInMessage, handleNotInMessageChange] = useEventSetState('');

	const notins = useExtractNotins(notInMessage);

	return (
		<div style={{ margin: '2rem 1rem' }}>
			<ToastMessage />
			<h1>NotIn Message Generator</h1>
			<p style={{ display: 'flex', flexDirection: 'column' }}>
				<label htmlFor="#notInMessage">Not in message from Wonky</label>
				<textarea
					id="notInMessage"
					name="notInMessage"
					onChange={handleNotInMessageChange}
					rows={10}
					style={{ margin: '1rem 0' }}
					value={notInMessage}
				/>
			</p>

			{Object.entries(notins).map(([timeslotEmoji, slotNotins]) => (
				<Fragment key={`header-${timeslotEmoji}`}>
					<h4>{Timeslot.fromEmoji(timeslotEmoji)!.format('header')}</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'max-content repeat(2, min-content) auto',
							gridColumnGap: '0.5rem',
							gridRowGap: '1rem',
						}}
					>
						{slotNotins.map(({ users, threadUrl }, userIndex) => (
							<NotIn
								key={`${timeslotEmoji}-${userIndex}`}
								user={users.map((user: UserSpec) => user.combinedIdentifier).join(', ')}
								{...{ timeslotEmoji, threadUrl }}
							/>
						))}
					</div>
				</Fragment>
			))}
		</div>
	);
}
