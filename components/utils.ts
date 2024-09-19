import type { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction } from 'react';
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
