import './InfoPanel.scss';

export const InfoPanel: React.FunctionComponent = () => {
	return (
		<div className="Panel InfoPanel" >
			<h1>Welcome!</h1>
			<p className="info">
				The <i>Woven Images</i> editor has several presets for you to get started with. You can load them up via <strong>File &gt; Load Preset.</strong>
			</p>
			<p className="info">
				Also play around with the <i>pattern scale</i> to see your woven pattern at different scales.
			</p>
			<p className="info">
				The editor emulates <i>weaving draft</i> notation, where you can enter treadling, tie-up, and threading data and see a live view of the pattern they create.
			</p>
			<p className="info">
				Lastly, you can also view the pattern in 3D by going to <strong>View &gt; 3D</strong>. From there you can left-click to rotate, scroll to zoom, and right-click to pan.
			</p>
		</div >
	)
}