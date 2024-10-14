import '../Styles/presetCardContainer.css';
import PresetCard from './PresetCard';



function PresetCardContainer() {
	return (
		<div className="preset-card-container">

			<PresetCard title="Linearrrrrrrrrrrrrrrr" bodyText="0, 0, 1, 1" />

			<PresetCard title="Ease" bodyText="0.25, 0.1, 0.25, 1" />

			<PresetCard title="Ease-in" bodyText="0.42, 0, 1, 1" />

			<PresetCard title="Ease-out" bodyText="0, 0, 0.58, 1" />

			<PresetCard title="Ease-in-out" bodyText="0.42, 0, 0.58, 1" />

			<PresetCard title="Bounce-in" bodyText="0.5, -0.5, 1, 1" />

			<PresetCard title="Bounce-out" bodyText="0, 0, 0.5, 1.5" />

			<PresetCard title="Bounce-in-out" bodyText="0.5, -0.5, 0.5, 1.5"/>

			<PresetCard title="Anticipate" bodyText="1.25, 0, 0.5, 1" />

			<PresetCard title="Overshoot" bodyText="0.5, 0, -0.25, 1" />

			<PresetCard title="Lightning" bodyText="1, 0, 0, 1" />

			<PresetCard title="Back-in" bodyText="0.60, -0.28, 0.73, 0.05" />

		</div>
	)
}

export default PresetCardContainer