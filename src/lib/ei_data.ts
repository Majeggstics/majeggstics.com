// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ArtifactSpec {
	export enum Name {
		LUNAR_TOTEM = 0,
		NEODYMIUM_MEDALLION = 3,
		BEAK_OF_MIDAS = 4,
		LIGHT_OF_EGGENDIL = 5,
		DEMETERS_NECKLACE = 6,
		VIAL_MARTIAN_DUST = 7,
		ORNATE_GUSSET = 8,
		THE_CHALICE = 9,
		BOOK_OF_BASAN = 10,
		PHOENIX_FEATHER = 11,
		TUNGSTEN_ANKH = 12,
		AURELIAN_BROOCH = 21,
		CARVED_RAINSTICK = 22,
		PUZZLE_CUBE = 23,
		QUANTUM_METRONOME = 24,
		SHIP_IN_A_BOTTLE = 25,
		TACHYON_DEFLECTOR = 26,
		INTERSTELLAR_COMPASS = 27,
		DILITHIUM_MONOCLE = 28,
		TITANIUM_ACTUATOR = 29,
		MERCURYS_LENS = 30,
		TACHYON_STONE = 1,
		DILITHIUM_STONE = 31,
		SHELL_STONE = 32,
		LUNAR_STONE = 33,
		SOUL_STONE = 34,
		PROPHECY_STONE = 39,
		QUANTUM_STONE = 36,
		TERRA_STONE = 37,
		LIFE_STONE = 38,
		CLARITY_STONE = 40,
		EXTRATERRESTRIAL_ALUMINUM = 13,
		ANCIENT_TUNGSTEN = 14,
		SPACE_ROCKS = 15,
		ALIEN_WOOD = 16,
		GOLD_METEORITE = 17,
		TAU_CETI_GEODE = 18,
		CENTAURIAN_STEEL = 19,
		ERIDANI_FEATHER = 20,
		DRONE_PARTS = 35,
		CELESTIAL_BRONZE = 41,
		LALANDE_HIDE = 42,
		SOLAR_TITANIUM = 43,
		TACHYON_STONE_FRAGMENT = 2,
		DILITHIUM_STONE_FRAGMENT = 44,
		SHELL_STONE_FRAGMENT = 45,
		LUNAR_STONE_FRAGMENT = 46,
		SOUL_STONE_FRAGMENT = 47,
		PROPHECY_STONE_FRAGMENT = 48,
		QUANTUM_STONE_FRAGMENT = 49,
		TERRA_STONE_FRAGMENT = 50,
		LIFE_STONE_FRAGMENT = 51,
		CLARITY_STONE_FRAGMENT = 52,
		UNKNOWN = 10_000,
	}
	export enum Level {
		INFERIOR = 0,
		LESSER = 1,
		NORMAL = 2,
		GREATER = 3,
		SUPERIOR = 4,
	}
	export enum Rarity {
		COMMON = 0,
		RARE = 1,
		EPIC = 2,
		LEGENDARY = 3,
	}
	export enum Type {
		ARTIFACT = 0,
		STONE = 1,
		INGREDIENT = 2,
		STONE_INGREDIENT = 3,
	}
}

export type ArtifactIntensity = {
	level: ArtifactSpec.Level;
	rarity: ArtifactSpec.Rarity;
};

export type Artifact = ArtifactIntensity & {
	name: ArtifactSpec.Name;
};

export type Stone = {
	name: ArtifactSpec.Name;
	level: ArtifactSpec.Level;
};

export const PossibleArtifactIntensity = {
	chalice: [
		{ level: 0, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 1, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 1, rarity: ArtifactSpec.Rarity.EPIC },
		{ level: 2, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 2, rarity: ArtifactSpec.Rarity.RARE },
		{ level: 2, rarity: ArtifactSpec.Rarity.EPIC },
		{ level: 3, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 3, rarity: ArtifactSpec.Rarity.EPIC },
		{ level: 3, rarity: ArtifactSpec.Rarity.LEGENDARY },
	] as ArtifactIntensity[],
	gusset: [
		{ level: 0, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 1, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 1, rarity: ArtifactSpec.Rarity.EPIC },
		{ level: 2, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 2, rarity: ArtifactSpec.Rarity.RARE },
		{ level: 3, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 3, rarity: ArtifactSpec.Rarity.EPIC },
		{ level: 3, rarity: ArtifactSpec.Rarity.LEGENDARY },
	] as ArtifactIntensity[],
	monocle: [
		{ level: 0, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 1, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 2, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 3, rarity: ArtifactSpec.Rarity.COMMON },
		{ level: 3, rarity: ArtifactSpec.Rarity.EPIC },
		{ level: 3, rarity: ArtifactSpec.Rarity.LEGENDARY },
	] as ArtifactIntensity[],
};

export const artifactRarity = (rarity: ArtifactSpec.Rarity): string => {
	switch (rarity) {
		case ArtifactSpec.Rarity.COMMON:
			return '';
		case ArtifactSpec.Rarity.RARE:
			return 'R';
		case ArtifactSpec.Rarity.EPIC:
			return 'E';
		case ArtifactSpec.Rarity.LEGENDARY:
			return 'L';
	}
};

export const chaliceMultiplier = ({ level, rarity }: ArtifactIntensity) => {
	if (level === 0) return 1.05;
	if (level === 1) {
		if (rarity === ArtifactSpec.Rarity.COMMON) return 1.1;
		if (rarity === ArtifactSpec.Rarity.EPIC) return 1.15;
	}

	if (level === 2) {
		if (rarity === ArtifactSpec.Rarity.COMMON) return 1.2;
		if (rarity === ArtifactSpec.Rarity.RARE) return 1.23;
		if (rarity === ArtifactSpec.Rarity.EPIC) return 1.25;
	}

	if (level === 3) {
		if (rarity === ArtifactSpec.Rarity.COMMON) return 1.3;
		if (rarity === ArtifactSpec.Rarity.EPIC) return 1.35;
		if (rarity === ArtifactSpec.Rarity.LEGENDARY) return 1.4;
	}

	return 1;
};

export const monocleMultiplier = ({ level, rarity }: ArtifactIntensity) => {
	if (level === 0) return 1.05;
	if (level === 1) return 1.1;
	if (level === 2) return 1.15;
	if (level === 3) {
		if (rarity === ArtifactSpec.Rarity.COMMON) return 1.2;
		if (rarity === ArtifactSpec.Rarity.EPIC) return 1.25;
		if (rarity === ArtifactSpec.Rarity.LEGENDARY) return 1.3;
	}

	return 1;
};

export const gussetMultiplier = ({ level, rarity }: ArtifactIntensity) => {
	if (level === 0) return 1.05;
	if (level === 1) {
		if (rarity === ArtifactSpec.Rarity.COMMON) return 1.1;
		if (rarity === ArtifactSpec.Rarity.EPIC) return 1.12;
	}

	if (level === 2) {
		if (rarity === ArtifactSpec.Rarity.COMMON) return 1.15;
		if (rarity === ArtifactSpec.Rarity.RARE) return 1.16;
	}

	if (level === 3) {
		if (rarity === ArtifactSpec.Rarity.COMMON) return 1.2;
		if (rarity === ArtifactSpec.Rarity.EPIC) return 1.22;
		if (rarity === ArtifactSpec.Rarity.LEGENDARY) return 1.25;
	}

	return 1;
};
