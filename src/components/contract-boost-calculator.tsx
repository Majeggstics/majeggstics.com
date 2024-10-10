import { useCallback, createContext, useContext, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import type { Artifact, ArtifactIntensity, Stone } from '/lib/ei_data';
import {
	artifactRarity,
	ArtifactSpec,
	PossibleArtifactIntensity,
	chaliceMultiplier,
	monocleMultiplier,
	gussetMultiplier,
} from '/lib/ei_data';
import { Boost } from '/components/Boosts';
import { generateCalculator, type WithSetter } from '/components/calculator.tsx';

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

const Calculator = generateCalculator<CalcData>(defaultCalcData());
const { Input, Output } = Calculator;

type FetchCoopDataProps = { readonly children: React.ReactNode };
const FetchCoopDataButton = ({ children }: FetchCoopDataProps) => {
	const apiUri = useContext(ApiUriContext);
	const { data, updateData } = useContext<WithSetter<CalcData>>(Calculator.Context);

	const fetchCoopData = useCallback(async () => {
		const rawEIResponse: EIBackupResponse = await fetch(`${apiUri}/backup?EID=${data.eid}`).then(
			async (res) => res.json(),
		);

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

		updateData({
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
		});
	}, [data.eid, apiUri, updateData]);

	return <button onClick={fetchCoopData}>{children}</button>;
};

type ArtifactSelectorProps = {
	readonly kind: 'monocle' | 'gusset' | 'chalice';
};
const ArtifactSelector = ({ kind }: ArtifactSelectorProps) => {
	const { data, updateData } = useContext<WithSetter<CalcData>>(Calculator.Context);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const [level, rarity] = event.target.value.split('-').map((val) => Number.parseInt(val, 10));
			updateData({
				[kind]: {
					level,
					rarity,
				},
			});
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
	{ id: 'boost5', label: '5-token (Benson Supreme)' },
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

	return (
		<fieldset id="boostSets">
			<legend>Boost Set</legend>
			{boostRadios.map(({ id, label }) => (
				<div key={id}>
					<input
						type="radio"
						name="boostSet"
						id={id}
						value={id}
						checked={data.boost === id}
						onChange={handleChange}
					/>
					<label htmlFor={id}>{label}</label>
				</div>
			))}
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

	const diliBonus = useMemo(
		() => 1.03 ** calc.data.diliT2 * 1.06 ** calc.data.diliT3 * 1.08 ** calc.data.diliT4,
		[calc.data.diliT2, calc.data.diliT3, calc.data.diliT4],
	);

	const lifeBonus = useMemo(
		() => 1.02 ** calc.data.lifeT2 * 1.03 ** calc.data.lifeT3 * 1.04 ** calc.data.lifeT4,
		[calc.data.lifeT2, calc.data.lifeT3, calc.data.lifeT4],
	);

	const maxHabSpace = useMemo(
		() => 11_340_000_000 * gussetMultiplier(calc.data.gusset ?? { level: 0, rarity: 0 }),
		[calc.data.gusset],
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
					chaliceMultiplier(calc.data.chalice ?? { level: 0, rarity: 0 }) *
					monocleMultiplier(calc.data.monocle ?? { level: 0, rarity: 0 });

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
	}, [boosts, calc.data.chalice, diliBonus, lifeBonus, calc.data.monocle, maxHabSpace]);

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
			<Calculator.Context.Provider value={calc}>
				<section>
					<h1>Contract Boost Calculator</h1>
					<h2>Calculates the number of chickens for a boost set. Assumes max ER.</h2>
				</section>
				<section id="inputs">
					<section id="input-eid-artifacts">
						<Input datakey="eid" label="EID (Optional)" />
						<FetchCoopDataButton>Fetch account data</FetchCoopDataButton>
						<div className="spacer" />
						<ArtifactSelector kind="monocle" />
						<ArtifactSelector kind="chalice" />
						<ArtifactSelector kind="gusset" />
					</section>
					<section id="input-stones">
						<fieldset>
							<legend>Life stones in IHR set:</legend>
							<Input datakey="lifeT2" label="T2:" max="12" min="0" size={2} type="number" />
							<Input datakey="lifeT3" label="T3:" max="12" min="0" size={2} type="number" />
							<Input datakey="lifeT4" label="T4:" max="12" min="0" size={2} type="number" />
						</fieldset>
						<fieldset>
							<legend>Dilithium stones in dili set:</legend>
							<Input datakey="diliT2" label="T2:" max="12" min="0" size={2} type="number" />
							<Input datakey="diliT3" label="T3:" max="12" min="0" size={2} type="number" />
							<Input datakey="diliT4" label="T4:" max="12" min="0" size={2} type="number" />
						</fieldset>
					</section>
				</section>
				<hr />
				<BoostPresetButtons />
				<hr />
				<section id="output">
					<Output label="Boosts">
						{boosts.map((boost: Boost, id: number) => (
							<Boost.Image key={id} boost={boost} />
						))}
					</Output>
					<Output label="First boost runs out after" value={boostDuration} />
					<Output label="GE cost (buying in 5s)" value={boostCost.toLocaleString()} />
					<Output label="Population (online)" value={onlineChickens.toLocaleString()} />
					<Output label="Population (offline)" value={(onlineChickens * 3).toLocaleString()} />
					<Output label="Max hab space" value={maxHabSpace.toLocaleString()} />
					<Output label="Time to fill habs" value={timeToMaxHabs || '∞'} />
				</section>
			</Calculator.Context.Provider>
		</ApiUriContext.Provider>
	);
}
