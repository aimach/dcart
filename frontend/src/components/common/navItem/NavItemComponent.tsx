// import des biblio
import { useContext } from "react";
import { Link } from "react-router";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import du style
import style from "./navItemComponent.module.scss";

interface NavItemComponentProps {
	title: string;
	description: string;
	link: string;
}

const NavItemComponent = ({
	title,
	description,
	link,
}: NavItemComponentProps) => {
	// on récupère les données de la langue
	const { language, translation } = useContext(TranslationContext);

	return (
		<div>
			<h4>{title.toLowerCase()}</h4>
			<p>{description}</p>
			<Link to={link}>{translation[language].navigation.explore}</Link>
		</div>
	);
};

export default NavItemComponent;
