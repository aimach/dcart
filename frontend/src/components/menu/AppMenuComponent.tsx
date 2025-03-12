// import des bibliothèques
import { useState } from "react";
import { Link } from "react-router";
// import des composants
import ImageWithLink from "../common/ImageWithLink";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { getMenuPageMenuList } from "../../utils/menu/menuListArrays";
// import des types
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./appMenuComponent.module.scss";
// import des icones et images
import { X } from "lucide-react";
import labexLogo from "../../assets/logo_SMS.png";
import HNLogo from "../../assets/huma_num_logo.png";
import mapLogo from "../../assets/map_logo.png";

interface AppMenuComponentProps {
	setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Composant du menu de l'application
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.setMenuIsOpen - La fonction pour ouvrir/fermer le menu
 * @returns ImageWithLink
 */
const AppMenuComponent = ({ setMenuIsOpen }: AppMenuComponentProps) => {
	// import des données de traduction
	const { language, translation } = useTranslation();

	// récupération des éléments de navigation
	const navigationList = getMenuPageMenuList(translation, language);

	// déclaration d'un état pour le style des éléments du menu
	const [isLongLine, setIsLongLine] = useState<Record<string, boolean>>({
		home: false,
		maps: false,
		storymaps: false,
	});

	// fonction pour modifier le style des éléments survolés
	const handleLine = (id: string, boolean: boolean) => {
		const newObject = { ...isLongLine, [id]: boolean };
		setIsLongLine(newObject);
	};

	return (
		<main className={style.menuPageContainer}>
			<section className={style.menuPageMenuSection}>
				<nav className={style.menuPageMenu}>
					<ul>
						{navigationList.map((element) => (
							<li
								key={element.title as string}
								onMouseEnter={() => handleLine(element.id, true)}
								onMouseLeave={() => handleLine(element.id, false)}
							>
								<div
									className={
										isLongLine[element.id]
											? style.goldenLineLong
											: style.goldenLineShort
									}
								/>
								<Link
									to={element.route as string}
									onClick={() => setMenuIsOpen(false)}
								>
									{element.title as string}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est
					possimus, accusantium iusto corporis laboriosam consectetur nihil
					dignissimos quasi quidem tempore sit, tempora accusamus expedita eum
					architecto eligendi quos rem assumenda. Lorem ipsum dolor sit amet
					consectetur, adipisicing elit. Asperiores cupiditate distinctio
					adipisci quod amet, deleniti maxime dolorum suscipit vel voluptatibus.
					Dolorem eaque est quam atque eligendi error. Excepturi, nemo fugit.
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel,
					dignissimos rem. Odit, odio possimus illum nobis cum ex id porro atque
					fugiat recusandae magni voluptates debitis, perspiciatis autem quaerat
					voluptatum?
				</p>
				<section className={style.menuPageLogoSection}>
					<ImageWithLink
						type="link"
						link="https://sms.univ-tlse2.fr/"
						imgSrc={labexLogo}
						imgAlt="labex logo"
						imgWidth={100}
					/>
					<ImageWithLink
						type="link"
						link="https://www.huma-num.fr/"
						imgSrc={HNLogo}
						imgAlt="huma-num logo"
						imgWidth={100}
					/>
					<ImageWithLink
						type="link"
						link="https://map-polytheisms.huma-num.fr/"
						imgSrc={mapLogo}
						imgAlt="erc map logo"
						imgWidth={100}
					/>
				</section>
			</section>
			<section className={style.menuPageImageSection}>
				<X onClick={() => setMenuIsOpen(false)} />
			</section>
			<div className={style.menuPageMenuSectionBackground} />
		</main>
	);
};

export default AppMenuComponent;
