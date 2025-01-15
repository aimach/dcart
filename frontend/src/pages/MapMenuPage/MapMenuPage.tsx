// import des bibliothèques
import { useContext } from "react";
import { Link } from "react-router";
// import des composants
import NavComponent from "../../components/common/NavComponent";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des types
import type { NavList } from "../../types/commonTypes";
// import du style
import style from "./mapMenuPage.module.scss";

const MapMenuPage = () => {
	// on récupère le language
	const { language, translation } = useContext(TranslationContext);

	// on prépare la liste des cartes
	const thematicMapsList: NavList = [
		{
			title: "Carte thématique 1",
			onClickFunction: undefined,
			route: "/map/exploration",
		},
		{
			title: "Carte thématique 2",
			onClickFunction: undefined,
			route: "/map/exploration",
		},
		{
			title: "Carte thématique 3",
			onClickFunction: undefined,
			route: "/map/exploration",
		},
	];

	return (
		<section className={style.mapMenu}>
			<div className={style.mapMenuButtonContainer}>
				<Link to="exploration" className={style.mapMenuActionButton}>
					{translation[language].button.freeExploration}
				</Link>
			</div>
			<div className={style.mapMenuNavContainer}>
				<NavComponent
					type="route"
					navClassName={style.mapMenuNav}
					list={thematicMapsList}
				/>
			</div>
		</section>
	);
};

export default MapMenuPage;
