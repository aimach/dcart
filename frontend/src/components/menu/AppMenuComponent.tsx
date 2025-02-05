// import des types
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./appMenuComponent.module.scss";
// import des icones
import { X } from "lucide-react";

interface AppMenuComponentProps {
	setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AppMenuComponent = ({ setMenuIsOpen }: AppMenuComponentProps) => {
	return (
		<main className={style.menuPageContainer}>
			<section className={style.menuPageMenuSection}>
				<div className={style.menuPageMenuSectionBackground} />
			</section>
			<section className={style.menuPageImageSection}>
				<X onClick={() => setMenuIsOpen(false)} />
			</section>
		</main>
	);
};

export default AppMenuComponent;
