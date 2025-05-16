// import des bibliothèques
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
// import des composants
import ImageWithLink from "../common/ImageWithLink";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
// import des services
import { getTranslations } from "../../utils/api/translationAPI";
import { getAllTags } from "../../utils/api/builtMap/getRequests";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { TagType } from "../../utils/types/mapTypes";
// import du style
import style from "./appMenuComponent.module.scss";
// import des icones et images
import { ChevronRightCircle, X } from "lucide-react";
import labexLogo from "../../assets/logo_SMS.png";
import HNLogo from "../../assets/huma_num_logo.png";
import mapLogo from "../../assets/map_logo.png";
import { shuffleArray } from "../../utils/functions/common";

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

	const navigate = useNavigate();

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

	const [tags, setTags] = useState<TagType[]>([]);
	useEffect(() => {
		const fetchAllTags = async () => {
			const fetchedTags = await getAllTags();
			const slicedTags = shuffleArray(fetchedTags).slice(0, 5); // Limiter à 5 tags
			setTags(slicedTags);
		};
		fetchAllTags();
	}, []);

	const closeMenuAndNavigate = (path: string) => {
		setMenuIsOpen(false);
		navigate(path);
	};

	return (
		<main className={style.menuPageContainer}>
			<section className={style.menuPageMenuSection}>
				{!isDesktop && <X onClick={() => setMenuIsOpen(false)} />}
				<nav className={style.menuPageMenu}>
					<ul>
						<li
							onClick={() => closeMenuAndNavigate("/map/exploration")}
							onKeyUp={() => closeMenuAndNavigate("/map/exploration")}
						>
							<ChevronRightCircle />
							{translation[language].navigation.explore}
						</li>
						{tags.map((tag) => {
							return (
								<li
									key={tag.id}
									onClick={() => closeMenuAndNavigate(`/tag/${tag.id}`)}
									onKeyUp={() => closeMenuAndNavigate(`/tag/${tag.id}`)}
								>
									<ChevronRightCircle />
									{tag[`name_${language}`]}
								</li>
							);
						})}
					</ul>
				</nav>
				<p>{menuPageContent}</p>
				<section className={style.menuPageLogoSection}>
					<ImageWithLink
						type="link"
						link="https://sms.univ-tlse2.fr/"
						imgSrc={labexLogo}
						imgAlt="labex logo"
						imgWidth={isDesktop ? 100 : 70}
					/>
					<ImageWithLink
						type="link"
						link="https://www.huma-num.fr/"
						imgSrc={HNLogo}
						imgAlt="huma-num logo"
						imgWidth={isDesktop ? 100 : 70}
					/>
					<ImageWithLink
						type="link"
						link="https://map-polytheisms.huma-num.fr/"
						imgSrc={mapLogo}
						imgAlt="erc map logo"
						imgWidth={isDesktop ? 100 : 70}
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
		</main>
	);
};

export default AppMenuComponent;
