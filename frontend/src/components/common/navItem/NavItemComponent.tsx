// import des biblio
import { useState } from "react";
import { Link } from "react-router";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du style
import style from "./navItemComponent.module.scss";

interface NavItemComponentProps {
	title: string;
	description: string;
	link: string;
}

/**
 * Renvoie un élément de navigation avec une description
 * @param {string} title - Le titre de l'élément
 * @param {string} description - La description de l'élément
 * @param {string} link - Le lien vers une page
 */
const NavItemComponent = ({
	title,
	description,
	link,
}: NavItemComponentProps) => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// déclaration d'un état pour la gestion de la description
	const [displayDescription, setDisplayDescription] = useState<boolean>(false);

	const shortDescription = `${description.slice(0, 50)}...`;

	return (
		<Link to={link}>
			{displayDescription ? (
				<div
					className={style.navItem}
					onMouseEnter={() => setDisplayDescription(false)}
					onMouseLeave={() => setDisplayDescription(false)}
				>
					<h4>{title.toUpperCase()}</h4>
					<p>{description}</p>
				</div>
			) : (
				<div
					className={style.navItem}
					onMouseEnter={() => setDisplayDescription(true)}
				>
					<h4>{title.toUpperCase()}</h4>
					<p>{shortDescription}</p>
				</div>
			)}
			{translation[language].navigation.explore}
		</Link>
	);
};

export default NavItemComponent;
