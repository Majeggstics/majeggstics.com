'use client';

import copy from 'copy-to-clipboard';
import { useState } from 'react';
import ToastMessage, { notify } from '@/components/ToastMessage';
import { Timeslot } from '@/components/initiator-tools';

export default function MinFailsGeneratorPage() {
	const [notInMessage, setNotInMessage] = useState('');
	const [showIndividualMinFailMessages, setShowIndividualMinFailMessages] = useState(true);
	const [nitroMode, setNitroMode] = useState(false);

	const timeslot: Timeslot | null = Timeslot.fromWonkyMessage(notInMessage);

	// Split the content into an array of lines
	const fails = notInMessage
		.slice()
		.split('\n')
		.filter((elem) => elem?.toLowerCase().includes('spent'))
		.map((elem) =>
			elem
				?.replace('<:b_icon_token:1123683788258549861>', ':b_icon_token:')
				?.replace('<:clock:1123686591412576357>', ':clock:')
				?.replace('* ', '- '),
		);

	// console.log({ fails });

	const [copiedElements, setCopiedElements] = useState<boolean[]>(
		Array.from({ length: fails.length }).fill(false) as boolean[],
	);

	const copyToClipboard = (text: string, index: number) => {
		const copyResult = copy(text);

		if (copyResult) {
			// console.log('Copied', copyResult);
			notify('Message copied');

			setCopiedElements((prev) => {
				const newCopiedElements = [...prev];
				newCopiedElements[index] = true;
				return newCopiedElements;
			});
		}
	};

	const contractEgg =
		/Minimum check for.*?<(?<egg>:.*:).*>.*/.exec(notInMessage)?.groups!.egg ?? '';
	const contractName =
		/Minimum check for.*?>(?<timeslot>.*)/.exec(notInMessage)?.groups!.timeslot ?? '';

	const twentyFourHourNotins = notInMessage
		.slice()
		.split('\n')
		.filter((elem) => elem?.toLowerCase().includes('missing'))
		.map((elem) =>
			elem
				?.replace('* ', '')
				?.replace(' is missing.', '')
				?.concat(', failure to join after 24 hours'),
		);

	const coopsInDanger = notInMessage
		.slice()
		.split('\n')
		.filter((elem) => elem?.toLowerCase().includes(':warning'));

	const contractNameWithTimeslot = `${nitroMode ? contractEgg : ''} ${contractName} ${timeslot?.format('eggst')}`;

	return (
		<div style={{ margin: '2rem 1rem' }}>
			<ToastMessage />
			<h1>Minimum Fails Generator</h1>

			<p style={{ display: 'flex', flexDirection: 'column' }}>
				<button onClick={() => setNitroMode(!nitroMode)} style={{ width: 'fit-content' }}>
					{nitroMode ? 'Nitro mode ON' : 'Nitro mode (include egg emoji in output)'}
				</button>
			</p>
			<p style={{ display: 'flex', flexDirection: 'column' }}>
				<label htmlFor="#notInMessage">Minimum check message from Wonky</label>
				<textarea
					name="notInMessage"
					id="notInMessage"
					value={notInMessage}
					onChange={(event) => setNotInMessage(event.target.value)}
					style={{ margin: '1rem 0' }}
					rows={10}
				/>
			</p>

			<div>
				<h2>{contractNameWithTimeslot} Coops in danger ⚠️</h2>
				{coopsInDanger?.length > 0 ? (
					coopsInDanger?.map((elem, index) => <p key={index}>{elem}</p>)
				) : (
					<p>No coops in danger</p>
				)}
				<p>
					<button
						onClick={() => {
							let stringToBeCopied = `## ${contractNameWithTimeslot} Coops in danger\n`;

							stringToBeCopied += coopsInDanger.join('\n');

							copy(stringToBeCopied);
						}}
					>
						Copy to Clipboard
					</button>
				</p>
			</div>

			<div style={{ margin: '4rem 0' }}>
				<h2>{contractNameWithTimeslot} 24 hour notins</h2>
				{twentyFourHourNotins?.length > 0 ? (
					twentyFourHourNotins?.map((elem, index) => <p key={index}>{elem}</p>)
				) : (
					<p>No 24 hour notins</p>
				)}
				<p>
					<button
						onClick={() => {
							let stringToBeCopied = `## ${contractNameWithTimeslot} 24 hour notins\n`;

							stringToBeCopied += twentyFourHourNotins.join('\n');

							copy(stringToBeCopied);
						}}
					>
						Copy to Clipboard
					</button>
				</p>
			</div>

			<div>
				<button onClick={() => setShowIndividualMinFailMessages((prevState) => !prevState)}>
					Show minimum fails as{' '}
					{showIndividualMinFailMessages ? ' a single message' : ' multiple messages'}
				</button>
			</div>

			{showIndividualMinFailMessages ? (
				<div>
					<h2>{contractNameWithTimeslot} Minimum fails</h2>
					<p>
						<button onClick={() => copy('## ' + contractNameWithTimeslot + ' Minimum fails')}>
							Copy heading to Clipboard
						</button>
					</p>
					{fails?.length > 0 ? (
						fails.map((elem, index) => {
							return (
								<div key={index} style={{ marginBottom: '3rem' }}>
									<p>
										{copiedElements[index] ? '✅' : '❌'} {elem}
									</p>
									<button onClick={() => copyToClipboard(elem, index)}>Copy to Clipboard</button>
								</div>
							);
						})
					) : (
						<div>
							<p>No fails</p>
							<p>
								<button onClick={() => copy('No fails')}>Copy to Clipboard</button>
							</p>
						</div>
					)}
				</div>
			) : (
				<div>
					<h2>{contractNameWithTimeslot} Minimum fails</h2>
					{fails?.length > 0 ? (
						fails?.map((elem, index) => <p key={index}>{elem}</p>)
					) : (
						<p>No fails</p>
					)}
					<p>
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
					</p>
				</div>
			)}
		</div>
	);
}
