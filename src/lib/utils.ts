import type {
	ChangeEvent,
	ChangeEventHandler,
	Dispatch,
	EventHandler,
	SetStateAction,
	SyntheticEvent,
} from 'react';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

type HTMLElementWithValue = HTMLInputElement | HTMLTextAreaElement;
export const useEventSetState = (
	initial: string,
): [string, ChangeEventHandler<HTMLElementWithValue>, Dispatch<SetStateAction<string>>] => {
	const [rawState, setRawState] = useState<string>(initial);
	return [
		rawState,
		useCallback((event: ChangeEvent<HTMLElementWithValue>) => setRawState(event.target.value), []),
		setRawState,
	];
};

export const useToggleState = (
	initial: boolean = false,
): [boolean, EventHandler<SyntheticEvent<any, Event>>, Dispatch<SetStateAction<boolean>>] => {
	const [rawState, setRawState] = useState<boolean>(initial);
	return [rawState, useCallback(() => setRawState((state) => !state), []), setRawState];
};

export function notify(message: string, type = 'default') {
	switch (type) {
		case 'info':
			toast.info(message);
			break;
		case 'success':
			toast.success(message);
			break;
		case 'warning':
			toast.warn(message);
			break;
		case 'error':
			toast.error(message);
			break;
		default:
			toast(message);
	}
}

export type DefinedButNotAFunction =
	| bigint
	| boolean
	| number
	| string
	| symbol
	| { [k: string]: unknown; apply?: never }; // an approximation
export const usePersistentState = <T extends DefinedButNotAFunction>(
	key: string,
	initial: T,
): [T, Dispatch<SetStateAction<T>>] => {
	const [rawState, setRawState] = useState<T>(initial);
	useEffect(() => {
		const stored = localStorage.getItem(key);
		if (stored) setRawState(JSON.parse(stored));
	}, [key]);
	const setState = useCallback(
		(newState: T | ((old: T) => T)) => {
			setRawState((prev) => {
				const toStore: T = (typeof newState === 'function' ? newState(prev) : newState) ?? prev;
				localStorage.setItem(key, JSON.stringify(toStore));
				return toStore;
			});
		},
		[setRawState, key],
	);

	return [rawState, setState];
};
