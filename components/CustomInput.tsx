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
	return <input type={type} name={name} id={name} value={value} onChange={handleChange} {...rest} />;
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
	return <input type="number" name={name} id={name} value={value} min={0} onChange={handleChange} {...rest} />;
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
		<select name={name} id={name} onChange={handleChange} value={value} style={{ ...style }} {...rest}>
			{options.map((option, index) => (
				<option key={index} value={option?.value}>
					{option?.text}
				</option>
			))}
		</select>
	);
}
