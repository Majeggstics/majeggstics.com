// this lint rule is completely accurate but i cba to deal with it right now

import { css } from '@acab/ecsstatic';
import { useCallback, createContext, useContext, useMemo } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { usePersistentState } from '/lib/utils';
import type { Artifact, ArtifactIntensity, Stone } from '/lib/ei_data';
import {
	artifactRarity,
	Boost,
	ArtifactSpec,
	PossibleArtifactIntensity,
	chaliceMultiplier,
	monocleMultiplier,
	gussetMultiplier,
} from '/lib/ei_data';

type SlottedArtifact = {
	spec: Artifact;
	stonesList: Stone[];
};
type EIBackupResponse = {
	userName: string;
	artifactsDb: {
		savedArtifactSetsList: Array<{
			slotsList: Array<{
				occupied: boolean;
				itemId: number;
			}>;
		}>;
		inventoryItemsList: Array<{
			itemId: number;
			artifact: SlottedArtifact;
		}>;
	};
};
const ApiUriContext = createContext<string>('missing api uri');

type CalcData = {
	eid: string;
	ign?: string | undefined;
	gusset?: ArtifactIntensity | undefined;
	monocle?: ArtifactIntensity | undefined;
	chalice?: ArtifactIntensity | undefined;
	lifeT2: number;
	lifeT3: number;
	lifeT4: number;
	diliT2: number;
	diliT3: number;
	diliT4: number;
	boost: string;
};
const defaultCalcData = () => ({
	eid: '',
	lifeT2: 0,
	lifeT3: 0,
	lifeT4: 0,
	diliT2: 0,
	diliT3: 0,
	diliT4: 0,
	boost: 'boost8',
});
type CalcDataAndSetter = { calcData: CalcData; setCalcData: Dispatch<SetStateAction<CalcData>> };
const CalcDataContext = createContext<CalcDataAndSetter>({
	calcData: defaultCalcData(),
	setCalcData: () => {},
});

const flex = css`
	display: flex;
	flex-direction: inherit;
`;

const column = css`
	display: flex;
	flex-direction: column;
`;

type InputCellProps = { readonly datakey: keyof CalcData; readonly label: string };
const InputCell = ({
	datakey,
	label,
	...rest
}: InputCellProps & React.InputHTMLAttributes<HTMLInputElement>) => {
	const { calcData, setCalcData } = useContext(CalcDataContext);

	const handleInput = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setCalcData((data) => ({ ...data, [datakey]: event.target.value }));
		},
		[setCalcData, datakey],
	);

	const value =
		typeof calcData[datakey] === 'string' || typeof calcData[datakey] === 'number' ?
			calcData[datakey]
		:	`${datakey} is not a good key`;

	return (
		<div className={flex}>
			<label htmlFor={`input-${datakey}`}>{label}</label>
			<input
				id={`input-${datakey}`}
				name={datakey}
				onChange={handleInput}
				value={value}
				{...rest}
			/>
		</div>
	);
};

type OutputCellProps = {
	readonly label: string;
} & (
	| { readonly datakey: keyof CalcData }
	| { readonly children: React.ReactNode }
	| { readonly value: string }
);
const OutputCell = (props: OutputCellProps) => {
	const { calcData } = useContext(CalcDataContext);

	let value;
	if ('datakey' in props) {
		const data = calcData[props.datakey];
		value =
			typeof data === 'string' || typeof data === 'number' ?
				data
			:	`${props.datakey} is not a good key`;
	} else if ('value' in props) {
		value = props.value;
	} else {
		value = props.children;
	}

	return (
		<>
			<span>{props.label}</span>
			<span>{value}</span>
		</>
	);
};

