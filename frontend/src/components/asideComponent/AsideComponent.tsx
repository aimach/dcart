// import des services
import { zoomOnMarkerOnClick } from "../../utils/functions/functions";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../types/mapTypes";
import type { Map as LeafletMap } from "leaflet";

// import du style
import style from "./asideComponent.module.scss";
import ResultComponent from "../resultComponent/ResultComponent";

interface AsideComponentProps {
	side: "left" | "right";
	toggleButtons: { [key: string]: boolean };
	setToggleButtons: Dispatch<
		SetStateAction<Partial<{ right: boolean; left: boolean }>>
	>;
	selectedPoint?: PointType | null | undefined;
}

const AsideComponent = ({
	side,
	toggleButtons,
	setToggleButtons,
	selectedPoint,
}: AsideComponentProps) => {
	return (
		<aside
			className={
				toggleButtons[side] ? `${style.asideOpened}` : `${style.asideClosed}`
			}
		>
			<div className={style.toggleButtonContainer}>
				{side === "left" ? (
					<ResultComponent point={selectedPoint as PointType} />
				) : null}
				{toggleButtons[side] ? (
					<button
						type="button"
						className={`${style[`toggleButton${side}`]} ${style.toggleButton}`}
						onClick={() =>
							setToggleButtons({
								...toggleButtons,
								[side]: !toggleButtons[side],
							})
						}
					>
						{toggleButtons[side] ? "<" : ">"}
					</button>
				) : null}
			</div>
		</aside>
	);
};

export default AsideComponent;
