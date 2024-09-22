export default function CustomTextInput({
	name,
	value,
	handleChange,
	type = 'text',
	...rest
}: {
	readonly handleChange?: any;
	readonly name: string;
	readonly rest?: any;
	readonly type?: string;
	readonly value: any;
}) {
	return (
		<input id={name} name={name} onChange={handleChange} type={type} value={value} {...rest} />
	);
}

export function CustomNumberInput({
	name,
	value,
	handleChange,
	...rest
}: {
	readonly handleChange?: any;
	readonly name: string;
	readonly rest?: any;
	readonly value: any;
}) {
	return (
		<input
			id={name}
			min={0}
			name={name}
			onChange={handleChange}
			type="number"
			value={value}
			{...rest}
		/>
	);
}

export function CustomSelectInput({
	name,
	options,
	value,
	handleChange,
	style,
	...rest
}: {
	readonly handleChange?: any;
	readonly name: string;
	readonly options: any[];
	readonly rest?: any;
	readonly style?: any;
	readonly value: any;
}) {
	return (
		<select
			id={name}
			name={name}
			onChange={handleChange}
			style={{ ...style }}
			value={value}
			{...rest}
		>
			{options.map((option, index) => (
				<option key={index} value={option?.value}>
					{option?.text}
				</option>
			))}
		</select>
	);
}
