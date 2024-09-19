'use client';

import copy from 'copy-to-clipboard';
import { Fragment, useState } from 'react';
import ToastMessage, { notify } from '@/components/ToastMessage';
import { Timeslot, useExtractNotins } from '@/components/initiator-tools';

export default function NotInFailsGeneratorPage() {
	const [notInMessage, setNotInMessage] = useState('');
	const [nitroMode, setNitroMode] = useState(false);

	const contractEgg = /Not in\s<(?<egg>:[^:]+:)\d+>/.exec(notInMessage)?.groups!.egg ?? '';
	const contractName =
		/Not in\s<:[^:]+:\d+> \*\*(?<contract>.+?)\*\*/.exec(notInMessage)?.groups!.contract ?? '';
	const contract = `${nitroMode ? contractEgg : ''} ${contractName}`.trim();

	const notins = useExtractNotins(notInMessage);

	const failsOutput = Object.entries(notins)
		.map(([timeslotEmoji, users]) =>
			[
				`## ${contract} ${Timeslot.fromEmoji(timeslotEmoji)!.format('eggst')} notins`,
				...users.map(({ user }) => `${user.split('`')[1]}, failure to join after 5 hours`),
			].join('\n'),
		)
		.join('\n\n');

	return (
		<div style={{ margin: '2rem 1rem' }}>
			<ToastMessage />
			<h1>NotIn Fails Generator</h1>

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

			<p style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
				<button onClick={() => setNitroMode(!nitroMode)} style={{ width: 'fit-content' }}>
					{nitroMode ? 'Nitro mode ON 🚀' : 'Nitro mode (include egg emoji in output)'}
				</button>

				<textarea name="failsOutput" id="failsOutput" value={failsOutput} rows={10} disabled />
				<Fragment>
					<button
						onClick={() => {
							const copyResult = copy(failsOutput);

							if (copyResult) {
								notify('Message copied');
							}
						}}
						style={{ width: 'fit-content' }}
					>
						Copy to Clipboard
					</button>
				</Fragment>
			</p>
		</div>
	);
}
