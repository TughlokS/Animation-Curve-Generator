import '../Styles/animationGroup.css'
import MoveAnimationCard from './MoveAnimationCard'



function AnimationGroup() {

	return (
		<div className="animation-group">

			<MoveAnimationCard title='Curve' bodyText='0.0, 0.0, 1.0, 1.0' backgroundColor='#ff1861'/>

			<MoveAnimationCard title='Preset' bodyText='0.0, 0.0, 1.0, 1.0' backgroundColor='#00e1ff'/>

			<MoveAnimationCard title='Linear' bodyText='0.0, 0.0, 1.0, 1.0' backgroundColor='#18ffb2'/>

		</div>
	)
}

export default AnimationGroup