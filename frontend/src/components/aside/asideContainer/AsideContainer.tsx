// import des types
import type { Dispatch, SetStateAction } from "react";
import type { PointType } from "../../../types/mapTypes";

// import du style
import style from "./asideContainer.module.scss";
import AsideMainComponent from "../asideMain/AsideMainComponent";
import AsideHeader from "../asideHeader/AsideHeader";

interface AsideContainerProps {
	side: "left" | "right";
	toggleButtons: { [key: string]: boolean };
	setToggleButtons: Dispatch<
		SetStateAction<Partial<{ right: boolean; left: boolean }>>
	>;
	selectedPoint?: PointType | null | undefined;
	allPoints?: PointType[];
}

const AsideContainer = ({
	side,
	toggleButtons,
	setToggleButtons,
	selectedPoint,
	allPoints,
}: AsideContainerProps) => {
	return (
		<aside
			className={
				toggleButtons[side] ? `${style.asideOpened}` : `${style.asideClosed}`
			}
		>
			<AsideHeader />
			<div className={style.toggleButtonContainer}>
				{side === "left" ? (
					<AsideMainComponent
						point={selectedPoint as PointType}
						results={allPoints as PointType[]}
					/>
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

export default AsideContainer;
