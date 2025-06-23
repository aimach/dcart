// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
	const { pathname } = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: cette dépendance est nécessaire pour que l'effet se déclenche à chaque changement de chemin
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "auto" });
	}, [pathname]);

	return null;
};

export default ScrollToTop;
