// import des bibliothèques
import { Link } from "react-router";
// import du style
import style from "./buttonComponent.module.scss";

interface ButtonComponentProps {
	type: "route" | "button" | "submit";
	color: "gold" | "brown" | "red" | "blue" | "green";
	textContent: string;
	onClickFunction?: () => void;
	link?: string;
	isSelected?: boolean;
	icon?: React.ReactNode;
	isDisabled?: boolean;
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
 * @param {isDisabled} isDisabled - Si le bouton est désactivé
 */
const ButtonComponent = ({
	type,
	color,
	textContent,
	onClickFunction,
	link,
	isSelected = true,
	icon,
	isDisabled = false,
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
				disabled={isDisabled}
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
				disabled={isDisabled}
				onClick={onClickFunction}
				className={`${style.simpleButton} ${isSelected ? style[color] : style.unselected}`}
			>
				{icon ?? ""} {textContent}
			</button>
		);
	}
};

export default ButtonComponent;