type FetchCoopDataProps = { readonly children: React.ReactNode };
const FetchCoopDataButton = ({ children }: FetchCoopDataProps) => {
	const apiUri = useContext(ApiUriContext);
	const { calcData, setCalcData } = useContext(CalcDataContext);

	const fetchCoopData = useCallback(async () => {
		const rawEIResponse: EIBackupResponse = await fetch(
			`${apiUri}/backup?EID=${calcData.eid}`,
		).then(async (res) => res.json());

		console.log({ rawEIResponse });

		const resolveItemId = (itemId: number): SlottedArtifact => {
			const items = rawEIResponse.artifactsDb.inventoryItemsList;
			let lo = 0;
			let hi = items.length;
			while (lo <= hi) {
				const mid = Math.floor((lo + hi) / 2);
				const item = items[mid]!;
				if (item.itemId === itemId) {
					return item.artifact;
				} else if (item.itemId > itemId) {
					hi = mid - 1;
				} else {
					lo = mid + 1;
				}
			}

			throw new Error(
				`Egg, Inc. backup contained an item ID (${itemId}) that is missing from itself`,
			);
		};

		const ihrForSet = (set: SlottedArtifact[]) => {
			const life = [0, 0, 0];
			let chalice = 1;
			for (const artifact of set) {
				for (const stone of artifact.stonesList) {
					if (stone.name === ArtifactSpec.Name.LIFE_STONE) {
						life[stone.level]! += 1;
					}
				}

				if (artifact.spec.name === ArtifactSpec.Name.THE_CHALICE) {
					chalice = chaliceMultiplier(artifact.spec);
				}
			}

			return {
				stones: life,
				effect: chalice * 1.02 ** life[0]! * 1.03 ** life[1]! * 1.04 ** life[2]!,
			};
		};

		const diliForSet = (set: SlottedArtifact[]) => {
			const dili = [0, 0, 0];
			for (const artifact of set) {
				for (const stone of artifact.stonesList) {
					if (stone.name === ArtifactSpec.Name.DILITHIUM_STONE) {
						dili[stone.level]! += 1;
					}
				}
			}

			return {
				stones: dili,
				effect: 1.03 ** dili[0]! * 1.06 ** dili[1]! * 1.08 ** dili[2]!,
			};
		};

		const sets = rawEIResponse.artifactsDb.savedArtifactSetsList
			.map(({ slotsList }) =>
				slotsList.filter(({ occupied }) => occupied).map(({ itemId }) => resolveItemId(itemId)),
			)
			.map((set) => ({ set, ihr: ihrForSet(set), dili: diliForSet(set) }));

		const ihrSets = sets.toSorted((a, b) => {
			const ihrDiff = b.ihr.effect - a.ihr.effect;
			if (ihrDiff === 0) {
				const noGus = { level: 0, rarity: -1 };
				const aGus =
					a.set.find((a) => a.spec.name === ArtifactSpec.Name.ORNATE_GUSSET)?.spec ?? noGus;
				const bGus =
					b.set.find((a) => a.spec.name === ArtifactSpec.Name.ORNATE_GUSSET)?.spec ?? noGus;

				// 8 is chosen arbitrarily but larger than max rarity
				return bGus.level * 8 + bGus.rarity - (aGus.level * 8 + aGus.rarity);
			}

			return ihrDiff;
		});
		console.log(ihrSets);
		const ihrSet = ihrSets[0];
		const diliSet = sets.toSorted((a, b) => b.dili.effect - a.dili.effect)[0];

		const monocle = ihrSet?.set.find(
			(arti) => arti.spec.name === ArtifactSpec.Name.DILITHIUM_MONOCLE,
		)?.spec;

		const chalice = ihrSet?.set.find(
			(arti) => arti.spec.name === ArtifactSpec.Name.THE_CHALICE,
		)?.spec;

		const gusset = ihrSet?.set.find(
			(arti) => arti.spec.name === ArtifactSpec.Name.ORNATE_GUSSET,
		)?.spec;

		setCalcData((data) => ({
			...data,
			ign: rawEIResponse.userName,
			lifeT2: ihrSet?.ihr.stones[0] ?? 0,
			lifeT3: ihrSet?.ihr.stones[1] ?? 0,
			lifeT4: ihrSet?.ihr.stones[2] ?? 0,
			diliT2: diliSet?.dili.stones[0] ?? 0,
			diliT3: diliSet?.dili.stones[1] ?? 0,
			diliT4: diliSet?.dili.stones[2] ?? 0,
			chalice,
			monocle,
			gusset,
		}));
	}, [calcData.eid, apiUri, setCalcData]);

	return <button onClick={fetchCoopData}>{children}</button>;
};

