// import des bibliothèques
import { useContext } from "react";
import { Link } from "react-router";
// import des composants
import MapMenuNav from "../../components/map/mapMenuNav/MapMenuNav";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import du style
import style from "./mapMenuPage.module.scss";

const MapMenuPage = () => {
	// on récupère le language
	const { language, translation } = useContext(TranslationContext);

	return (
		<section className={style.mapMenu}>
			<div className={style.mapMenuButtonContainer}>
				<Link to="exploration" className={style.mapMenuActionButton}>
					{translation[language].button.freeExploration as string}
				</Link>
			</div>
			<div className={style.mapMenuNavContainer}>
				<MapMenuNav />
			</div>
		</section>
	);
};

export default MapMenuPage;
