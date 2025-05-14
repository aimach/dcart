import { useState, useEffect } from "react";

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
		isMobile: window.innerWidth < 768,
	});

	console.log(windowSize);

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				isMobile: window.innerWidth < 768,
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
