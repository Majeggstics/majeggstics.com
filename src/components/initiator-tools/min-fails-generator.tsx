import copy from 'copy-to-clipboard';
import Markdown from 'markdown-to-jsx';
import { css } from '@acab/ecsstatic';
import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { Timeslot } from '/components/initiator-tools';
import { useEventSetState, useToggleState } from '/lib/utils';

type MinsProps = {
	readonly contract: string;
	readonly minsMessage: string;
};
type CoopsInDangerProps = MinsProps & {
	readonly nitro: boolean;
};
const CoopsInDanger = ({ nitro, contract, minsMessage }: CoopsInDangerProps) => {
	const coopsInDanger = useMemo(
		() =>
			minsMessage
				.split('\n')
				.filter((row) => row.toLowerCase().includes(':warning:'))
				.map((row) => /^(?<emoji><?:\w+:(?:\d+>)?) (?<markdown>.*)/.exec(row)?.groups ?? {}),
		[minsMessage],
	);

	const copyCoopsInDanger = useMemo(
		() => coopsInDanger.map((coop) => (nitro ? coop.emoji + ' ' : '') + coop.markdown).join('\n'),
		[nitro, coopsInDanger],
	);

	const copyText = useCallback(() => {
		copy(`## ${contract} Coops in danger\n${copyCoopsInDanger} `);
	}, [contract, copyCoopsInDanger]);

	return (
		<section>
			<h2>{contract} Coops in danger ⚠️</h2>
			{coopsInDanger.length > 0 ?
				<ul>
					{coopsInDanger.map(({ markdown }, index) => (
						<li key={index}>
							<Markdown>
								{markdown?.replace(' :warning: ', ' ') ??
									'Broken row contained :warning: but did not match regex. Contact @dukecephalopod.'}
							</Markdown>
						</li>
					))}
				</ul>
			:	<p>No coops in danger</p>}
			<button onClick={copyText}> Copy to Clipboard </button>
		</section>
	);
};

const Notins = ({ contract, minsMessage }: MinsProps) => {
	const twentyFourHourNotins = useMemo(
		() =>
			minsMessage
				.split('\n')
				.filter((row) => row.toLowerCase().includes('missing'))
				.map((row) => row.replace(/^\*| is missing./g, '') + ', failure to join after 24 hours'),
		[minsMessage],
	);

	const copyText = useCallback(() => {
		copy(`## ${contract} 24 hour notins\n${twentyFourHourNotins.join('\n')}`);
	}, [contract, twentyFourHourNotins]);

	return (
		<section>
			<h2>{contract} 24 hour notins</h2>
			{twentyFourHourNotins.length > 0 ?
				<ul>
					{twentyFourHourNotins.map((user, index) => (
						<li key={index}>{user}</li>
					))}
				</ul>
			:	<p>No 24 hour notins</p>}
			<button onClick={copyText}>Copy to Clipboard</button>
		</section>
	);
};

type CopyProps = {
	readonly children: ReactNode;
	readonly text: string;
};
const Copy = ({ children, text }: CopyProps) => {
	const [copied, setCopied] = useState(false);
	const onClick = useCallback(() => {
		copy(text);
		setCopied(true);
	}, [text]);
	return (
		<>
			<button onClick={onClick}>Copy</button>
			<span>{copied ? ' ✅ ' : ' ❌ '}</span>
			{children}
		</>
	);
};

const column = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const grid = css`
	display: grid;
	grid-template-columns: max-content min-content auto;
	grid-column-gap: 0.7rem;
	grid-row-gap: 1rem;
	align-items: center;
`;

const MinimumFails = ({ contract, minsMessage }: MinsProps) => {
	const fails = useMemo(
		() =>
			minsMessage
				.split('\n')
				.filter((elem) => elem?.toLowerCase().includes('spent'))
				.map((elem) =>
					elem
						.replace(/<:b_icon_token:\d+>/, ':b_icon_token:')
						.replace(/<:clock:\d+>/, ':clock:')
						.replace('* ', '- '),
				),
		[minsMessage],
	);

	const copyAll = useCallback(() => {
		copy(`## ${contract} Minimum fails\n${fails.join('\n')}`);
	}, [contract, fails]);

	return (
		<section className={column}>
			<button onClick={copyAll}>Copy minimum fails as a single message</button>

			<div className={grid}>
				<Copy text={`## ${contract} Minimum fails`}>
					<h2>{contract} Minimum fails</h2>
				</Copy>
				{fails.length === 0 ?
					<Copy text="No fails">No fails</Copy>
				:	fails.map((fail, index) => (
						<Copy key={index} text={fail}>
							<Markdown>{fail.replace(/^- /, '')}</Markdown>
						</Copy>
					))
				}
			</div>
		</section>
	);
};

const fullWidth = css`
	width: 100%;
`;

export default function MinFailsGeneratorPage() {
	const [minsMessage, handleMinsMessageChange] = useEventSetState('');
	const [nitroMode, toggleNitroMode] = useToggleState(false);

	const timeslot: Timeslot | null = Timeslot.fromWonkyMessage(minsMessage);

	const headerRegex = /Minimum check for\s*<?(?<contractEgg>:.*:)(?:\d+>)?\s*(?<contractName>.*)/;
	const { contractEgg, contractName } = headerRegex.exec(minsMessage)?.groups ?? {};

	const contractNameWithTimeslot =
		contractName ?
			`${nitroMode ? contractEgg + ' ' : ''}${contractName} ${timeslot?.format('eggst')} `
		:	'Unknown Contract';

	return (
		<div className={column}>
			<button onClick={toggleNitroMode} style={{ width: 'fit-content' }}>
				{nitroMode ? 'Nitro mode ON' : 'Nitro mode (include egg emoji in output)'}
			</button>

			<div>
				<label htmlFor="minsMessage">Minimum check message from Wonky:</label>
				<textarea
					className={fullWidth}
					id="minsMessage"
					name="minsMessage"
					onChange={handleMinsMessageChange}
					rows={10}
					value={minsMessage}
				/>
			</div>

			{minsMessage.length === 0 ? null : (
				<div className={column}>
					<CoopsInDanger
						contract={contractNameWithTimeslot}
						minsMessage={minsMessage}
						nitro={nitroMode}
					/>

					<hr />

					<Notins contract={contractNameWithTimeslot} minsMessage={minsMessage} />

					<hr />

					<MinimumFails contract={contractNameWithTimeslot} minsMessage={minsMessage} />
				</div>
			)}
		</div>
	);
}
