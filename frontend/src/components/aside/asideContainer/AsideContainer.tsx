// import des composants
import AsideMainComponent from "../asideMain/AsideMainComponent";
import AsideHeader from "../asideHeader/AsideHeader";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../../utils/types/mapTypes";
// import du style
import style from "./asideContainer.module.scss";
// import des icônes
import { ChevronLeft } from "lucide-react";

interface AsideContainerProps {
	panelDisplayed: boolean;
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
	allPoints?: PointType[];
	mapId: string;
}

const AsideContainer = ({
	panelDisplayed,
	setPanelDisplayed,
	allPoints,
	mapId,
}: AsideContainerProps) => {
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
			<AsideMainComponent results={allPoints as PointType[]} mapId={mapId} />
		</aside>
	);
};

export default AsideContainer;