type ArtifactSelectorProps = {
	readonly kind: 'monocle' | 'gusset' | 'chalice';
};
const ArtifactSelector = ({ kind }: ArtifactSelectorProps) => {
	const { calcData, setCalcData } = useContext(CalcDataContext);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const [level, rarity] = event.target.value.split('-').map((val) => Number.parseInt(val, 10));
			setCalcData((data) => ({
				...data,
				[kind]: {
					level,
					rarity,
				},
			}));
		},
		[setCalcData, kind],
	);

	const current = calcData[kind] ? `${calcData[kind].level}-${calcData[kind].rarity}` : '-';
	console.log({ current, is: calcData[kind] });

	return (
		<div className={column}>
			<label htmlFor={`select-${kind}`}>{kind.charAt(0).toUpperCase() + kind.slice(1)}</label>
			<select id={`select-${kind}`} onChange={handleChange} value={current}>
				<option value="-">None</option>
				{PossibleArtifactIntensity[kind].map(({ level, rarity }) => {
					const value = `${level}-${rarity}`;
					return (
						<option key={value} value={value}>{`T${level + 1}${artifactRarity(rarity)}`}</option>
					);
				})}
			</select>
		</div>
	);
};

const gapRow = css`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	#input-eid-artifacts {
		display: flex;
		flex-direction: column;
		.spacer {
			flex: 1;
		}
	}
	#input-stones {
		flex: 1;
	}
`;

const gapColumn = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const inputsColumn = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	> div,
	button {
		width: min(100%, 12em);
	}
`;

const radioRow = css`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(15em, 100%), 1fr));
	gap: 1rem;
	div {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		width: fit-content;
	}
	label {
		width: max-content;
	}
`;

const stoneInputRow = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	div {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		width: fit-content;
		align-items: center;
	}
	label {
		width: max-content;
	}
`;

const boostRadios = [
	{ id: 'boost8', label: '8-token' },
	{ id: 'boost6', label: '6-token (Dubson)' },
	{ id: 'boost6s', label: '6-token (Dubson Supreme)' },
	{ id: 'boost5', label: '5-token (Benson Supreme)' },
	{ id: 'boost4', label: '4-token (Epic)' },
	{ id: 'boost4s', label: '4-token (Supreme)' },
	{ id: 'boost2', label: '2-token (Single Epic)' },
	{ id: 'boost0', label: '0-token (five large)' },
] as const;
const BoostPresetButtons = () => {
	const { calcData, setCalcData } = useContext(CalcDataContext);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setCalcData((data) => ({ ...data, boost: event.target.value }));
		},
		[setCalcData],
	);

	return (
		<fieldset className={radioRow}>
			<legend>Boost Set</legend>
			{boostRadios.map(({ id, label }) => (
				<div key={id}>
					<input
						type="radio"
						name="boostSet"
						id={id}
						value={id}
						checked={calcData.boost === id}
						onChange={handleChange}
					/>
					<label htmlFor={id}>{label}</label>
				</div>
			))}
		</fieldset>
	);
};

