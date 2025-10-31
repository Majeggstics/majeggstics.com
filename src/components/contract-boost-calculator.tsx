import { useCallback, createContext, useContext, useMemo, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { Artifact, ArtifactIntensity, Stone } from '/lib/ei_data';
import {
	artifactRarity,
	ArtifactSpec,
	Colleggtible,
	EpicResearch,
	PossibleArtifactIntensity,
	chaliceMultiplier,
	monocleMultiplier,
	gussetMultiplier,
} from '/lib/ei_data';
import { Boost } from '/components/Boosts';
import { useToggleState } from '/lib/hooks';
import { groupBy } from '/lib/utils';
import { generateCalculator, type WithSetter } from '/components/calculator.tsx';

type SlottedArtifact = { spec: Artifact; stonesList: Stone[] };
type Coop = { contract: { customEggId?: string }; maxFarmSizeReached: number };
type EIBackupResponse = {
	userName: string;
	artifactsDb: {
		savedArtifactSetsList: Array<{ slotsList: Array<{ occupied: boolean; itemId: number }> }>;
		inventoryItemsList: Array<{ itemId: number; artifact: SlottedArtifact }>;
	};
	game: { epicResearchList: Array<{ id: string; level: number }> };
	contracts: { archiveList: Coop[]; contractsList: Coop[] };
	virtue: { eovEarnedList: number[] };
};
const ApiUriContext = createContext<string>('missing api uri');

const enum FetchState {
	IDLE = 'idle',
	PENDING = 'pending',
	RETRY = 'retry',
	SUCCESS = 'success',
	FAILURE = 'failure',
}

type CalcData = {
	eid: string;
	gusset?: ArtifactIntensity | undefined;
	monocle?: ArtifactIntensity | undefined;
	chalice?: ArtifactIntensity | undefined;
	lifeT2: string;
	lifeT3: string;
	lifeT4: string;
	diliT2: string;
	diliT3: string;
	diliT4: string;
	boost: string;
	fetchState: FetchState;
	fetchRetryIn: number;
	doubleDuration: boolean;
	baseIhr: string;
	hatcheryCalm: string;
	colleggtibleIhr: string;
	truthEggCount: string;
};

const nullArtifact = { level: Number.NaN, rarity: Number.NaN };
const defaultCalcData = () => ({
	eid: '',
	lifeT2: '0',
	lifeT3: '0',
	lifeT4: '0',
	diliT2: '0',
	diliT3: '0',
	diliT4: '0',
	boost: 'boost8',
	fetchState: FetchState.IDLE,
	fetchRetryIn: 0,
	doubleDuration: false,
	baseIhr: '7440',
	hatcheryCalm: '20',
	colleggtibleIhr: '5',
	truthEggCount: '0',
	monocle: nullArtifact,
	gusset: nullArtifact,
	chalice: nullArtifact,
});

const Calculator = generateCalculator<CalcData>(defaultCalcData());
const { Input, Output } = Calculator;

type FetchCoopDataProps = { readonly children: React.ReactNode };
const FetchCoopDataButton = ({ children }: FetchCoopDataProps) => {
	const apiUri = useContext(ApiUriContext);
	const { data, updateData } = useContext<WithSetter<CalcData>>(Calculator.Context);

	const fetchData = useCallback(async () => {
		const backoffs = [1, 2, 5, 8, 13, 0] as const;
		let eiResponse: EIBackupResponse | null = null;
		for (const backoff of backoffs) {
			updateData({ fetchState: FetchState.PENDING });
			const rawEIResponse = await fetch(`${apiUri}/backup?EID=${data.eid}`);

			if (rawEIResponse.ok) {
				eiResponse = await rawEIResponse.json();
				break;
			} else if (backoff > 0) {
				updateData({ fetchState: FetchState.RETRY, fetchRetryIn: backoff });
				// we're doing this as a bunch of 1-second sleeps to get a countdown text
				// this is technically not that accurate and it should be a setInterval
				// but that was gnarly to write out
				for (let remaining = backoff; remaining > 0; remaining--) {
					updateData({ fetchRetryIn: remaining });
					// no-loop-func is worried about `setTimeout` here ಠ_ಠ

					await new Promise((resolve) => void setTimeout(resolve, 1_000));
				}
			}
		}

		if (!eiResponse) return void updateData({ fetchState: FetchState.FAILURE });

		const resolveItemId = (itemId: number): SlottedArtifact => {
			const items = eiResponse.artifactsDb.inventoryItemsList;
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

			const [t1, t2, t3] = life;

			return { stones: life, effect: chalice * 1.02 ** t1! * 1.03 ** t2! * 1.04 ** t3! };
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

			const [t1, t2, t3] = dili;

			return { stones: dili, effect: 1.03 ** t1! * 1.06 ** t2! * 1.08 ** t3! };
		};

		const sets = eiResponse.artifactsDb.savedArtifactSetsList
			.map(({ slotsList }) =>
				slotsList.filter(({ occupied }) => occupied).map(({ itemId }) => resolveItemId(itemId)),
			)
			.map((set) => ({ set, ihr: ihrForSet(set), dili: diliForSet(set) }));

		const byName = (want: ArtifactSpec.Name) => (arti: { spec: { name: ArtifactSpec.Name } }) =>
			arti.spec.name === want;

		const ihrSets = sets.toSorted((a, b) => {
			const ihrDiff = b.ihr.effect - a.ihr.effect;
			if (ihrDiff === 0) {
				const noGus = { level: 0, rarity: -1 };
				const aGus = a.set.find(byName(ArtifactSpec.Name.ORNATE_GUSSET))?.spec ?? noGus;
				const bGus = b.set.find(byName(ArtifactSpec.Name.ORNATE_GUSSET))?.spec ?? noGus;

				// 8 is chosen arbitrarily but larger than max rarity
				return bGus.level * 8 + bGus.rarity - (aGus.level * 8 + aGus.rarity);
			}

			return ihrDiff;
		});
		const ihrSet = ihrSets[0];
		const diliSet = sets.toSorted((a, b) => b.dili.effect - a.dili.effect)[0];

		const monocle = ihrSet?.set.find(byName(ArtifactSpec.Name.DILITHIUM_MONOCLE))?.spec;
		const chalice = ihrSet?.set.find(byName(ArtifactSpec.Name.THE_CHALICE))?.spec;
		const gusset = ihrSet?.set.find(byName(ArtifactSpec.Name.ORNATE_GUSSET))?.spec;

		const ihcResearch = eiResponse.game.epicResearchList[EpicResearch.INT_HATCH_CALM];

		const byCustomEgg = groupBy(
			eiResponse.contracts.archiveList.concat(eiResponse.contracts.contractsList),

			// || on purpose, so that empty string goes to undefined and is discarded by groupBy
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(contract) => contract.contract.customEggId || undefined,
		);

		const maxEaster = byCustomEgg.easter?.reduce(
			(max, each) => Math.max(max, each.maxFarmSizeReached),
			0,
		);

		const sumTE = (backupVirtue: EIBackupResponse['virtue']) =>
			backupVirtue?.eovEarnedList?.reduce((x, y) => x + y) ?? 0;

		updateData({
			fetchState: FetchState.SUCCESS,
			lifeT2: String(ihrSet?.ihr.stones[0] ?? 0),
			lifeT3: String(ihrSet?.ihr.stones[1] ?? 0),
			lifeT4: String(ihrSet?.ihr.stones[2] ?? 0),
			diliT2: String(diliSet?.dili.stones[0] ?? 0),
			diliT3: String(diliSet?.dili.stones[1] ?? 0),
			diliT4: String(diliSet?.dili.stones[2] ?? 0),
			hatcheryCalm: String(ihcResearch?.level ?? 0),
			colleggtibleIhr: String(Colleggtible.easterBonus(maxEaster ?? 0)),
			truthEggCount: String(sumTE(eiResponse?.virtue)),
			chalice,
			monocle,
			gusset,
		});
	}, [data.eid, apiUri, updateData]);

	return (
		<>
			<button
				className={`fetch-state-${data.fetchState}`}
				disabled={[FetchState.RETRY, FetchState.PENDING].includes(data.fetchState)}
				id="fetch-data"
				onClick={fetchData}
			>
				{children}
			</button>
			{data.fetchState !== FetchState.IDLE && (
				<div id="fetch-state">
					{data.fetchState === FetchState.PENDING ?
						<>
							<span className="spinner" />
							Loading...
						</>
					: data.fetchState === FetchState.RETRY ?
						<>
							<span className="spinner" />
							Retrying in {data.fetchRetryIn}s...
						</>
					: data.fetchState === FetchState.FAILURE ?
						<>
							<span>❌</span>Failed.
						</>
					: data.fetchState === FetchState.SUCCESS ?
						<>
							<span>✔️</span>Loaded artifacts and stones from saved sets!
						</>
					:	null}
				</div>
			)}
		</>
	);
};

type ArtifactSelectorProps = { readonly kind: 'monocle' | 'gusset' | 'chalice' };
const ArtifactSelector = ({ kind }: ArtifactSelectorProps) => {
	const { data, updateData } = useContext<WithSetter<CalcData>>(Calculator.Context);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const [level, rarity] = event.target.value.split('-').map((val) => Number.parseInt(val, 10));
			updateData({ [kind]: { level, rarity } });
		},
		[updateData, kind],
	);

	const current = data[kind] ? `${data[kind].level}-${data[kind].rarity}` : '-';

	return (
		<div className="artifactSelect">
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

const boostRadios = [
	{ id: 'boost8', label: '8-token' },
	{ id: 'boost6', label: '6-token (Dubson)' },
	{ id: 'boost6s', label: '6-token (Dubson Supreme)' },
	{ id: 'boost5', label: '5-token (Benson)' },
	{ id: 'boost5s', label: '5-token (Benson Supreme)' },
	{ id: 'boost4', label: '4-token (Epic)' },
	{ id: 'boost4s', label: '4-token (Supreme)' },
	{ id: 'boost2', label: '2-token (Single Epic)' },
	{ id: 'boost0', label: '0-token (five large)' },
] as const;
const BoostPresetButtons = () => {
	const { data, updateData } = useContext<WithSetter<CalcData>>(Calculator.Context);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			updateData({ boost: event.target.value });
		},
		[updateData],
	);

	// we should be able to have the `fieldset` be `#boostSets` to receive
	// `display: grid`, but then it appears that having the `legend` there
	// screws up the first render for iOS safari specifically ಠ_ಠ
	return (
		<fieldset>
			<legend>Boost Set</legend>
			<div id="boostSets">
				{boostRadios.map(({ id, label }) => (
					<div key={id}>
						<input
							checked={data.boost === id}
							id={id}
							name="boostSet"
							onChange={handleChange}
							type="radio"
							value={id}
						/>
						<label htmlFor={id}>{label}</label>
					</div>
				))}
			</div>
		</fieldset>
	);
};

