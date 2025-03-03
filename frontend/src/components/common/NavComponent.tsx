// import des bibliothèques
import { NavLink } from "react-router";
// import des composants
import NavItemComponent from "./navItem/NavItemComponent";
// import des types
import type { NavList } from "../../utils/types/commonTypes";

interface NavComponentProps {
	type: "route" | "list" | "augmented";
	navClassName: string;
	list: NavList;
	selectedElement?: string;
	liClasseName?: string;
	activeLinkClassName?: string;
	notActiveLinkClassName?: string;
}

/**
 * Composant de navigation
 * @param {string} type - le type de navigation à afficher (route, list, augmented)
 * @param {string} navClassName - la classe CSS du composant
 * @param {NavList} list - la liste des éléments à afficher
 * @param {string} selectedElement - l'élément sélectionné
 * @param {string} liClasseName - la classe CSS des éléments de la liste (li)
 * @param {string} activeLinkClassName - la classe CSS des liens actifs
 * @param {string} notActiveLinkClassName - la classe CSS des liens non actifs
 * @returns NavLink | li
 */
const NavComponent = ({
	type,
	navClassName,
	list,
	selectedElement,
	liClasseName,
	activeLinkClassName,
	notActiveLinkClassName,
}: NavComponentProps) => {
	if (type === "route") {
		return (
			<nav className={navClassName}>
				<ul>
					{list.map((element) => (
						<NavLink
							key={element.title as string}
							to={element.route as string}
							className={({ isActive }) =>
								isActive ? activeLinkClassName : notActiveLinkClassName
							}
						>
							{element.title as string}
						</NavLink>
					))}
				</ul>
			</nav>
		);
	}

	if (type === "list") {
		return (
			<nav className={navClassName}>
				<ul>
					{list.map((element) => (
						<li
							key={element.id as string}
							onClick={element.onClickFunction}
							onKeyUp={element.onClickFunction}
							className={
								selectedElement === element.id
									? liClasseName
									: notActiveLinkClassName
							}
						>
							{element.title as string}
						</li>
					))}
				</ul>
			</nav>
		);
	}

	if (type === "augmented") {
		return (
			<nav className={navClassName}>
				<ul>
					{list.map((element) => (
						<li
							key={element.id as string}
							onClick={element.onClickFunction}
							onKeyUp={element.onClickFunction}
							className={
								selectedElement === element.id
									? liClasseName
									: notActiveLinkClassName
							}
						>
							<NavItemComponent
								title={element.title as string}
								description={element.description as string}
								link={element.route as string}
							/>
						</li>
					))}
				</ul>
			</nav>
		);
	}
};

export default NavComponent;
