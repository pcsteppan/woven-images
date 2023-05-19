import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useCallback, useEffect, useState } from "react";
import "./scriptbox.scss";
import createTheme from '@uiw/codemirror-themes';
import { dark } from 'ayu';
import { tags as t } from '@lezer/highlight';

const ayuDarkModTheme = createTheme({
	theme: 'dark',
	settings: {
		background: '#000000',
		foreground: dark.editor.fg.hex(),
		caret: '#ffffff',
		selection: dark.editor.selection.inactive.hex(),
		selectionMatch: dark.editor.selection.active.hex(),
		lineHighlight: dark.editor.line.hex(),
		gutterBackground: '#000000',
		gutterForeground: dark.editor.fg.hex(),
		fontFamily: "'JetBrains Mono'",
	},
	styles: [
		{ tag: [t.comment, t.bracket], color: "#999" },
		{ tag: [t.keyword], color: dark.syntax.keyword.hex() },
		{ tag: [t.number], color: dark.syntax.constant.hex() },
		{ tag: [t.operator], color: dark.syntax.operator.hex() },
		{ tag: [t.standard(t.tagName), t.tagName], color: dark.syntax.tag.hex() },
		{ tag: [t.string], color: dark.syntax.string.hex() },
		{ tag: [t.variableName], color: dark.syntax.entity.hex() },
		{ tag: t.function(t.variableName), color: dark.syntax.func.hex() },
	]
})

export interface ScriptBoxProps {
	transformState: (f: Function) => void
}

export function ScriptBox({ transformState }: ScriptBoxProps) {
	const initialScript = `// ctx contains a shiftLeft and shiftRight method
// you can also modify any of the state as you would any array in javascript
// using [...arr], .slice(), etc.
return {
	...state,
	warpThreads: ctx.shiftRight(state.warpThreads),
	treadlingInstructions: state.treadlingInstructions
};`
	// eslint-disable-next-line no-new-func
	const [script, setScript] = useState(() => Function('state', 'ctx', initialScript));
	const [isActive, setIsActive] = useState(false);
	const [delay, setDelay] = useState(400);
	const [hidden, setHidden] = useState(true);

	const onChange = useCallback((userCode: any) => {
		try {
			// validate
			// eslint-disable-next-line no-new-func
			const f = Function('state', 'ctx', userCode);
			// set
			setScript(() => f);
		}
		catch (e) {
			// handle invalid user input
			console.log("invalid input: " + e);
		}
	}, []);

	useEffect(() => {
		let interval: any = null;
		if (isActive) {
			interval = setInterval(() => {
				transformState(script);
			}, delay);
		} else if (!isActive) {
			clearInterval(interval);
		}
		console.log('useEffect: ScriptBox')
		return () => clearInterval(interval);
	}, [isActive, delay, script, transformState]);

	return (
		<div className="scriptbox">
			<div className="scriptbox-inputs">
				<div className="scriptbox-form">
					<button className="Btn" onClick={() => transformState(script)}>
						Apply
					</button>
					<div>
						<label htmlFor="toggle-loop">toggle loop:</label>
						<input className="scriptbox-form--delay-toggle" name="toggle-loop" type="checkbox" value="false" onChange={() => setIsActive(!isActive)}></input>
					</div>
					<div>
						<label htmlFor="delay-tbx">delay in ms:</label>
						<input className="scriptbox-form--delay" name="delay-tbx" type="number" min="20" max="10000" value={delay} onChange={e => setDelay(parseInt(e.target.value))} />
					</div>
				</div>
				<button className="Btn" onClick={() => setHidden(!hidden)}>
					{
						hidden ? 'Show' : 'Hide'
					}
				</button>
			</div>
			<CodeMirror
				hidden={hidden}
				value={initialScript}
				height="20rem"
				onChange={onChange}
				lang="js"
				extensions={[javascript()]}
				theme={ayuDarkModTheme}
				basicSetup={{
					foldGutter: false,
				}}
			/>
		</div>
	)
}