const outputGrid = css`
	font-size: 120%;

	display: grid;
	grid-template-columns: max-content max-content;
	column-gap: 1rem;

	:nth-child(odd) {
		justify-self: end;
	}

	:nth-child(even) {
		justify-self: start;
	}
`;
export default function ContractBoostCalculator({ api }: { readonly api: string }) {
	const [calcData, setCalcData] = usePersistentState<CalcData>('calcData', defaultCalcData());
	const calcState = useMemo<CalcDataAndSetter>(
		() => ({ calcData, setCalcData }),
		[calcData, setCalcData],
	);

	const boosts = useMemo(() => {
		switch (calcData.boost) {
			case 'boost8':
				return [Boost.LegendaryTach, Boost.EpicBeacon];
			case 'boost6':
				return [Boost.LegendaryTach, Boost.Beacon, Boost.Beacon];
			case 'boost6s':
				return [Boost.SupremeTach, Boost.Beacon, Boost.Beacon];
			case 'boost5':
				return [Boost.LegendaryTach, Boost.Beacon];
			case 'boost4':
				return [Boost.EpicTach, Boost.EpicTach];
			case 'boost4s':
				return [Boost.SupremeTach];
			case 'boost2':
				return [Boost.EpicTach];
			default:
				return [
					Boost.LargeTach,
					Boost.LargeTach,
					Boost.LargeTach,
					Boost.LargeTach,
					Boost.LargeTach,
				];
		}
	}, [calcData.boost]);

	const diliBonus = useMemo(
		() => 1.03 ** calcData.diliT2 * 1.06 ** calcData.diliT3 * 1.08 ** calcData.diliT4,
		[calcData.diliT2, calcData.diliT3, calcData.diliT4],
	);

	const lifeBonus = useMemo(
		() => 1.02 ** calcData.lifeT2 * 1.03 ** calcData.lifeT3 * 1.04 ** calcData.lifeT4,
		[calcData.lifeT2, calcData.lifeT3, calcData.lifeT4],
	);

	const maxHabSpace = useMemo(
		() => 11_340_000_000 * gussetMultiplier(calcData.gusset ?? { level: 0, rarity: 0 }),
		[calcData.gusset],
	);

	const [onlineChickens, timeToMaxHabs] = useMemo(() => {
		const baseIhr = 7_440;

		let tachMult = boosts
			.filter((b) => b.name.includes('Tachyon'))
			.reduce((sum, b) => sum + b.multiplier, 0);
		let beaconMult = boosts
			.filter((b) => b.name.includes('Beacon'))
			.reduce((sum, b) => sum + b.multiplier, 0);

		const timeOrdered = boosts.toSorted((a, b) => a.durationMins - b.durationMins);
		let timeToMaxHabs = 0;
		let population = 0;
		let elapsed = 0;
		for (const boost of timeOrdered) {
			if (boost.durationMins > elapsed) {
				const time = diliBonus * (boost.durationMins - elapsed);
				const ihr =
					baseIhr *
					lifeBonus *
					Math.max(1, tachMult * Math.max(1, beaconMult)) *
					chaliceMultiplier(calcData.chalice ?? { level: 0, rarity: 0 }) *
					monocleMultiplier(calcData.monocle ?? { level: 0, rarity: 0 });

				console.log({ time, diliBonus, lifeBonus, tachMult, beaconMult });

				const chickens = time * ihr * 4;

				if (timeToMaxHabs === 0 && maxHabSpace <= (population + chickens) * 3) {
					const missing = maxHabSpace - population * 3;
					const percentOfBoostUsed = missing / (chickens * 3);
					const timeUsed = percentOfBoostUsed * time;
					timeToMaxHabs = elapsed * diliBonus + timeUsed;
				}

				population += chickens;
				elapsed = boost.durationMins;
			}

			if (boost.name.includes('Tachyon')) {
				tachMult -= boost.multiplier;
			} else if (boost.name.includes('Beacon')) {
				beaconMult -= boost.multiplier;
			}
		}

		let sec = timeToMaxHabs * 60;
		const hr = Math.floor(sec / 3_600);
		sec -= hr * 3_600;
		const min = Math.floor(sec / 60);
		sec = Math.round(sec - min * 60);
		const formattedTime = [
			hr > 0 ? hr + 'hr' : '',
			min > 0 ? min + 'min' : '',
			sec > 0 ? sec + 'sec' : '',
		]
			.filter(Boolean)
			.join(' ');
		return [Math.floor(population), formattedTime];
	}, [boosts, calcData.chalice, diliBonus, lifeBonus, calcData.monocle, maxHabSpace]);

	const boostDurationRaw = useMemo(() => {
		const minDuration = boosts.reduce((min, b) => Math.min(min, b.durationMins), Infinity);
		return minDuration * diliBonus;
	}, [boosts, diliBonus]);

	const boostDuration = useMemo(() => {
		const mins = boostDurationRaw;

		let boostDuration = mins >= 60 ? Math.floor(mins / 60) + 'hr' : '';
		if (mins % 60 > 0) {
			boostDuration += Math.round(mins % 60) + 'min';
		}

		return boostDuration;
	}, [boostDurationRaw]);

	const boostCost = useMemo(() => {
		const sum = boosts.reduce((sum, b) => sum + b.geCost, 0);
		return sum * 0.8;
	}, [boosts]);

	return (
		<ApiUriContext.Provider value={api}>
			<CalcDataContext.Provider value={calcState}>
				<div className={gapColumn}>
					<section>
						<h1>Contract Boost Calculator</h1>
						<h2>Calculates the number of chickens for a boost set. Assumes max ER.</h2>
					</section>
					<div className={gapRow}>
						<section id="input-eid-artifacts" className={inputsColumn}>
							<InputCell datakey="eid" label="EID (Optional)" />
							<FetchCoopDataButton>Fetch account data</FetchCoopDataButton>
							<div className="spacer" />
							<ArtifactSelector kind="monocle" />
							<ArtifactSelector kind="chalice" />
							<ArtifactSelector kind="gusset" />
						</section>
						<section id="input-stones" className={gapColumn}>
							<fieldset>
								<legend>Life stones in IHR set:</legend>
								<div className={stoneInputRow}>
									<InputCell datakey="lifeT2" label="T2:" max="12" min="0" size={2} type="number" />
									<InputCell datakey="lifeT3" label="T3:" max="12" min="0" size={2} type="number" />
									<InputCell datakey="lifeT4" label="T4:" max="12" min="0" size={2} type="number" />
								</div>
							</fieldset>
							<fieldset>
								<legend>Dilithium stones in dili set:</legend>
								<div className={stoneInputRow}>
									<InputCell datakey="diliT2" label="T2:" max="12" min="0" size={2} type="number" />
									<InputCell datakey="diliT3" label="T3:" max="12" min="0" size={2} type="number" />
									<InputCell datakey="diliT4" label="T4:" max="12" min="0" size={2} type="number" />
								</div>
							</fieldset>
						</section>
					</div>
					<hr />
					<BoostPresetButtons />
					<hr />
					<section id="output">
						<div className={outputGrid}>
							<OutputCell label="Boosts">
								{boosts.map((boost: Boost, id: number) => (
									<img key={id} src={boost.iconPath()} width="20" title={boost.descriptor()} />
								))}
							</OutputCell>
							<OutputCell label="First boost runs out after" value={boostDuration} />
							<OutputCell label="GE cost (buying in 5s)" value={boostCost.toLocaleString()} />
							<OutputCell label="Population (online)" value={onlineChickens.toLocaleString()} />
							<OutputCell
								label="Population (offline)"
								value={(onlineChickens * 3).toLocaleString()}
							/>
							<OutputCell label="Max hab space" value={maxHabSpace.toLocaleString()} />
							<OutputCell label="Time to fill habs" value={timeToMaxHabs || '∞'} />
						</div>
					</section>
				</div>
			</CalcDataContext.Provider>
		</ApiUriContext.Provider>
	);
}
