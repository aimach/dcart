// import des bibliothèques
import { useContext, useState } from "react";
import { Link } from "react-router";
// import du context
import { TranslationContext } from "../../context/TranslationContext";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { NavList } from "../../utils/types/commonTypes";
// import du style
import style from "./appMenuComponent.module.scss";
// import des icones
import { X } from "lucide-react";

interface AppMenuComponentProps {
	setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AppMenuComponent = ({ setMenuIsOpen }: AppMenuComponentProps) => {
	// on importe les données de language
	const { language, translation } = useContext(TranslationContext);

	// on initie un state pour le style des éléments du menu
	const [isLongLine, setIsLongLine] = useState<{ [key: string]: boolean }>({
		home: false,
		maps: false,
		storymaps: false,
	});

	const handleLine = (id: string, boolean) => {
		const newObject = { ...isLongLine, [id]: boolean };
		setIsLongLine(newObject);
	};

	const navigationList: NavList = [
		{
			id: "home",
			title: translation[language].navigation.home,
			onClickFunction: undefined,
			route: "/",
		},
		{
			id: "maps",
			title: translation[language].navigation.maps,
			onClickFunction: undefined,
			route: "maps/categories",
		},
		{
			id: "storymaps",
			title: translation[language].navigation.storymaps,
			onClickFunction: undefined,
			route: "/storymaps",
		},
	];

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
				</p>
			</section>
			<section className={style.menuPageImageSection}>
				<X onClick={() => setMenuIsOpen(false)} />
			</section>
			<div className={style.menuPageMenuSectionBackground} />
		</main>
	);
};

export default AppMenuComponent;
