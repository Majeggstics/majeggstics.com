/* eslint-disable @stylistic/lines-between-class-members */
// This whole class must be prettier-ignored to preserve the tabular shape of the static
// boost types, so be careful with your hand-formatting in there.
//
// prettier-ignore
export class Boost {
	static Null          = new Boost('null',          'None',                    1,     0,   0);
	static LargeTach     = new Boost('largeTach',     'Large Tachyon Prism',     10,    240, 500);
	static EpicTach      = new Boost('epicTach',      'Epic Tachyon Prism',      100,   120, 5_000);
	static LegendaryTach = new Boost('legendaryTach', 'Legendary Tachyon Prism', 1_000, 10,  12_000);
	static SupremeTach   = new Boost('supremeTach',   'Supreme Tachyon Prism',   1_000, 60,  25_000);
	static Beacon        = new Boost('beacon',        'Boost Beacon',            2,     30,  1_000);
	static EpicBeacon    = new Boost('epicBeacon',    'Epic Boost Beacon',       10,    10,  8_000);
	static Mirror        = new Boost('soulMirror',    'Soul Mirror',             1,     10,  100);

	private static byId = {
		[Boost.Null.id]:          Boost.Null,
		[Boost.LargeTach.id]:     Boost.LargeTach,
		[Boost.EpicTach.id]:      Boost.EpicTach,
		[Boost.LegendaryTach.id]: Boost.LegendaryTach,
		[Boost.SupremeTach.id]:   Boost.SupremeTach,
		[Boost.Beacon.id]:        Boost.Beacon,
		[Boost.EpicBeacon.id]:    Boost.EpicBeacon,
		[Boost.Mirror.id]:        Boost.Mirror,
	} as const;

	private constructor(
		public id: string,
		public name: string,
		public multiplier: number,
		public durationMins: number,
		public geCost: number,
	) {}

	static Image({ boost }: { boost: Boost }): React.ReactNode {
		const name = boost.name.replace(/ /g, '_');
		const iconPath = `/images/gameResources/boosts/Boosts_${name}.png`;

		const time = boost.durationMins > 60 ? `${boost.durationMins / 60}hr` : `${boost.durationMins}min`;
		const descriptor = `${boost.name} (${boost.multiplier}×, ${time})`;

		return <img className="icon" src={iconPath} title={descriptor} />;
	}

	static from(id: string): Boost {
		return Boost.byId[id] ?? Boost.Null;
	}
}
