// import des composants
import AsideMainComponent from "../asideMain/AsideMainComponent";
import AsideHeader from "../asideHeader/AsideHeader";
// import des services
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du style
import style from "./asideContainer.module.scss";
// import des icônes
import { ChevronLeft } from "lucide-react";

/**
 * Affiche le panel latéral avec la liste des points, les filtres et les informations du point sélectionné
 * @param {Object} props
 * @param {boolean} props.panelDisplayed - Affiche ou masque le panel latéral
 * @param {Dispatch<SetStateAction<boolean>>} props.setPanelDisplayed - Modifie l'état d'affichage du panel latéral
 * @returns AsideHeader | AsideMainComponent
 */
const AsideContainer = () => {
	const { isPanelDisplayed, setIsPanelDisplayed } = useMapAsideMenuStore();
	const { tutorialStep } = useMapStore();

	// définition des classes CSS en fonction de l'état d'affichage du panel (ouvert ou fermé)
	let asideClassNames = `${style.aside}`;
	asideClassNames += isPanelDisplayed
		? ` ${style.asideOpened}`
		: ` ${style.asideClosed}`;
	asideClassNames += tutorialStep > 5 ? ` ${style.asideOpenedWhite}` : "";
	return (
		<aside className={asideClassNames}>
			<AsideHeader />
			<div className={style.toggleButtonContainer}>
				{isPanelDisplayed ? (
					<button
						type="button"
						className={style.toggleButton}
						onClick={() => setIsPanelDisplayed(false)}
						aria-label="Fermer le panel latéral"
					>
						<ChevronLeft />
					</button>
				) : null}
			</div>
			<AsideMainComponent />
		</aside>
	);
};

export default AsideContainer;
