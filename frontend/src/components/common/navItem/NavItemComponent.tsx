// import des biblio
import { useContext, useState } from "react";
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

/**
 *
 * @param param0
 * @returns
 */
const NavItemComponent = ({
	title,
	description,
	link,
}: NavItemComponentProps) => {
	// on récupère les données de la langue
	const { language, translation } = useContext(TranslationContext);

	// on initie un state pour la gestion de la description
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
