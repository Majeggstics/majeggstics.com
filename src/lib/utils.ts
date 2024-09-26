import type {
	ChangeEvent,
	ChangeEventHandler,
	Dispatch,
	EventHandler,
	SetStateAction,
	SyntheticEvent,
} from 'react';
import { useState, useCallback } from 'react';
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
