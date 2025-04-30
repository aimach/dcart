// import des bibliothèques
import { Link } from "react-router";
// import du style
import style from "./buttonComponent.module.scss";

interface ButtonComponentProps {
	type: "route" | "button" | "submit";
	color: "gold" | "brown" | "red";
	textContent: string;
	onClickFunction?: () => void;
	link?: string;
	isSelected?: boolean;
	icon?: React.ReactNode;
}

/**
 * Composant bouton
 * @param {string} type - Type de bouton (route ou button)
 * @param {string} color - Couleur du bouton (gold ou brown)
 * @param {string} textContent - Texte du bouton
 * @param {function} onClickFunction - Fonction à exécuter au clic
 * @param {string} link - Si de type "route", lien vers lequel rediriger
 * @param {boolean} isSelected - Si le bouton est sélectionné
 * @param {string} icon - Icône à afficher dans le bouton (optionnel)
 */
const ButtonComponent = ({
	type,
	color,
	textContent,
	onClickFunction,
	link,
	isSelected = true,
	icon,
}: ButtonComponentProps) => {
	if (type === "route") {
		return (
			<Link
				to={link as string}
				className={`${style.simpleButton} ${isSelected ? style[color] : style.unselected}`}
			>
				{textContent}
			</Link>
		);
	}

	if (type === "button") {
		return (
			<button
				type="button"
				onClick={onClickFunction}
				className={`${style.simpleButton} ${isSelected ? style[color] : style.unselected}`}
			>
				{icon ?? ""} {textContent}
			</button>
		);
	}

	if (type === "submit") {
		return (
			<button
				type="submit"
				onClick={onClickFunction}
				className={`${style.simpleButton} ${isSelected ? style[color] : style.unselected}`}
			>
				{icon ?? ""} {textContent}
			</button>
		);
	}
};

export default ButtonComponent;
