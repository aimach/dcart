// import des bibliothèques
import { Outlet } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";
// import du style
import style from "./layout.module.scss";

const NavigationLayout = () => {
	return (
		<div className={style.layout}>
			<HeaderComponent />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default NavigationLayout;
