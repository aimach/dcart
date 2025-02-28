// import des bibliothèques
import { Link } from "react-router";
// import du style
import style from "./buttonComponent.module.scss";

interface ButtonComponentProps {
	type: "route" | "button";
	color: "gold" | "brown";
	textContent: string;
	onClickFunction?: () => void;
	link?: string;
}

/**
 * Composant bouton
 * @param {string} type - Type de bouton (route ou button)
 * @param {string} color - Couleur du bouton (gold ou brown)
 * @param {string} textContent - Texte du bouton
 * @param {function} onClickFunction - Fonction à exécuter au clic
 * @param {string} link - Si de type "route", lien vers lequel rediriger
 */
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
