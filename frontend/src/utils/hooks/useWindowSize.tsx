import { useState, useEffect } from "react";

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
		isMobile: window.innerWidth < 768,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				...windowSize,
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
