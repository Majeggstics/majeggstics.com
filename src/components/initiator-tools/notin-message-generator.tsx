// Currently doesn't support Wonky's "(from timeslot xx)"
import copy from 'copy-to-clipboard';
import { useState, useCallback, useMemo } from 'react';
import { css } from '@acab/ecsstatic';
import { Timeslot, useExtractNotins, type UserSpec } from '/components/initiator-tools';
import { notify, useEventSetState } from '/lib/utils';

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
			`${user}. Courtesy reminder to join your coop ASAP! You will receive a strike if you don’t join by ${timeslot.format('join_deadline_eggst')} (${timeslot.format('join_deadline')} in your time zone).`,
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

const grid = css`
	display: grid;
	grid-template-columns: max-content repeat(2, min-content) auto;
	grid-column-gap: 0.5rem;
	grid-row-gap: 1rem;
`;

export default function NotInMessageGeneratorPage() {
	const [notInMessage, handleNotInMessageChange] = useEventSetState('');

	const notins = useExtractNotins(notInMessage);

	return (
		<>
			<label htmlFor="notInMessage">Not in message from Wonky:</label>
			<textarea
				id="notInMessage"
				name="notInMessage"
				onChange={handleNotInMessageChange}
				rows={10}
				value={notInMessage}
			/>

			{Object.entries(notins).map(([timeslotEmoji, slotNotins]) => (
				<section key={timeslotEmoji}>
					<h4>{Timeslot.fromEmoji(timeslotEmoji)!.format('header')}</h4>
					<div className={grid}>
						{slotNotins.map(({ users, threadUrl }, userIndex) => (
							<NotIn
								key={`${timeslotEmoji}-${userIndex}`}
								user={users.map((user: UserSpec) => user.combinedIdentifier).join(', ')}
								{...{ timeslotEmoji, threadUrl }}
							/>
						))}
					</div>
				</section>
			))}
		</>
	);
}
