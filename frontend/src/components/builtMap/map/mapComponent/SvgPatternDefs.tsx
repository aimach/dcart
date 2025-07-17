import { useEffect } from "react";

const SvgPatternDefs = () => {
	useEffect(() => {
		const svg = document.querySelector(".leaflet-overlay-pane svg");
		if (!svg) return;

		const existingDefs = svg.querySelector("defs");
		if (existingDefs) return;

		const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		defs.innerHTML = `
      <pattern id="pattern-stripes" patternUnits="userSpaceOnUse" width="6" height="6">
        <path d="M0,0 l6,6" stroke="black" stroke-width="1" />
      </pattern>
      <pattern id="pattern-dots" patternUnits="userSpaceOnUse" width="6" height="6">
        <circle cx="3" cy="3" r="1.5" fill="black" />
      </pattern>
      <pattern id="pattern-cross" patternUnits="userSpaceOnUse" width="6" height="6">
        <path d="M0,3h6M3,0v6" stroke="black" stroke-width="1" />
      </pattern>
    `;
		svg.prepend(defs);
	}, []);

	return null;
};

export default SvgPatternDefs;
