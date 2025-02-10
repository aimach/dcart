// import du style
import { Link } from "react-router";
import style from "./buttonComponent.module.scss";

interface ButtonComponentProps {
	type: "route" | "button";
	color: "gold" | "brown";
	textContent: string;
	onClickFunction?: () => void;
	link?: string;
}

const ButtonComponent = ({
	type,
	color,
	textContent,
	onClickFunction,
	link,
}: ButtonComponentProps) => {
	return type === "route" ? (
		<Link
			to={link as string}
			className={`${style.simpleButton} ${style[color]}`}
		>
			{textContent}
		</Link>
	) : (
		<button
			type="button"
			onClick={onClickFunction}
			className={`${style.simpleButton} ${style[color]}`}
		>
			{textContent}
		</button>
	);
};

export default ButtonComponent;
