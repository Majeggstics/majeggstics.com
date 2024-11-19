export type DefinedAndStringable = bigint | boolean | number | string | symbol;
export type DefinedButNotAFunction = DefinedAndStringable | { [k: string]: unknown; apply?: never }; // an approximation
export const groupBy = <T, K extends DefinedAndStringable>(
	objs: T[],
	fn: (t: T) => K | undefined,
): Record<string, T[]> =>
	objs.reduce((acc: Record<string, T[]>, each: T) => {
		const key = fn(each);
		if (key !== undefined) {
			const str = String(key);
			acc[str] ??= [];
			acc[str].push(each);
		}

		return acc;
	}, {});
