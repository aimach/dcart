// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../../types/mapTypes";

// import du style
import style from "./asideContainer.module.scss";
import AsideMainComponent from "../asideMain/AsideMainComponent";
import AsideHeader from "../asideHeader/AsideHeader";

interface AsideContainerProps {
	panelDisplayed: boolean;
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
	selectedPoint?: PointType | null | undefined;
	allPoints?: PointType[];
}

const AsideContainer = ({
	panelDisplayed,
	setPanelDisplayed,
	selectedPoint,
	allPoints,
}: AsideContainerProps) => {
	return (
		<aside
			className={
				panelDisplayed ? `${style.asideOpened}` : `${style.asideClosed}`
			}
		>
			<AsideHeader />
			<div className={style.toggleButtonContainer}>
				<AsideMainComponent
					point={selectedPoint as PointType}
					results={allPoints as PointType[]}
				/>
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
