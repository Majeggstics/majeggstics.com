// This whole class must be prettier-ignored to preserve the tabular shape of the static
// boost types, so be careful with your hand-formatting in there.
//
// prettier-ignore
export class Boost {
	/* eslint-disable @typescript-eslint/lines-between-class-members */
	static LargeTach     = new Boost('Large Tachyon Prism',     10,    240, 500);
	static EpicTach      = new Boost('Epic Tachyon Prism',      100,   120, 5_000);
	static LegendaryTach = new Boost('Legendary Tachyon Prism', 1_000, 10,  12_000);
	static SupremeTach   = new Boost('Supreme Tachyon Prism',   1_000, 60,  25_000);
	static Beacon        = new Boost('Boost Beacon',            2,     30,  1_000);
	static EpicBeacon    = new Boost('Epic Boost Beacon',       10,    10,  8_000);
	/* eslint-enable */

	constructor(
		public name: string,
		public multiplier: number,
		public durationMins: number,
		public geCost: number,
	) { }

	iconPath(): string {
		const name = this.name.replace(/ /g, '_');
		return `/images/gameResources/boosts/Boosts_${name}.png`;
	}

	descriptor(): string {
		const time = this.durationMins > 60 ? `${this.durationMins / 60}hr` : `${this.durationMins}min`;
		return `${this.name} (${this.multiplier}×, ${time})`;
	}

	static Image({ boost }: { boost: Boost }): React.ReactNode {
		return <img src={boost.iconPath()} title={boost.descriptor()} />;
	}
}
