export const BASE_MAX_HAB_SPACE = 11_340_000_000;

export const monocleOptions = [
  {
    value: 1,
    text: 'None',
  },
  {
    value: 1.05,
    text: 'T1',
  },
  {
    value: 1.1,
    text: 'T2',
  },
  {
    value: 1.15,
    text: 'T3',
  },
  {
    value: 1.2,
    text: 'T4',
  },
  {
    value: 1.25,
    text: 'T4E',
  },
  {
    value: 1.3,
    text: 'T4L',
  },
];

export const chaliceOptions = [
  {
    value: 1,
    text: 'None',
  },
  {
    value: 1.05,
    text: 'T1',
  },
  {
    value: 1.1,
    text: 'T2',
  },
  {
    value: 1.15,
    text: 'T2E',
  },
  {
    value: 1.2,
    text: 'T3',
  },
  {
    value: 1.23,
    text: 'T3R',
  },
  {
    value: 1.25,
    text: 'T3E',
  },
  {
    value: 1.3,
    text: 'T4',
  },
  {
    value: 1.35,
    text: 'T4E',
  },
  {
    value: 1.4,
    text: 'T4L',
  },
];

export const gussetOptions = [
  {
    value: 1,
    text: 'None',
  },
  {
    value: 1.05,
    text: 'T1',
  },
  {
    value: 1.1,
    text: 'T2',
  },
  {
    value: 1.12,
    text: 'T2E',
  },
  {
    value: 1.15,
    text: 'T3',
  },
  {
    value: 1.16,
    text: 'T3R',
  },
  {
    value: 1.2,
    text: 'T4',
  },
  {
    value: 1.22,
    text: 'T4E',
  },
  {
    value: 1.25,
    text: 'T4L',
  },
];

export const stonesCountOptions = [
  {
    value: 0,
    text: '0',
  },
  {
    value: 1,
    text: '1',
  },
  {
    value: 2,
    text: '2',
  },
  {
    value: 3,
    text: '3',
  },
  {
    value: 4,
    text: '4',
  },
  {
    value: 5,
    text: '5',
  },
  {
    value: 6,
    text: '6',
  },
  {
    value: 7,
    text: '7',
  },
  {
    value: 8,
    text: '8',
  },
  {
    value: 9,
    text: '9',
  },
  {
    value: 10,
    text: '10',
  },
  {
    value: 11,
    text: '11',
  },
  {
    value: 12,
    text: '12',
  },
];

export const formInitialState = {
  EID: '',
  contract: '',
  coop: '',
  IGN: '',
  tachPrismMultiplier: 1_000,
  boostBeaconMultiplier: 10,
  baseBoostTime: 10,
  boostEventDurationMultiplier: 1,
  ihr: 7_440,
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

export const boostSetPresets = [
  {
    id: '1',
    name: '8 token',
    description: '8 token boost set - 1000x legendary (10 mins) tachyon prism and 10x boost beacon',
    tachPrismMultiplier: 1_000,
    boostBeaconMultiplier: 10,
    baseBoostTime: 10,
    baseGeCost: 12_000 + 8_000,
    discountGeCost: (12_000 + 8_000) * 0.8,
  },
  {
    id: '2',
    name: '6 token (Dubson)',
    description:
      '6 token (Dubson) boost set - 1000x legendary (10 mins) tachyon prism and two of the 2x (30 mins) boost beacon',
    tachPrismMultiplier: 1_000,
    boostBeaconMultiplier: 4,
    baseBoostTime: 10,
    baseGeCost: 12_000 + 1_000 * 2,
    discountGeCost: (12_000 + 1_000 * 2) * 0.8,
  },
  {
    id: '3',
    name: '6 token (Dubson supreme)',
    description:
      '6 token (Dubson supreme) boost set - 1000x supreme (1 hour) tachyon prism and two of the 2x (30 mins) boost beacon',
    tachPrismMultiplier: 1_000,
    boostBeaconMultiplier: 4,
    baseBoostTime: 60,
    baseGeCost: 25_000 + 1_000 * 2,
    discountGeCost: (25_000 + 1_000 * 2) * 0.8,
  },
  {
    id: '4',
    name: '5 token (Benson supreme)',
    description: '5 token (Benson supreme) boost set - 1000x supreme (1 hour) prism and one of the 2x boost beacon',
    tachPrismMultiplier: 1_000,
    boostBeaconMultiplier: 2,
    baseBoostTime: 60,
    baseGeCost: 25_000 + 1_000,
    discountGeCost: (25_000 + 1_000) * 0.8,
  },
  {
    id: '5',
    name: '4 token (Epic)',
    description: '4 token (Epic) boost set - Two 100x epic (2 hour) tachyon prisms',
    tachPrismMultiplier: 200,
    boostBeaconMultiplier: 1,
    baseBoostTime: 120,
    baseGeCost: 5_000 * 2,
    discountGeCost: 5_000 * 2 * 0.8,
  },
  {
    id: '6',
    name: '4 token (Supreme)',
    description: '4 token (Supreme) boost - 1000x supreme (1 hour) prism',
    tachPrismMultiplier: 1_000,
    boostBeaconMultiplier: 1,
    baseBoostTime: 60,
    baseGeCost: 25_000,
    discountGeCost: 25_000 * 0.8,
  },
  {
    id: '7',
    name: '0 token (five large)',
    description: '0 token (five large tach prisms) boost set - five 10x large (4 hour) tachyon prisms',
    tachPrismMultiplier: 5 * 10,
    boostBeaconMultiplier: 1,
    baseBoostTime: 4 * 60,
    baseGeCost: '2500 (always buy in a group of 5!)',
    discountGeCost: 2_000,
  },
];

export const artifactRarityOptions: any = {
  0: '',
  1: 'R',
  2: 'E',
  3: 'L',
};
