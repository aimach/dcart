// import des types
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./asideComponent.module.scss";

interface AsideComponentProps {
	side: "left" | "right";
	toggleButtons: { [key: string]: boolean };
	setToggleButtons: Dispatch<
		SetStateAction<Partial<{ right: boolean; left: boolean }>>
	>;
}

const AsideComponent = ({
	side,
	toggleButtons,
	setToggleButtons,
}: AsideComponentProps) => {
	return (
		<aside
			className={
				toggleButtons[side] ? `${style.asideOpened}` : `${style.asideClosed}`
			}
		>
			<div className={style.toggleButtonContainer}>
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
