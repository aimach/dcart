// import des composants
import AsideMainComponent from "../asideMain/AsideMainComponent";
import AsideHeader from "../asideHeader/AsideHeader";
// import des types
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./asideContainer.module.scss";
// import des icônes
import { ChevronLeft } from "lucide-react";

interface AsideContainerProps {
	panelDisplayed: boolean;
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
}

/**
 * Affiche le panel latéral avec la liste des points, les filtres et les informations du point sélectionné
 * @param {Object} props
 * @param {boolean} props.panelDisplayed - Affiche ou masque le panel latéral
 * @param {Dispatch<SetStateAction<boolean>>} props.setPanelDisplayed - Modifie l'état d'affichage du panel latéral
 * @returns AsideHeader | AsideMainComponent
 */
const AsideContainer = ({
	panelDisplayed,
	setPanelDisplayed,
}: AsideContainerProps) => {
	// définition des classes CSS en fonction de l'état d'affichage du panel (ouvert ou fermé)
	let asideClassNames = `${style.aside}`;
	asideClassNames += panelDisplayed
		? ` ${style.asideOpened}`
		: ` ${style.asideClosed}`;
	return (
		<aside className={asideClassNames}>
			<AsideHeader />
			<div className={style.toggleButtonContainer}>
				{panelDisplayed ? (
					<button
						type="button"
						className={style.toggleButton}
						onClick={() => setPanelDisplayed(false)}
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
