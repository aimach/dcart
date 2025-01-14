// import du style
import style from "./mapMenuPage.module.scss";

const MapMenuPage = () => {
	return (
		<section className={style.mapMenu}>
			<div className={style.mapMenuButtonContainer}>
				<button type="button" className={style.mapMenuActionButton}>
					Explorer librement
				</button>
			</div>
			<div className={style.mapMenuNavContainer}>
				<ul className={style.mapMenuNav}>
					<li>Carte thématique 1</li>
					<li>Carte thématique 1</li>
					<li>Carte thématique 1</li>
				</ul>
			</div>
		</section>
	);
};

export default MapMenuPage;
