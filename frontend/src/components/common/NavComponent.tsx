// import des bibliothèques
import { NavLink } from "react-router";
// import des types
import type { NavList } from "../../utils/types/commonTypes";

interface NavComponentProps {
	type: "route" | "list";
	navClassName: string;
	list: NavList;
	selectedElement?: string;
	liClasseName?: string;
	activeLinkClassName?: string;
	notActiveLinkClassName?: string;
}

const NavComponent = ({
	type,
	navClassName,
	list,
	selectedElement,
	liClasseName,
	activeLinkClassName,
	notActiveLinkClassName,
}: NavComponentProps) => {
	return (
		<nav className={navClassName}>
			<ul>
				{list.map((element) =>
					type === "route" ? (
						<NavLink
							key={element.title as string}
							to={element.route as string}
							className={({ isActive }) =>
								isActive ? activeLinkClassName : notActiveLinkClassName
							}
						>
							{element.title as string}
						</NavLink>
					) : (
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
					),
				)}
			</ul>
		</nav>
	);
};

export default NavComponent;
