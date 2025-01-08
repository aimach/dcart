// import des bibliothèques
import { Outlet } from "react-router";
// import des composants
import HeaderComponent from "../components/header/Header";

const NavigationLayout = () => {
	return (
		<div>
			<HeaderComponent />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default NavigationLayout;
