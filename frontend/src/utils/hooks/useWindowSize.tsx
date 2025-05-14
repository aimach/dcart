import { useState, useEffect } from "react";

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
		isMobile: window.innerWidth < 481,
		isTablet: window.innerWidth <= 768 && window.innerWidth > 480,
		isDesktop: window.innerWidth > 768,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				isMobile: window.innerWidth < 481,
				isTablet: window.innerWidth <= 768 && window.innerWidth > 480,
				isDesktop: window.innerWidth > 768,
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener("resize", handleResize);
		// Appel initial pour synchroniser au montage
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowSize;
}
