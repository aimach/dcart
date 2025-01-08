import { Outlet } from "react-router";

const NavigationLayout = () => {
	return (
		<div>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default NavigationLayout;
