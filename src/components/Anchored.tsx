import React from 'react';

type Props = {
	readonly anchor?: string | undefined;
} & {
	readonly [k in keyof JSX.IntrinsicElements]: string;
};

/* Example:
 * <Anchored
 *   anchor="part-4"
 *   h3="Part 4: This Part Is The Next One"
 * />
 *
 * or with an implicit anchor
 *
 * <Anchored h2="Can't Stop Me Now" />
 *
 * (which would make the id `cant_stop_me_now`);
 */
export const Anchored = ({ anchor, ...component }: Props): React.ReactNode => {
	const entries = Object.entries(component);
	if (entries.length !== 1) {
		throw new Error(
			'Anchored must be given exactly one prop with an html element as the key and a string as the value',
		);
	}

	const [Tag, content] = entries[0]! as [keyof JSX.IntrinsicElements, string];

	const href = '#' + (anchor ?? content).toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '');
	return (
		<Tag id={anchor}>
			<a className="anchor" href={href}>
				#
			</a>
			{content}
		</Tag>
	);
};
