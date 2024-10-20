import type { ChangeEvent } from 'react';
import { createContext, useContext, useCallback } from 'react';
import { usePersistentState } from '/lib/utils';

type NonCallableObject = { [k: string]: unknown; apply?: never };
export type WithSetter<Data> = {
	data: Data;
	updateData: (newData: Partial<Data>) => void;
};
export function generateCalculator<Data extends NonCallableObject>(initial: Data) {
	const useCreateState = (): WithSetter<Data> => {
		const [rawData, setRawData] = usePersistentState<Data>('calcData', initial);
		const updateData = useCallback(
			(newData: Partial<Data>) => {
				setRawData((data) => ({ ...data, ...newData }));
			},
			[setRawData],
		);

		return { data: rawData, updateData };
	};

	const Context = createContext<WithSetter<Data>>({ data: initial, updateData: () => {} });

	type InputProps = Readonly<{ datakey: keyof Data; label: string }>;
	const Input = ({
		datakey,
		label,
		...rest
	}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
		const { data, updateData } = useContext<WithSetter<Data>>(Context);

		const handleInput = useCallback(
			(event: ChangeEvent<HTMLInputElement>) => {
				updateData({ [datakey]: event.target.value } as Partial<Data>);
			},
			[updateData, datakey],
		);

		const value =
			typeof data[datakey] === 'string' || typeof data[datakey] === 'number' ?
				data[datakey]
			:	`${String(datakey)} has type ${typeof data[datakey]} and cannot be passed to Input`;

		return (
			<div className="calculatorInput" id={`container-${String(datakey)}`}>
				<label htmlFor={`input-${String(datakey)}`}>{label}</label>
				<input
					id={`input-${String(datakey)}`}
					name={String(datakey)}
					onChange={handleInput}
					value={value}
					{...rest}
				/>
			</div>
		);
	};

	type CheckboxProps = Readonly<{ datakey: keyof Data; label: string }>;
	const Checkbox = ({
		datakey,
		label,
		...rest
	}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>) => {
		const { data, updateData } = useContext<WithSetter<Data>>(Context);

		const handleChange = useCallback(
			(event: ChangeEvent<HTMLInputElement>) => {
				updateData({ [datakey]: event.target.checked } as Partial<Data>);
			},
			[updateData, datakey],
		);

		const checked = data[datakey] ?? false;
		if (typeof checked !== 'boolean') {
			return (
				<div>
					Illegal checkbox: <code>data["{datakey.toString()}"]</code> is{' '}
					<code>{typeof checked}</code>, expected <code>boolean</code>.
				</div>
			);
		}

		return (
			<div className="calculatorCheckbox">
				<input
					id={`input-${String(datakey)}`}
					type="checkbox"
					name={String(datakey)}
					onChange={handleChange}
					checked={checked}
					{...rest}
				/>
				<label htmlFor={`input-${String(datakey)}`}>{label}</label>
			</div>
		);
	};

	type OutputProps = {
		readonly label: string;
	} & (
		| { readonly datakey: keyof Data }
		| { readonly children: React.ReactNode }
		| { readonly value: string }
	);
	const Output = (props: OutputProps) => {
		const { data } = useContext(Context);

		let value;
		if ('datakey' in props) {
			const datum = data[props.datakey];
			value =
				typeof datum === 'string' || typeof datum === 'number' ?
					datum
				:	`${String(props.datakey)} has type ${typeof data[props.datakey]} and cannot be passed to Output`;
		} else if ('value' in props) {
			value = props.value;
		} else {
			value = props.children;
		}

		return (
			<>
				<span>{props.label}</span>
				<span>{value}</span>
			</>
		);
	};

	return {
		useCreateState,
		Context,
		Input,
		Output,
		Checkbox,
	};
}