export default function ContractBoostCalculator({ api }: { readonly api: string }) {
	const calc = Calculator.useCreateState();

	const boosts = useMemo(
		() =>
			({
				boost8: [Boost.LegendaryTach, Boost.EpicBeacon],
				boost6: [Boost.LegendaryTach, Boost.Beacon, Boost.Beacon],
				boost6s: [Boost.SupremeTach, Boost.Beacon, Boost.Beacon],
				boost5: [Boost.LegendaryTach, Boost.Beacon],
				boost5s: [Boost.SupremeTach, Boost.Beacon],
				boost4: [Boost.EpicTach, Boost.EpicTach],
				boost4s: [Boost.SupremeTach],
				boost2: [Boost.EpicTach],
			})[calc.data.boost] ?? [
				Boost.LargeTach,
				Boost.LargeTach,
				Boost.LargeTach,
				Boost.LargeTach,
				Boost.LargeTach,
			],
		[calc.data.boost],
	);

	const parseInts = useCallback(
		<T extends string[], U extends number[]>(ns: T): U =>
			ns.map((num) => Number.parseInt(num || '0', 10)) as U,
		[],
	);
	const lifeCounts: [number, number, number] = useMemo(
		() => parseInts([calc.data.lifeT2, calc.data.lifeT3, calc.data.lifeT4]),
		[parseInts, calc.data.lifeT2, calc.data.lifeT3, calc.data.lifeT4],
	);

	const diliCounts: [number, number, number] = useMemo(
		() => parseInts([calc.data.diliT2, calc.data.diliT3, calc.data.diliT4]),
		[parseInts, calc.data.diliT2, calc.data.diliT3, calc.data.diliT4],
	);

	const diliBonus = useMemo(
		() =>
			1.03 ** diliCounts[0] *
			1.06 ** diliCounts[1] *
			1.08 ** diliCounts[2] *
			(calc.data.doubleDuration ? 2 : 1),
		[diliCounts, calc.data.doubleDuration],
	);

	const lifeBonus = useMemo(
		() => 1.02 ** lifeCounts[0] * 1.03 ** lifeCounts[1] * 1.04 ** lifeCounts[2],
		[lifeCounts],
	);

	const maxHabSpace = useMemo(
		() => 11_340_000_000 * gussetMultiplier(calc.data.gusset ?? nullArtifact),
		[calc.data.gusset],
	);

	const ihcMult = useMemo(
		() => 1 + Number.parseInt(calc.data.hatcheryCalm || '0', 10) * 0.1,
		[calc.data.hatcheryCalm],
	);

	const [onlineChickens, timeToMaxHabs] = useMemo(() => {
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
				let mMult = 1;
				if (!(boost.name.includes('Beacon') && elapsed > 0)) {
					mMult = monocleMultiplier(calc.data.monocle ?? nullArtifact);
				}

				const ihr =
					Number.parseInt(calc.data.baseIhr || '0', 10) *
					1.01 ** Number.parseInt(calc.data.truthEggCount || '0', 10) *
					(1 + Number.parseInt(calc.data.colleggtibleIhr || '0', 10) / 100) *
					lifeBonus *
					Math.max(1, tachMult * Math.max(1, beaconMult)) *
					chaliceMultiplier(calc.data.chalice ?? nullArtifact) *
					mMult;
				const chickens = time * ihr * 4;
				if (timeToMaxHabs === 0 && maxHabSpace <= (population + chickens) * ihcMult) {
					const missing = maxHabSpace - population * ihcMult;
					const percentOfBoostUsed = missing / (chickens * ihcMult);
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

		const hr = Math.floor(timeToMaxHabs / 60);
		let min = Math.floor(timeToMaxHabs % 60);
		let sec = Math.round((timeToMaxHabs - min) * 60);

		if (sec === 60) {
			// If 60 seconds are left, add to minute instead

			min += 1;
			sec = 0;
		}

		const formattedTime = [
			hr > 0 ? hr + 'hr' : '',
			min > 0 ? min + 'min' : '',
			sec > 0 ? sec + 'sec' : '',
		]
			.filter(Boolean)
			.join(' ');
		return [Math.floor(population), formattedTime];
	}, [
		boosts,
		calc.data.baseIhr,
		calc.data.truthEggCount,
		calc.data.colleggtibleIhr,
		calc.data.chalice,
		diliBonus,
		lifeBonus,
		calc.data.monocle,
		maxHabSpace,
		ihcMult,
	]);

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

	const totalLifeStones = useMemo(() => lifeCounts.reduce((sum, each) => sum + each), [lifeCounts]);
	const totalDiliStones = useMemo(() => diliCounts.reduce((sum, each) => sum + each), [diliCounts]);

	const enableOutput = totalLifeStones <= 12 && totalDiliStones <= 12;

	// when any input in this section emits a `change` event, reset fetchState
	// back to idle and then remove the event listener. because the useEffect
	// has fetchState in the dependency list, when the button is clicked and
	// fetchState becomes something other than IDLE, the event listener gets
	// added (and then re-removed and re-added for every other state transition,
	// but that's okay & i think unavoidable with this approach)
	const listenerRef = useRef<HTMLElement>(null);
	// eslint-disable-next-line no-warning-comments
	// TODO: this section caused https://discord.com/channels/981390064644915251/1299574269872967752
	/*
	useEffect(() => {
		const el = listenerRef.current;
		if (!el) return;

		const resetFetchState = () => {
			calc.updateData({ fetchState: FetchState.IDLE });
			el.removeEventListener('change', resetFetchState);
		};

		if (calc.data.fetchState !== FetchState.IDLE) {
			el.addEventListener('change', resetFetchState);
		}

		return () => el.removeEventListener('change', resetFetchState);
	}, [listenerRef, calc, calc.data.fetchState]);
	*/

	// on reload, any active requests are canceled, so empty dependency array is on
	// purpose: only set idle unconditionally on FIRST load
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => calc.updateData({ fetchState: FetchState.IDLE }), []);

	const resetExtras = useCallback(
		() =>
			calc.updateData({
				doubleDuration: false,
				baseIhr: '7440',
				hatcheryCalm: '20',
				colleggtibleIhr: '5',
				truthEggCount: '0',
			}),
		[calc],
	);

	const canHideExtra =
		!calc.data.doubleDuration && calc.data.baseIhr === '7440' && calc.data.hatcheryCalm === '20';
	const [showExtra, toggleShowExtra, setShowExtra] = useToggleState(!canHideExtra);
	useEffect(() => {
		if (!canHideExtra && !showExtra) {
			setShowExtra(true);
		}
	}, [canHideExtra, showExtra, setShowExtra]);

	const eggFormat = (num: number) =>
		Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 3 }).format(num);

	return (
		<ApiUriContext.Provider value={api}>
			<Calculator.Context.Provider value={calc}>
				<section>
					<h1>Contract Boost Calculator</h1>
				</section>
				<section id="inputs" ref={listenerRef}>
					<section id="input-eid-artifacts">
						<Input datakey="eid" label="EID (Optional)" />
						<FetchCoopDataButton>Fetch account data</FetchCoopDataButton>
						<div className="spacer" />
						<ArtifactSelector kind="monocle" />
						<ArtifactSelector kind="chalice" />
						<ArtifactSelector kind="gusset" />
					</section>
					<section id="input-right">
						<fieldset className="stones">
							<legend>Life stones in IHR set:</legend>
							<div className="input-stones">
								<Input datakey="lifeT2" label="T2:" max="12" min="0" size={2} type="number" />
								<Input datakey="lifeT3" label="T3:" max="12" min="0" size={2} type="number" />
								<Input datakey="lifeT4" label="T4:" max="12" min="0" size={2} type="number" />
							</div>
							{totalLifeStones > 12 && (
								<div className="error">
									More stones ({totalLifeStones}) than max possible slots (12)!
								</div>
							)}
						</fieldset>
						<fieldset className="stones">
							<legend>Dilithium stones in dili set:</legend>
							<div className="input-stones">
								<Input datakey="diliT2" label="T2:" max="12" min="0" size={2} type="number" />
								<Input datakey="diliT3" label="T3:" max="12" min="0" size={2} type="number" />
								<Input datakey="diliT4" label="T4:" max="12" min="0" size={2} type="number" />
							</div>
							{totalDiliStones > 12 && (
								<div className="error">
									More stones ({totalDiliStones}) than max possible slots (12)!
								</div>
							)}
						</fieldset>
						<div>
							<button
								disabled={showExtra && !canHideExtra}
								id="show-extra"
								onClick={toggleShowExtra}
							>
								{showExtra ? '- Hide' : '+ Show'} bonus inputs
							</button>
							{showExtra && !canHideExtra && <div>Reset bonus inputs to default to hide</div>}
						</div>
					</section>
					{showExtra && (
						<fieldset id="extra-inputs">
							<legend>Bonus inputs</legend>
							<Calculator.Checkbox datakey="doubleDuration" label="2× boost duration modifier?" />
							<div>
								<Input datakey="baseIhr" label="IHR:" max="7440" min="0" size={4} type="number" />
								<span>(Menu → Stats → Int. Hatchery Rate)</span>
							</div>
							<div>
								<Input
									datakey="hatcheryCalm"
									label="IHC:"
									max="20"
									min="0"
									size={4}
									type="number"
								/>
								<span>(Research → Epic → Internal Hatchery Calm)</span>
							</div>
							<div>
								<Input datakey="colleggtibleIhr" label="CIHR:" max="5" min="0" type="number" />
								<span>(Current egg → Contracts → Colleggtibles → Easter)</span>
							</div>
							<div>
								<Input
									datakey="truthEggCount"
									label="TE:"
									max="430"
									min="0"
									size={4}
									type="number"
								/>
								<span>(Menu → Prestige → TE Count)</span>
							</div>
							<button onClick={resetExtras}>Reset bonus inputs to default</button>
						</fieldset>
					)}
				</section>
				<hr />
				<BoostPresetButtons />
				<hr />
				{enableOutput && (
					<section id="output">
						<Output label="Boosts">
							{boosts.map((boost: Boost, id: number) => (
								<Boost.Image boost={boost} key={id} />
							))}
						</Output>
						<Output label="First boost runs out after" value={boostDuration} />
						<Output label="GE cost (buying in 5s)" value={boostCost.toLocaleString()} />
						<Output label="Population (online)" value={eggFormat(onlineChickens)} />
						<Output label="Population (offline)" value={eggFormat(onlineChickens * ihcMult)} />
						<Output label="Max hab space" value={eggFormat(maxHabSpace)} />
						<Output label="Time to fill habs" value={timeToMaxHabs || '∞'} />
					</section>
				)}
			</Calculator.Context.Provider>
		</ApiUriContext.Provider>
	);
}
