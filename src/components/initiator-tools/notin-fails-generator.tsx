import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { Timeslot, useExtractNotins } from '/components/initiator-tools';

export default function NotInFailsGeneratorPage() {
	const [notInMessage, setNotInMessage] = useState('');
	const [nitroMode, setNitroMode] = useState(false);

	const contractEgg = /Not in\s<(?<egg>:[^:]+:)\d+>/.exec(notInMessage)?.groups!.egg ?? '';
	const contractName =
		/Not in\s<?:[^:]+:(?:\d+>)? \*\*(?<contract>.+?)\*\*/.exec(notInMessage)?.groups!.contract ??
		'';
	const contract = `${nitroMode ? contractEgg : ''} ${contractName}`.trim();

	const notins = useExtractNotins(notInMessage);

	const failsOutput = Object.entries(notins)
		.map(([timeslotEmoji, slotNotins]) =>
			[
				`## ${contract} ${Timeslot.fromEmoji(timeslotEmoji)!.format('eggst')} notins`,
				...slotNotins.flatMap(({ users }) =>
					users.map(({ ign }) => `\`${ign}\`, failure to join after 5 hours`),
				),
			].join('\n'),
		)
		.join('\n\n');

	return (
		<div style={{ margin: '2rem 1rem' }}>
			<h1>NotIn Fails Generator</h1>

			<p style={{ display: 'flex', flexDirection: 'column' }}>
				<label htmlFor="#notInMessage">Not in message from Wonky</label>
				<textarea
					id="notInMessage"
					name="notInMessage"
					onChange={(event) => setNotInMessage(event.target.value)}
					rows={10}
					style={{ margin: '1rem 0' }}
					value={notInMessage}
					autoFocus
				/>
			</p>

			<p style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
				<button onClick={() => setNitroMode(!nitroMode)} style={{ width: 'fit-content' }}>
					{nitroMode ? 'Nitro mode ON 🚀' : 'Nitro mode (include egg emoji in output)'}
				</button>

				<textarea disabled id="failsOutput" name="failsOutput" rows={10} value={failsOutput} />
				<button onClick={() => copy(failsOutput)} style={{ width: 'fit-content' }}>
					Copy to Clipboard
				</button>
			</p>
		</div>
	);
}
