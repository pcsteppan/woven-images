import { useState } from "react";

export function createScriptCallHandler<T>(
	state: T,
	setState: (state: T) => void,
	validators: Array<(arg: Array<number>) => boolean>) {
	return (scriptFunction: Function) => {
		// console.log('starting transform')
		try {
			const potentialNewState = scriptFunction(state, editorContext);
			if (!validators.every(validator => validator(potentialNewState))) {
				console.error('invalid result. skipping transform application: ' + potentialNewState)
				const failedValidators = validators.filter(v => !v(potentialNewState));
				console.log(failedValidators, state, potentialNewState);
				return;
			}
			setState(potentialNewState);
			// console.log('transform application successful:')
			// console.log(state, "->", potentialNewState);
		}
		catch (e) {
			console.error('an error occurred while applying transform: ' + e)
		}
	};
}

export function useStateWithScriptBox(initialState: any) {
	const [state, setState] = useState(initialState);

	const handleScriptCall = createScriptCallHandler(state, setState, [
		// (newState) => Array.isArray(newState),
		// (newState) => newState.length === state.length,
	]);

	return [state, setState, handleScriptCall];
}

const editorContext = {
	shiftRight: (arr: Array<number>): Array<number> => {
		return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
	},
	shiftLeft: (arr: Array<number>): Array<number> => {
		return [...arr.slice(1), arr[0]];
	}
}