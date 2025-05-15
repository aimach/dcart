// import des bibliothèques
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
// import des composants
import ImageWithLink from "../common/ImageWithLink";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { getMenuPageMenuList } from "../../utils/menu/menuListArrays";
import { getTranslations } from "../../utils/api/translationAPI";
// import des types
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./appMenuComponent.module.scss";
// import des icones et images
import { X } from "lucide-react";
import labexLogo from "../../assets/logo_SMS.png";
import HNLogo from "../../assets/huma_num_logo.png";
import mapLogo from "../../assets/map_logo.png";
import { useWindowSize } from "../../utils/hooks/useWindowSize";

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

	const { isDesktop } = useWindowSize();

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

	const [databaseTranslation, setDatabaseTranslation] = useState<
		Record<string, string>[]
	>([]);
	useEffect(() => {
		const fetchDatabaseTranslation = async () => {
			const translations = await getTranslations();
			setDatabaseTranslation(translations);
		};
		fetchDatabaseTranslation();
	}, []);

	const menuPageContent = useMemo(() => {
		if (databaseTranslation?.length > 0) {
			const translationObject = databaseTranslation.find(
				(translation) => translation.language === language,
			) as { translations: Record<string, string> } | undefined;
			return translationObject?.translations["menu.description"];
		}
		return translation[language].menu.content;
	}, [databaseTranslation, language, translation]);

	return (
		<main className={style.menuPageContainer}>
			<section className={style.menuPageMenuSection}>
				{!isDesktop && <X onClick={() => setMenuIsOpen(false)} />}
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
				<p>{menuPageContent}</p>
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
				<section className={style.legalPageSection}>
					<Link to="/mentions-legales" onClick={() => setMenuIsOpen(false)}>
						Mentions légales
					</Link>
					<Link
						to="/politique-de-confidentialite"
						onClick={() => setMenuIsOpen(false)}
					>
						Politique de confidentialité
					</Link>
				</section>
				<p>© 2025 Projet dCART. Tous droits réservés.</p>
			</section>
			{isDesktop && (
				<section className={style.menuPageImageSection}>
					<X onClick={() => setMenuIsOpen(false)} />
				</section>
			)}

			<div className={style.menuPageMenuSectionBackground} />
		</main>
	);
};

export default AppMenuComponent;
