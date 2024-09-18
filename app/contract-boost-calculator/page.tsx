'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useEffect, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import CustomTextInput, {
	CustomNumberInput,
	CustomSelectInput,
} from '../../components/CustomInput';
import {
	artifactRarityOptions,
	BASE_MAX_HAB_SPACE,
	boostSetPresets,
	chaliceOptions,
	formInitialState,
	gussetOptions,
	monocleOptions,
	stonesCountOptions,
} from './constants';
import styles from './styles.module.css';

export default function ContractBoostCalculator() {
	const [formState, setFormState] = useState(() => {
		const savedFormState = typeof window === 'undefined' ? null : localStorage.getItem('formState');
		return savedFormState ? JSON.parse(savedFormState) : formInitialState;
	});

	const [equippedArtifactsByIGN, setEquippedArtifactsByIGN] = useState([]);
	const [equippedArtifactsListForSelectedIGN, setEquippedArtifactsListForSelectedIGN] = useState(
		{} as any,
	);

	const [selectedBoostPreset, setSelectedBoostPreset] = useState('1');
	const [availableIGNOptions, setAvailableIGNOptions] = useState([
		{ text: 'Select an option', value: '' },
	]);

	const getEquippedArtifactById = useCallback(
		(artifactId: number) => {
			const artifactData = equippedArtifactsListForSelectedIGN?.equippedArtifactsList?.find(
				(artifact: any) => {
					// console.log('artifact', artifact);
					return artifact.spec.name === artifactId;
				},
			);
			// console.log('artifactData', artifactData);

			return artifactData
				? 'T' + (artifactData.spec.level + 1) + artifactRarityOptions[artifactData?.spec?.rarity]
				: '';
		},
		[equippedArtifactsListForSelectedIGN],
	);

	useEffect(() => {
		// Set the page title on initial load
		// This is a workaround for the fact that we can't use metadata in client components
		const document = typeof window === 'undefined' ? null : window.document;
		if (document) {
			document.title = 'Contract Boost Calculator | Majeggstics';
		}
	}, []);

	useEffect(() => {
		// console.log('formState changed', { formState });
		localStorage.setItem('formState', JSON.stringify(formState));
	}, [formState]);

	useEffect(() => {
		setEquippedArtifactsListForSelectedIGN(
			// because equippedArtifactsByIGN is not typed, it will throw some crap
			// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
			equippedArtifactsByIGN.find((contributor: any) => contributor.userName === formState.IGN),
		);
	}, [equippedArtifactsByIGN, formState.IGN]);

	useEffect(() => {
		// because equippedArtifactsByIGN is not typed, it will throw some crap
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		const selectedIGN = equippedArtifactsByIGN.find(
			(contributor: any) => contributor.isSelectedIGN,
		);
		// console.log('selectedIGN', selectedIGN);
		if (selectedIGN) {
			setFormState((prevState: any) => ({
				...prevState,
				IGN: (selectedIGN as { userName: string }).userName,
			}));
		}
	}, [equippedArtifactsByIGN]);

	useEffect(() => {
		// <p>Monocle: {getEquippedArtifactById(28)}</p>
		//         <p>Chalice: {getEquippedArtifactById(9)}</p>
		//         <p>Gusset: {getEquippedArtifactById(8)}</p>
		const monocleText = getEquippedArtifactById(28);
		const monocleOptionValue = monocleOptions.find((option) => option.text === monocleText)?.value;

		const chaliceText = getEquippedArtifactById(9);
		const chaliceOptionValue = chaliceOptions.find((option) => option.text === chaliceText)?.value;

		const gussetText = getEquippedArtifactById(8);
		const gussetOptionValue = gussetOptions.find((option) => option.text === gussetText)?.value;

		const stonesList = equippedArtifactsListForSelectedIGN?.equippedArtifactsList
			?.map((artifact: any) => artifact.stonesList)
			.flat();
		// console.log('stonesList', stonesList);

		// Life stone is 38
		const t2LifeStonesCount = stonesList?.filter(
			(stone: any) => stone.name === 38 && stone.level === 0,
		).length;
		const t3LifeStonesCount = stonesList?.filter(
			(stone: any) => stone.name === 38 && stone.level === 1,
		).length;
		const t4LifeStonesCount = stonesList?.filter(
			(stone: any) => stone.name === 38 && stone.level === 2,
		).length;

		setFormState((prevState: any) => ({
			...prevState,
			// update the form state with the equipped artifacts only if they come back from the API
			monocle: monocleOptionValue ? monocleOptionValue : prevState.monocle,
			chalice: chaliceOptionValue ? chaliceOptionValue : prevState.chalice,
			gusset: gussetOptionValue ? gussetOptionValue : prevState.gusset,
			t2LifeStonesCount: t2LifeStonesCount ? t2LifeStonesCount : prevState.t2LifeStonesCount,
			t3LifeStonesCount: t3LifeStonesCount ? t3LifeStonesCount : prevState.t3LifeStonesCount,
			t4LifeStonesCount: t4LifeStonesCount ? t4LifeStonesCount : prevState.t4LifeStonesCount,
		}));
	}, [equippedArtifactsListForSelectedIGN, getEquippedArtifactById]);

	const improvedIhr =
		formState.ihr *
		formState.chalice *
		formState.tachPrismMultiplier *
		formState.boostBeaconMultiplier *
		(1.02 ** formState.t2LifeStonesCount *
			1.03 ** formState.t3LifeStonesCount *
			1.04 ** formState.t4LifeStonesCount);

	const improvedBoostTime =
		formState.baseBoostTime *
		formState.boostEventDurationMultiplier *
		(1.03 ** formState.t2DiliStonesCount *
			1.06 ** formState.t3DiliStonesCount *
			1.08 ** formState.t4DiliStonesCount);

	const population = improvedIhr * improvedBoostTime * formState.monocle * 3 * 4;

	const habSpace = BASE_MAX_HAB_SPACE * formState.gusset;

	const timeToMaxHabsInSeconds = (habSpace / population) * improvedBoostTime * 60;

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		// console.log('handleChange', { name, value });

		setFormState((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	}

	function handleBoostPresetClick(presetId: string) {
		const preset = boostSetPresets.find((preset) => preset.id === presetId);
		// console.log('handleBoostPresetClick', { presetId }, preset);

		if (preset) {
			setFormState((prevState: any) => ({
				...prevState,
				tachPrismMultiplier: preset.tachPrismMultiplier,
				boostBeaconMultiplier: preset.boostBeaconMultiplier,
				baseBoostTime: preset.baseBoostTime,
			}));
			setSelectedBoostPreset(presetId);
		}

		setTimeout(() => {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
		}, 500);
	}

	async function handleGetCoopDataClick() {
		// console.log('handleGetCoopDataClick');
		const coopData = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/coopData?EID=${formState.EID}&contract=${formState.contract}&coop=${formState.coop}`,
		).then(async (res) => res.json());
		// console.log('coopData', coopData);
		setEquippedArtifactsByIGN(coopData);

		const availableIGNOptionsData = coopData.map((contributor: any) => ({
			value: contributor.userName,
			text: contributor.userName,
		}));
		// console.log('availableIGNs', availableIGNOptionsData);
		setAvailableIGNOptions([{ text: 'Select an option', value: '' }, ...availableIGNOptionsData]);
	}

	return (
		<Tooltip.Provider delayDuration={10}>
			<main className={styles.main}>
				<section>
					<h1>Contract Boost Calculator</h1>
					<h2>Calculates the number of chickens for a boost set. Assumes max ER.</h2>
				</section>
				<section>
					<h3>Inputs</h3>
					<div>
						<div className={styles.inputContainer}>
							<label htmlFor="EID">EID (Optional)</label>
							<CustomTextInput
								name="EID"
								value={formState.EID}
								handleChange={(event: ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
							/>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor="contract">Contract code</label>
							<CustomTextInput
								name="contract"
								value={formState.contract}
								handleChange={(event: ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
							/>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor="coop">Coop code</label>
							<CustomTextInput
								name="coop"
								value={formState.coop}
								handleChange={(event: ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
							/>
						</div>

						<div>
							<button
								className={`${styles.boostBtn} ${true ? styles.activeBoostBtn : ''}`}
								onClick={async () => handleGetCoopDataClick()}
							>
								Get coop Data
							</button>
						</div>
					</div>

					<div className={styles.inputContainer} style={{ marginTop: '2rem' }}>
						<label htmlFor="coop">
							Select your IGN (Automatically selected if you entered your EID)
						</label>
						<CustomSelectInput
							name="IGN"
							options={availableIGNOptions}
							value={formState.IGN}
							handleChange={handleChange}
						/>
					</div>

					{/* {formState.IGN ? (*/}
					<div>
						<h4>Equipped artifacts for {formState.IGN}</h4>
						<p>Monocle: {getEquippedArtifactById(28)}</p>
						<p>Chalice: {getEquippedArtifactById(9)}</p>
						<p>Gusset: {getEquippedArtifactById(8)}</p>
					</div>
					{/* ) : null} */}

					<h4>Boost Set Presets</h4>
					<div className={styles.boostBtnContainer}>
						{boostSetPresets.map((preset) => (
							<button
								key={preset.id}
								className={`${styles.boostBtn} ${preset.id === selectedBoostPreset ? styles.activeBoostBtn : ''}`}
								title={preset.description}
								onClick={() => handleBoostPresetClick(preset.id)}
							>
								{preset.name}
							</button>
						))}
					</div>
					<div className={styles.boostAndArtifactInputsContainer}>
						<div>
							<Accordion.Root type="single" collapsible>
								<Accordion.Item value="CustomInputs">
									<Accordion.Header>
										<Accordion.Trigger className={styles.AccordionTrigger}>
											Custom Inputs
											<ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Content className={styles.AccordionContent}>
										<div className={styles.inputContainer}>
											<label htmlFor="tachPrismMultiplier">
												Tachyon Prism Multiplier (Multiple of these will stack additively)
											</label>
											<CustomNumberInput
												name="tachPrismMultiplier"
												value={formState.tachPrismMultiplier}
												handleChange={(event: ChangeEvent<HTMLInputElement>) => {
													handleChange(event);
													setSelectedBoostPreset('');
												}}
											/>
										</div>
										<div className={styles.inputContainer}>
											<label htmlFor="boostBeaconMultiplier">
												Boost Beacon Multiplier (Multiple of these will stack additively)
											</label>
											<CustomNumberInput
												name="boostBeaconMultiplier"
												value={formState.boostBeaconMultiplier}
												handleChange={(event: ChangeEvent<HTMLInputElement>) => {
													handleChange(event);
													setSelectedBoostPreset('');
												}}
											/>
										</div>
										<div className={styles.inputContainer}>
											<label htmlFor="baseBoostTime">Base Boost Time (minutes)</label>
											<CustomNumberInput
												name="baseBoostTime"
												value={formState.baseBoostTime}
												handleChange={(event: ChangeEvent<HTMLInputElement>) => {
													handleChange(event);
													setSelectedBoostPreset('');
												}}
											/>
										</div>
										<div className={styles.inputContainer}>
											<label htmlFor="boostEventDurationMultiplier">
												Boost Event Duration Multiplier
											</label>
											<CustomNumberInput
												name="boostEventDurationMultiplier"
												value={formState.boostEventDurationMultiplier}
												handleChange={handleChange}
											/>
										</div>
										<div className={styles.inputContainer}>
											<label htmlFor="ihr">IHR (You probably don&apos;t need to change this)</label>
											<CustomNumberInput
												name="ihr"
												value={formState.ihr}
												handleChange={handleChange}
											/>
										</div>
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor="monocle">Monocle</label>
							<CustomSelectInput
								name="monocle"
								options={monocleOptions}
								value={formState.monocle}
								handleChange={handleChange}
							/>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor="chalice">Chalice</label>
							<CustomSelectInput
								name="chalice"
								options={chaliceOptions}
								value={formState.chalice}
								handleChange={handleChange}
							/>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor="gusset">Gusset</label>
							<CustomSelectInput
								name="gusset"
								options={gussetOptions}
								value={formState.gusset}
								handleChange={handleChange}
							/>
						</div>
					</div>
					<div className={styles.stonesInputsContainer}>
						<div>
							<p>Enter the no. of each type of life stones equipped</p>
							<div>
								<label htmlFor="t2LifeStonesCount">T2</label>
								<CustomSelectInput
									name="t2LifeStonesCount"
									value={formState.t2LifeStonesCount}
									handleChange={handleChange}
									options={stonesCountOptions}
								/>
								<label htmlFor="t3LifeStonesCount">T3</label>
								<CustomSelectInput
									name="t3LifeStonesCount"
									value={formState.t3LifeStonesCount}
									handleChange={handleChange}
									options={stonesCountOptions}
								/>
								<label htmlFor="t4LifeStonesCount">T4</label>
								<CustomSelectInput
									name="t4LifeStonesCount"
									value={formState.t4LifeStonesCount}
									handleChange={handleChange}
									options={stonesCountOptions}
								/>
							</div>
						</div>
						<div>
							<p>Enter the no. of each type of dilithium stones equipped</p>
							<div>
								<label htmlFor="t2DiliStonesCount">T2</label>
								<CustomSelectInput
									name="t2DiliStonesCount"
									value={formState.t2DiliStonesCount}
									handleChange={handleChange}
									options={stonesCountOptions}
								/>
								<label htmlFor="t3DiliStonesCount">T3</label>
								<CustomSelectInput
									name="t3DiliStonesCount"
									value={formState.t3DiliStonesCount}
									handleChange={handleChange}
									options={stonesCountOptions}
								/>
								<label htmlFor="t4DiliStonesCount">T4</label>
								<CustomSelectInput
									name="t4DiliStonesCount"
									value={formState.t4DiliStonesCount}
									handleChange={handleChange}
									options={stonesCountOptions}
								/>
							</div>
						</div>
					</div>
				</section>
				<section>
					<h3>Results</h3>
					<div>
						{/* Improved IHR is incorrect */}
						{/* <p>Improved IHR: {Math.round(improvedIhr)?.toLocaleString()} Min/Hab</p> */}
						<p>
							Selected boost preset:{' '}
							{selectedBoostPreset
								? boostSetPresets.find((preset) => preset.id === selectedBoostPreset)?.description
								: 'You are using a custom boost setup'}
						</p>
						<p>
							Improved Tachyon boost time: {Math.floor(improvedBoostTime)} mins{' '}
							{Math.floor((improvedBoostTime * 60) % 60)} seconds{' '}
						</p>
						<p>
							Golden Egg cost (buying singles):{' '}
							{selectedBoostPreset
								? boostSetPresets.find((preset) => preset.id === selectedBoostPreset)?.baseGeCost
								: 'You are using a custom boost setup'}{' '}
						</p>
						<p>
							Golden Egg cost (buying in 5s):{' '}
							{selectedBoostPreset
								? boostSetPresets.find((preset) => preset.id === selectedBoostPreset)
										?.discountGeCost
								: 'You are using a custom boost setup'}{' '}
						</p>
						<p>Population (online): {Math.round(population / 3)?.toLocaleString()} chickens</p>
						<p>Population (offline): {Math.round(population)?.toLocaleString()} chickens</p>
						<p>Max hab space: {Math.round(habSpace)?.toLocaleString()}</p>
						<p>Maxed habs? {population > habSpace ? 'Yes ✔' : 'No ❌'}</p>
						{population > habSpace ? (
							<p>
								<b>Time to max. habs: </b>
								{`${Math.floor(timeToMaxHabsInSeconds / 60)} mins ${Math.floor(timeToMaxHabsInSeconds % 60)} seconds`}
							</p>
						) : null}
					</div>
				</section>
				<section className={styles.footerSection}>
					<p>
						Heavily inspired by{' '}
						<a href="https://hashtru.netlify.app/contractboost" target="_blank">
							hashtru&apos;s Contract Boost Calculator
						</a>
					</p>
				</section>
			</main>
		</Tooltip.Provider>
	);
}
