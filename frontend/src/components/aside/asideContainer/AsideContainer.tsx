// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../../utils/types/mapTypes";

// import du style
import style from "./asideContainer.module.scss";
import AsideMainComponent from "../asideMain/AsideMainComponent";
import AsideHeader from "../asideHeader/AsideHeader";

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
	return (
		<aside
			className={
				panelDisplayed ? `${style.asideOpened}` : `${style.asideClosed}`
			}
		>
			<AsideHeader />
			<div className={style.toggleButtonContainer}>
				<AsideMainComponent results={allPoints as PointType[]} mapId={mapId} />
				{panelDisplayed ? (
					<button
						type="button"
						className={style.toggleButton}
						onClick={() => setPanelDisplayed(false)}
					>
						{panelDisplayed ? "<" : ">"}
					</button>
				) : null}
			</div>
		</aside>
	);
};

export default AsideContainer;
