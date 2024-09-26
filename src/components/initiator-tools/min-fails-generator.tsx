import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { Timeslot } from '/components/initiator-tools';
import { notify, useEventSetState, useToggleState } from '/lib/utils';

export default function MinFailsGeneratorPage() {
	const [notInMessage, handleNotInMessageChange] = useEventSetState('');
	const [showIndividualMessages, toggleShowIndividualMessages] = useToggleState(true);
	const [nitroMode, toggleNitroMode] = useToggleState(false);

	const timeslot: Timeslot | null = Timeslot.fromWonkyMessage(notInMessage);

	const notinRows = notInMessage.split('\n');

	const fails = notinRows
		.filter((elem) => elem?.toLowerCase().includes('spent'))
		.map((elem) =>
			elem
				.replace(/<:b_icon_token:\d+>/, ':b_icon_token:')
				.replace(/<:clock:\d+>/, ':clock:')
				.replace('* ', '- '),
		);

	const [copiedElements, setCopiedElements] = useState<boolean[]>(
		Array.from({ length: fails.length }).fill(false) as boolean[],
	);

	const copyToClipboard = (text: string, index: number) => {
		const copyResult = copy(text);

		if (copyResult) {
			notify('Message copied');

			setCopiedElements((prev) => {
				const newCopiedElements = [...prev];
				newCopiedElements[index] = true;
				return newCopiedElements;
			});
		}
	};

	const headerRegex = /Minimum check for\s*<?(?<contractEgg>:.*:)(?:\d+>)?\s*(?<contractName>.*)/;
	const { contractEgg, contractName } = headerRegex.exec(notInMessage)?.groups ?? {};

	const twentyFourHourNotins = notinRows
		.filter((elem) => elem.toLowerCase().includes('missing'))
		.map((elem) => elem.replace(/^\*| is missing./g, '') + ', failure to join after 24 hours');

	const coopsInDanger = notinRows.filter((elem) => elem.toLowerCase().includes(':warning'));

	const contractNameWithTimeslot = `${nitroMode ? contractEgg : ''} ${contractName} ${timeslot?.format('eggst')}`;

	return (
		<>
			<button onClick={toggleNitroMode} style={{ width: 'fit-content' }}>
				{nitroMode ? 'Nitro mode ON' : 'Nitro mode (include egg emoji in output)'}
			</button>

			<label htmlFor="notInMessage">Minimum check message from Wonky</label>
			<textarea
				id="notInMessage"
				name="notInMessage"
				onChange={handleNotInMessageChange}
				rows={10}
				value={notInMessage}
			/>

			<section>
				<h2>{contractNameWithTimeslot} Coops in danger ⚠️</h2>
				{coopsInDanger?.length > 0 ?
					coopsInDanger?.map((elem, index) => <p key={index}>{elem}</p>)
				:	<p>No coops in danger</p>}
				<button
					onClick={() => {
						let stringToBeCopied = `## ${contractNameWithTimeslot} Coops in danger\n`;

						stringToBeCopied += coopsInDanger.join('\n');

						copy(stringToBeCopied);
					}}
				>
					Copy to Clipboard
				</button>
			</section>

			<div style={{ margin: '4rem 0' }}>
				<h2>{contractNameWithTimeslot} 24 hour notins</h2>
				{twentyFourHourNotins?.length > 0 ?
					twentyFourHourNotins?.map((elem, index) => <p key={index}>{elem}</p>)
				:	<p>No 24 hour notins</p>}
				<button
					onClick={() => {
						let stringToBeCopied = `## ${contractNameWithTimeslot} 24 hour notins\n`;

						stringToBeCopied += twentyFourHourNotins.join('\n');

						copy(stringToBeCopied);
					}}
				>
					Copy to Clipboard
				</button>
			</div>

			<div>
				<button onClick={toggleShowIndividualMessages}>
					Show minimum fails as
					{showIndividualMessages ? ' a single message' : ' multiple messages'}
				</button>
			</div>

			{showIndividualMessages ?
				<div>
					<h2>{contractNameWithTimeslot} Minimum fails</h2>
					<button onClick={() => copy('## ' + contractNameWithTimeslot + ' Minimum fails')}>
						Copy heading to Clipboard
					</button>
					{fails?.length > 0 ?
						fails.map((elem, index) => (
							<div key={index} style={{ marginBottom: '3rem' }}>
								<p>
									{copiedElements[index] ? '✅' : '❌'} {elem}
								</p>
								<button onClick={() => copyToClipboard(elem, index)}>Copy to Clipboard</button>
							</div>
						))
					:	<div>
							<p>No fails</p>
							<button onClick={() => copy('No fails')}>Copy to Clipboard</button>
						</div>
					}
				</div>
			:	<div>
					<h2>{contractNameWithTimeslot} Minimum fails</h2>
					{fails?.length > 0 ?
						fails?.map((elem, index) => <p key={index}>{elem}</p>)
					:	<p>No fails</p>}
					<button
						onClick={() => {
							let stringToBeCopied = `## ${contractNameWithTimeslot} Minimum fails\n`;

							stringToBeCopied += fails.join('\n');

							if (copy(stringToBeCopied)) {
								notify('Message copied');
							}
						}}
					>
						Copy to Clipboard
					</button>
				</div>
			}
		</>
	);
}
