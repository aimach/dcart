// import du style
import style from "./asideButton.module.scss";

interface AsideButtonProps {
	side: "Left" | "Right";
	toggleButtons: { [key: string]: boolean };
	setToggleButtons: (toggleButtons: { [key: string]: boolean }) => void;
}

const AsideButton = ({
	side,
	toggleButtons,
	setToggleButtons,
}: AsideButtonProps) => {
	return (
		<div className={style.toggleButtonContainer}>
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
		</div>
	);
};

export default AsideButton;
