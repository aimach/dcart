// import des types
import type { NavList } from "../../types/commonTypes";

interface NavComponentProps {
	navClassName: string;
	list: NavList;
}

const NavComponent = ({ navClassName, list }: NavComponentProps) => {
	return (
		<nav className={navClassName}>
			<ul>
				{list.map((element) => (
					<li
						key={element.title}
						onClick={element.onClickFunction}
						onKeyUp={element.onClickFunction}
					>
						{element.title}
					</li>
				))}
			</ul>
		</nav>
	);
};

export default NavComponent;
