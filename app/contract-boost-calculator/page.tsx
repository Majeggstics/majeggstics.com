"use client";

import { ChangeEvent, useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import CustomTextInput, { CustomNumberInput, CustomSelectInput } from '../../components/CustomInput';

import styles from './styles.module.css';

export default function ContractBoostCalculator() {
  const [formState, setFormState] = useState(() => {
    const savedFormState = typeof window !== 'undefined' ? localStorage.getItem('formState') : null;
    return savedFormState ? JSON.parse(savedFormState) : formInitialState;
  });

  const [equippedArtifactsByIGN, setEquippedArtifactsByIGN] = useState([]);
  const [equippedArtifactsListForSelectedIGN, setEquippedArtifactsListForSelectedIGN] = useState({} as any);

  const [selectedBoostPreset, setSelectedBoostPreset] = useState('1');
  const [availableIGNOptions, setAvailableIGNOptions] = useState([{ text: 'Select an option', value: '' }]);

  useEffect(() => {
    // Set the page title on initial load
    // This is a workaround for the fact that we can't use metadata in client components
    const document = typeof window !== 'undefined' ? window.document : null;
    if (document) {
      document.title = 'Contract Boost Calculator | Majeggstics';
    }
  }, []);

  useEffect(() => {
    // console.log('formState changed', { formState });
    localStorage.setItem('formState', JSON.stringify(formState));
  }, [formState]);

  useEffect(() => {
    setEquippedArtifactsListForSelectedIGN(equippedArtifactsByIGN.find((contributor: any) => contributor.userName === formState.IGN));
  }, [equippedArtifactsByIGN, formState.IGN]);

  useEffect(() => {
    const selectedIGN = equippedArtifactsByIGN.find((contributor: any) => contributor.isSelectedIGN);
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

    const stonesList = equippedArtifactsListForSelectedIGN?.equippedArtifactsList?.map((artifact: any) => artifact.stonesList).flat();
    // console.log('stonesList', stonesList);

    // Life stone is 38
    const t2LifeStonesCount = stonesList?.filter((stone: any) => stone.name === 38 && stone.level === 0).length;
    const t3LifeStonesCount = stonesList?.filter((stone: any) => stone.name === 38 && stone.level === 1).length;
    const t4LifeStonesCount = stonesList?.filter((stone: any) => stone.name === 38 && stone.level === 2).length;

    setFormState((prevState: any) => ({
      ...prevState,
      // update the form state with the equipped artifacts only if they come back from the API
      monocle: monocleOptionValue ? monocleOptionValue : prevState.monocle,
      chalice: chaliceOptionValue ? chaliceOptionValue : prevState.chalice,
      gusset: gussetOptionValue ? gussetOptionValue : prevState.gusset,
      t2LifeStonesCount: t2LifeStonesCount ? t2LifeStonesCount : prevState.t2LifeStonesCount,
      t3LifeStonesCount: t3LifeStonesCount ? t3LifeStonesCount : prevState.t2LifeStonesCount,
      t4LifeStonesCount: t4LifeStonesCount ? t4LifeStonesCount : prevState.t2LifeStonesCount,
    }));
  }, [equippedArtifactsListForSelectedIGN]);

  const improvedIhr = formState.ihr * formState.chalice * formState.tachPrismMultiplier * formState.boostBeaconMultiplier * (Math.pow(1.02, formState.t2LifeStonesCount) * Math.pow(1.03, formState.t3LifeStonesCount) * Math.pow(1.04, formState.t4LifeStonesCount));

  const improvedBoostTime = formState.baseBoostTime * formState.boostEventDurationMultiplier * ((Math.pow(1.03, formState.t2DiliStonesCount) * Math.pow(1.06, formState.t3DiliStonesCount) * Math.pow(1.08, formState.t4DiliStonesCount)));

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
    const coopData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coopData?EID=${formState.EID}&contract=${formState.contract}&coop=${formState.coop}`).then((res) => res.json());
    // console.log('coopData', coopData);
    setEquippedArtifactsByIGN(coopData);

    const availableIGNOptionsData = coopData.map((contributor: any) => ({ value: contributor.userName, text: contributor.userName }));
    // console.log('availableIGNs', availableIGNOptionsData);
    setAvailableIGNOptions([{ text: 'Select an option', value: '' }, ...availableIGNOptionsData]);
  }

  function getEquippedArtifactById(artifactId: number) {
    const artifactData = equippedArtifactsListForSelectedIGN?.equippedArtifactsList?.find((artifact: any) => {
      // console.log('artifact', artifact);
      return artifact.spec.name === artifactId
    });
    // console.log('artifactData', artifactData);

    const artifactAsText = artifactData ? "T" + (artifactData.spec.level + 1) + artifactRarityOptions[artifactData?.spec?.rarity] : '';

    return artifactAsText;
  }

  return (
    <Tooltip.Provider delayDuration={10}>
      <main className={styles.main}>
        <section>
          <h1>
            Contract Boost Calculator
          </h1>
          <h2>
            Calculates the number of chickens for a boost set. Assumes max ER.
          </h2>
        </section>
        <section>
          <h3>
            Inputs
          </h3>
          <div>
            <div className={styles.inputContainer}>
              <label htmlFor="EID">
                EID (Optional)
              </label>
              <CustomTextInput name='EID' value={formState.EID} handleChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event);
              }} />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="contract">
                Contract code
              </label>
              <CustomTextInput name='contract' value={formState.contract} handleChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event);
              }} /></div>
            <div className={styles.inputContainer}>
              <label htmlFor="coop">
                Coop code
              </label>
              <CustomTextInput name='coop' value={formState.coop} handleChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event);
              }} />
            </div>

            <div>
              <button className={`${styles.boostBtn} ${true ? styles.activeBoostBtn : ''}`} onClick={() => handleGetCoopDataClick()}>Get coop Data</button>
            </div>
          </div>

          <div className={styles.inputContainer} style={{ marginTop: '2rem' }}>
            <label htmlFor="coop">
              Select your IGN (Automatically selected if you entered your EID)
            </label>
            <CustomSelectInput name='IGN' options={availableIGNOptions} value={formState.IGN} handleChange={handleChange} />
          </div>

          {/* {formState.IGN ? (*/}
          <div>
            <h4>Equipped artifacts for {formState.IGN}</h4>
            <p>Monocle: {getEquippedArtifactById(28)}</p>
            <p>Chalice: {getEquippedArtifactById(9)}</p>
            <p>Gusset: {getEquippedArtifactById(8)}</p>
          </div>
          {/*) : null} */}

          <h4>Boost Set Presets</h4>
          <div className={styles.boostBtnContainer}>
            {boostSetPresets.map((preset) => (
              <button key={preset.id} className={`${styles.boostBtn} ${preset.id === selectedBoostPreset ? styles.activeBoostBtn : ''}`} title={preset.description} onClick={() => handleBoostPresetClick(preset.id)}>{preset.name}</button>
            ))}
          </div>
          <div className={styles.boostAndArtifactInputsContainer}>
            <div>
              <Accordion.Root type='single' collapsible>
                <Accordion.Item value='CustomInputs'>
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
                      <CustomNumberInput name='tachPrismMultiplier' value={formState.tachPrismMultiplier} handleChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleChange(event);
                        setSelectedBoostPreset('');
                      }} />
                    </div>
                    <div className={styles.inputContainer}>
                      <label htmlFor="boostBeaconMultiplier">
                        Boost Beacon Multiplier (Multiple of these will stack additively)
                      </label>
                      <CustomNumberInput name='boostBeaconMultiplier' value={formState.boostBeaconMultiplier} handleChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleChange(event);
                        setSelectedBoostPreset('');
                      }} />
                    </div>
                    <div className={styles.inputContainer}>
                      <label htmlFor="baseBoostTime">
                        Base Boost Time (minutes)
                      </label>
                      <CustomNumberInput name='baseBoostTime' value={formState.baseBoostTime} handleChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleChange(event);
                        setSelectedBoostPreset('');
                      }} />
                    </div>
                    <div className={styles.inputContainer}>
                      <label htmlFor="boostEventDurationMultiplier">
                        Boost Event Duration Multiplier
                      </label>
                      <CustomNumberInput name='boostEventDurationMultiplier' value={formState.boostEventDurationMultiplier} handleChange={handleChange} />
                    </div>
                    <div className={styles.inputContainer}>
                      <label htmlFor="ihr">
                        IHR (You probably don&apos;t need to change this)
                      </label>
                      <CustomNumberInput name='ihr' value={formState.ihr} handleChange={handleChange} />
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="monocle">
                Monocle
              </label>
              <CustomSelectInput name='monocle' options={monocleOptions} value={formState.monocle} handleChange={handleChange} />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="chalice">
                Chalice
              </label>
              <CustomSelectInput name='chalice' options={chaliceOptions} value={formState.chalice} handleChange={handleChange} />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="gusset">
                Gusset
              </label>
              <CustomSelectInput name='gusset' options={gussetOptions} value={formState.gusset} handleChange={handleChange} />
            </div>
          </div>
          <div className={styles.stonesInputsContainer}>
            <div>
              <p>Enter the no. of each type of life stones equipped</p>
              <div>
                <label htmlFor="t2LifeStonesCount">
                  T2
                </label>
                <CustomSelectInput name='t2LifeStonesCount' value={formState.t2LifeStonesCount} handleChange={handleChange} options={stonesCountOptions} />
                <label htmlFor="t3LifeStonesCount">
                  T3
                </label>
                <CustomSelectInput name='t3LifeStonesCount' value={formState.t3LifeStonesCount} handleChange={handleChange} options={stonesCountOptions} />
                <label htmlFor="t4LifeStonesCount">
                  T4
                </label>
                <CustomSelectInput name='t4LifeStonesCount' value={formState.t4LifeStonesCount} handleChange={handleChange} options={stonesCountOptions} />
              </div>
            </div>
            <div>
              <p>Enter the no. of each type of dilithium stones equipped</p>
              <div>
                <label htmlFor="t2DiliStonesCount">
                  T2
                </label>
                <CustomSelectInput name='t2DiliStonesCount' value={formState.t2DiliStonesCount} handleChange={handleChange} options={stonesCountOptions} />
                <label htmlFor="t3DiliStonesCount">
                  T3
                </label>
                <CustomSelectInput name='t3DiliStonesCount' value={formState.t3DiliStonesCount} handleChange={handleChange} options={stonesCountOptions} />
                <label htmlFor="t4DiliStonesCount">
                  T4
                </label>
                <CustomSelectInput name='t4DiliStonesCount' value={formState.t4DiliStonesCount} handleChange={handleChange} options={stonesCountOptions} />
              </div>
            </div>
          </div>
        </section>
        <section>
          <h3>Results</h3>
          <div>
            {/* Improved IHR is incorrect */}
            {/* <p>Improved IHR: {Math.round(improvedIhr)?.toLocaleString()} Min/Hab</p> */}
            <p>Selected boost preset: {selectedBoostPreset ? boostSetPresets.find((preset) => preset.id === selectedBoostPreset)?.description : 'You are using a custom boost setup'}</p>
            <p>Improved Tachyon boost time: {Math.floor(improvedBoostTime)} mins {Math.floor(improvedBoostTime * 60 % 60)} seconds </p>
            <p>Golden Egg cost (buying singles): {selectedBoostPreset ? boostSetPresets.find((preset) => preset.id === selectedBoostPreset)?.baseGeCost : 'You are using a custom boost setup'} </p>
            <p>Golden Egg cost (buying in 5s): {selectedBoostPreset ? boostSetPresets.find((preset) => preset.id === selectedBoostPreset)?.discountGeCost : 'You are using a custom boost setup'} </p>
            <p>Population (online): {(Math.round(population / 3))?.toLocaleString()} chickens</p>
            <p>Population (offline): {Math.round(population)?.toLocaleString()} chickens</p>
            <p>Max hab space: {Math.round(habSpace)?.toLocaleString()}</p>
            <p>Maxed habs? {population > habSpace ? 'Yes ✔' : 'No ❌'}</p>
            {population > habSpace ? <p><b>Time to max. habs: </b>{`${Math.floor(timeToMaxHabsInSeconds / 60)} mins ${Math.floor(timeToMaxHabsInSeconds % 60)} seconds`}</p> : null}
          </div>
        </section>
        <section className={styles.footerSection}>
          <p>Heavily inspired by <a href="https://hashtru.netlify.app/contractboost" target="_blank">hashtru&apos;s Contract Boost Calculator</a></p>
        </section>
      </main>
    </Tooltip.Provider>
  )
}

const BASE_MAX_HAB_SPACE = 11340000000;


const monocleOptions = [
  {
    value: 1,
    text: "None",
  },
  {
    value: 1.05,
    text: "T1",
  },
  {
    value: 1.10,
    text: "T2",
  },
  {
    value: 1.15,
    text: "T3",
  },
  {
    value: 1.20,
    text: "T4",
  },
  {
    value: 1.25,
    text: "T4E",
  },
  {
    value: 1.30,
    text: "T4L",
  },
];

const chaliceOptions = [
  {
    value: 1,
    text: "None",
  },
  {
    value: 1.05,
    text: "T1",
  },
  {
    value: 1.10,
    text: "T2",
  },
  {
    value: 1.15,
    text: "T2E",
  },
  {
    value: 1.20,
    text: "T3",
  },
  {
    value: 1.23,
    text: "T3R",
  },
  {
    value: 1.25,
    text: "T3E",
  },
  {
    value: 1.30,
    text: "T4",
  },
  {
    value: 1.35,
    text: "T4E",
  },
  {
    value: 1.40,
    text: "T4L",
  },
];

const gussetOptions = [
  {
    value: 1,
    text: "None",
  },
  {
    value: 1.05,
    text: "T1",
  },
  {
    value: 1.10,
    text: "T2",
  },
  {
    value: 1.12,
    text: "T2E",
  },
  {
    value: 1.15,
    text: "T3",
  },
  {
    value: 1.16,
    text: "T3R",
  },
  {
    value: 1.20,
    text: "T4",
  },
  {
    value: 1.22,
    text: "T4E",
  },
  {
    value: 1.25,
    text: "T4L",
  },
];

const stonesCountOptions = [
  {
    value: 0,
    text: "0",
  },
  {
    value: 1,
    text: "1",
  },
  {
    value: 2,
    text: "2",
  },
  {
    value: 3,
    text: "3",
  },
  {
    value: 4,
    text: "4",
  },
  {
    value: 5,
    text: "5",
  },
  {
    value: 6,
    text: "6",
  },
  {
    value: 7,
    text: "7",
  },
  {
    value: 8,
    text: "8",
  },
  {
    value: 9,
    text: "9",
  },
  {
    value: 10,
    text: "10",
  },
  {
    value: 11,
    text: "11",
  },
  {
    value: 12,
    text: "12",
  },
];

const formInitialState = {
  EID: '',
  contract: '',
  coop: '',
  IGN: '',
  tachPrismMultiplier: 1000,
  boostBeaconMultiplier: 10,
  baseBoostTime: 10,
  boostEventDurationMultiplier: 1,
  ihr: 7440,
  monocle: monocleOptions[0].value,
  chalice: chaliceOptions[0].value,
  gusset: gussetOptions[0].value,
  t2LifeStonesCount: stonesCountOptions[0].value,
  t3LifeStonesCount: stonesCountOptions[0].value,
  t4LifeStonesCount: stonesCountOptions[0].value,
  t2DiliStonesCount: stonesCountOptions[0].value,
  t3DiliStonesCount: stonesCountOptions[0].value,
  t4DiliStonesCount: stonesCountOptions[0].value,
};

const boostSetPresets = [
  {
    id: '1',
    name: '8 token',
    description: '8 token boost set - 1000x legendary (10 mins) tachyon prism and 10x boost beacon',
    tachPrismMultiplier: 1000,
    boostBeaconMultiplier: 10,
    baseBoostTime: 10,
    baseGeCost: 12000 + 8000,
    discountGeCost: (12000 + 8000) * 0.8,
  },
  {
    id: '2',
    name: '6 token (Dubson)',
    description: '6 token (Dubson) boost set - 1000x legendary (10 mins) tachyon prism and two of the 2x (30 mins) boost beacon',
    tachPrismMultiplier: 1000,
    boostBeaconMultiplier: 4,
    baseBoostTime: 10,
    baseGeCost: 12000 + 1000 * 2,
    discountGeCost: (12000 + 1000 * 2) * 0.8,
  },
  {
    id: '3',
    name: '6 token (Dubson supreme)',
    description: '6 token (Dubson supreme) boost set - 1000x supreme (1 hour) tachyon prism and two of the 2x (30 mins) boost beacon',
    tachPrismMultiplier: 1000,
    boostBeaconMultiplier: 4,
    baseBoostTime: 60,
    baseGeCost: 25000 + 1000 * 2,
    discountGeCost: (25000 + 1000 * 2) * 0.8,
  },
  {
    id: '4',
    name: '5 token (Benson supreme)',
    description: '5 token (Benson supreme) boost set - 1000x supreme (1 hour) prism and one of the 2x boost beacon',
    tachPrismMultiplier: 1000,
    boostBeaconMultiplier: 2,
    baseBoostTime: 60,
    baseGeCost: 25000 + 1000,
    discountGeCost: (25000 + 1000) * 0.8,
  },
  {
    id: '5',
    name: '4 token (Epic)',
    description: '4 token (Epic) boost set - Two 100x epic (2 hour) tachyon prisms',
    tachPrismMultiplier: 200,
    boostBeaconMultiplier: 1,
    baseBoostTime: 120,
    baseGeCost: 5000 * 2,
    discountGeCost: (5000 * 2) * 0.8,
  },
  {
    id: '6',
    name: '4 token (Supreme)',
    description: '4 token (Supreme) boost - 1000x supreme (1 hour) prism',
    tachPrismMultiplier: 1000,
    boostBeaconMultiplier: 1,
    baseBoostTime: 60,
    baseGeCost: 25000,
    discountGeCost: 25000 * 0.8,
  },
  {
    id: '7',
    name: '0 token (five large)',
    description: '0 token (five large tach prisms) boost set - five 10x large (4 hour) tachyon prisms',
    tachPrismMultiplier: 5 * 10,
    boostBeaconMultiplier: 1,
    baseBoostTime: 4 * 60,
    baseGeCost: '2500 (always buy in a group of 5!)',
    discountGeCost: 2000,
  },
];

const artifactRarityOptions: any = {
  0: '',
  1: 'R',
  2: 'E',
  3: 'L',
}