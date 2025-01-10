// import des types
import { Link } from "react-router";
import type { NavList } from "../../types/commonTypes";

interface NavComponentProps {
	type: string;
	navClassName: string;
	list: NavList;
}

const NavComponent = ({ type, navClassName, list }: NavComponentProps) => {
	return (
		<nav className={navClassName}>
			<ul>
				{list.map((element) =>
					type === "route" ? (
						<Link key={element.title as string} to={element.route as string}>
							{element.title as string}
						</Link>
					) : (
						<li
							key={element.title as string}
							onClick={element.onClickFunction}
							onKeyUp={element.onClickFunction}
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
