// import du style
import style from "./loaderComponent.module.scss";

/**
 * Composant de chargement
 */
const LoaderComponent = () => {
	return (
		<div className={style.loaderContainer}>
			<svg width="200" height="100" viewBox="0 0 200 100">
				<title>Loading animation</title>
				<text
					x="50%"
					y="40%"
					dominantBaseline="middle"
					textAnchor="middle"
					fontSize="42"
					fill="#DED6CE"
				>
					Δ
				</text>
				<rect
					x="30"
					y="70"
					width="140"
					height="2"
					fill="#DED6CE"
					opacity="0.2"
				/>

				<rect
					x="30"
					y="70"
					width="140"
					height="2"
					fill="#DED6CE"
					className={style.loaderBar}
				/>
			</svg>
		</div>
	);
};

export default LoaderComponent;
