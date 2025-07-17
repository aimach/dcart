// import des bibliothèques
import L from "leaflet";
import tinycolor from "tinycolor2";
// import des types
import type { PointType } from "../types/mapTypes";
import type { MarkerOptions, Marker, MarkerCluster } from "leaflet";

interface CustomMarkerOptions extends MarkerOptions {
	colorAndShape?: {
		color: string;
		shape: string;
	};
}

/**
 * Retourne une icone de taille petite
 * @param {CSSModuleClasses} style - Le fichier scss
 * @param {string} customClassName - La classe CSS personnalisée
 * @param content - Le contenu de l'icone (le nombre de sources)
 * @param {string} backgroundColor - La couleur de fond
 * @param {string} shape - La forme de l'icone
 * @returns {L.DivIcon}
 */
const getLittleIcon = (
	style: CSSModuleClasses,
	customClassName: string | null,
	content: string,
	hasGrayScale: boolean,
	backgroundColor?: string,
	shape?: string,
) => {
	let backgroundColorStyle = "";
	if (hasGrayScale) {
		backgroundColorStyle = `fillColor: 'url(#pattern-stripes)'`;
	} else if (customClassName !== "selectedBackgroundColor" && backgroundColor) {
		backgroundColorStyle = `background-color: ${backgroundColor};`;
	}
	let shapeStyle = "";
	if (shape === "circle") {
		shapeStyle = "border-radius: 50%;";
	}
	let classNameString = `${style[customClassName as string]}`;
	if (!backgroundColor && (shape === "circle" || !shape)) {
		classNameString = `${style.circleBrownIcon} ${style[customClassName as string]}`;
	}
	const borderStyle =
		backgroundColor && customClassName !== "selectedBackgroundColor"
			? "border: 1px solid black;"
			: "";
	return L.divIcon({
		className: classNameString,
		html: `<div style="display:flex; justify-content:center; align-items:center; width: 25px; height: 25px; color: #DED6CE; ${borderStyle} ${shapeStyle} ${backgroundColorStyle}">${content}</div>`,
		iconSize: [30, 30], // Dimensions du conteneur
		iconAnchor: [15, 15], // Centre du marqueur
	});
};

/**
 * Retourne une icone de taille moyenne
 * @param {CSSModuleClasses} style - Le fichier scss
 * @param {string} customClassName - La classe CSS personnalisée
 * @param content - Le contenu de l'icone (le nombre de sources)
 * @param {string} backgroundColor - La couleur de fond
 * @param {string} shape - La forme de l'icone
 * @returns {L.DivIcon}
 */
const getMediumIcon = (
	style: CSSModuleClasses,
	customClassName: string | null,
	content: string,
	hasGrayScale: boolean,
	backgroundColor?: string,
	shape?: string,
) => {
	let backgroundColorStyle = "";
	let shapeStyle = "";
	if (hasGrayScale) {
		backgroundColorStyle = `fillColor: 'url(#pattern-stripes)'`;
	} else if (customClassName !== "selectedBackgroundColor" && backgroundColor) {
		backgroundColorStyle = `background-color: ${backgroundColor};`;
	}
	if (shape === "circle") {
		shapeStyle = "border-radius: 50%;";
	}
	let classNameString = `${style[customClassName as string]}`;
	if (!backgroundColor && (shape === "circle" || !shape)) {
		classNameString = `${style.circleBrownIcon} ${style[customClassName as string]}`;
	}
	const borderStyle =
		backgroundColor && customClassName !== "selectedBackgroundColor"
			? "border: 1px solid black;"
			: "";
	return L.divIcon({
		className: classNameString,
		html: `<div style="display:flex; justify-content:center; align-items:center; width: 35px; height: 35px; color: #DED6CE; ${borderStyle} ${shapeStyle} ${backgroundColorStyle}">${content}</div>`,
		iconSize: [40, 40], // Dimensions du conteneur
		iconAnchor: [20, 20], // Centre du marqueur
	});
};

/**
 * Retourne une icone de taille grande
 * @param {CSSModuleClasses} style - Le fichier scss
 * @param {string} customClassName - La classe CSS personnalisée
 * @param content - Le contenu de l'icone (le nombre de sources)
 * @param {string} backgroundColor - La couleur de fond
 * @param {string} shape - La forme de l'icone
 * @returns {L.DivIcon}
 */
const getDarkIcon = (
	style: CSSModuleClasses,
	customClassName: string | null,
	content: string,
	hasGrayScale: boolean,
	backgroundColor?: string,
	shape?: string,
) => {
	let backgroundColorStyle = "";
	let shapeStyle = "";
	if (hasGrayScale) {
		backgroundColorStyle = `fillColor: 'url(#pattern-stripes)'`;
	} else if (customClassName !== "selectedBackgroundColor" && backgroundColor) {
		backgroundColorStyle = `background-color: ${backgroundColor};`;
	}
	if (shape === "circle") {
		shapeStyle = "border-radius: 50%;";
	}
	let classNameString = `${style[customClassName as string]}`;
	if (!backgroundColor && (shape === "circle" || !shape)) {
		classNameString = `${style.circleBrownIcon} ${style[customClassName as string]}`;
	}
	const borderStyle =
		backgroundColor && customClassName !== "selectedBackgroundColor"
			? "border: 1px solid black;"
			: "";
	return L.divIcon({
		className: classNameString,
		html: `<div style="display:flex; justify-content:center; align-items:center; width: 45px; height: 45px; color: #DED6CE;${borderStyle} ${shapeStyle} ${backgroundColorStyle}">${content}</div>`,
		iconSize: [50, 50], // Dimensions du conteneur
		iconAnchor: [25, 25], // Centre du marqueur
	});
};

/**
 * Retourne l'icone en fonction du nombre de sources
 * @param {number} sourcesNb - Le nombre de sources
 * @param {CSSModuleClasses} style - Le fichier scss
 * @param {string} customClassName - La classe CSS personnalisée
 * @param content - Le contenu de l'icone (le nombre de sources)
 * @param {string} backgroundColor - La couleur de fond
 * @param {string} shape - La forme de l'icone
 * @returns {L.DivIcon}
 */
const getDefaultIcon = (
	sourcesNb: number,
	style: CSSModuleClasses,
	customClassName: string | null,
	content: string,
	hasGrayScale: boolean,
	backgroundColor?: string,
	shape?: string,
) => {
	if (sourcesNb < 10) {
		return getLittleIcon(
			style,
			customClassName,
			content,
			hasGrayScale,
			backgroundColor,
			shape,
		);
	}
	if (sourcesNb >= 10 && sourcesNb < 50) {
		return getMediumIcon(
			style,
			customClassName,
			content,
			hasGrayScale,
			backgroundColor,
			shape,
		);
	}
	if (sourcesNb >= 50) {
		return getDarkIcon(
			style,
			customClassName,
			content,
			hasGrayScale,
			backgroundColor,
			shape,
		);
	}
	return getLittleIcon(
		style,
		customClassName,
		content,
		hasGrayScale,
		backgroundColor,
		shape,
	);
};

const getLittleCircleIcon = (style: CSSModuleClasses) => {
	return L.divIcon({
		className: style.littleCircle,
		iconSize: [8, 8],
		iconAnchor: [0, 0],
	});
};

// utilisée pour définir la couleur du background pour les markers en fonction du nombre de sources
const getBackGroundColorClassName = (sourcesNb: number) => {
	if (sourcesNb < 10) {
		return "lightBackgroundColor";
	}
	if (sourcesNb >= 10 && sourcesNb < 50) {
		return "mediumBackgroundColor";
	}
	if (sourcesNb >= 50) {
		return "darkBackgroundColor";
	}
	return "lightBackgroundColor";
};

const getCircleIcon = (
	sourcesNb: number,
	customFillAndStroke: string,
	customSize: number,
	customTextColor: string,
	isNbDisplayed: boolean,
	hasGrayScale: boolean,
	color: string,
	content?: string,
) => {
	const accessibleFillAndStroke = hasGrayScale
		? `fill="url(#pattern-${color})" stroke="black"`
		: customFillAndStroke;
	const accessibleTextColor = hasGrayScale ? "black" : customTextColor;
	const iconContent = isNbDisplayed
		? sourcesNb.toString()
		: content
			? content
			: "";
	return `
    <svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
	${hasGrayScale ? getPatternByColor(color) : ""}
      <circle cx="50" cy="50" r="45" ${accessibleFillAndStroke} stroke-width="5" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="50"  fill=${accessibleTextColor} >
        ${hasGrayScale ? "" : iconContent}
      </text>
    </svg>
  `;
};

const getSquareIcon = (
	sourcesNb: number,
	customFillAndStroke: string,
	customSize: number,
	customTextColor: string,
	isNbDisplayed: boolean,
	hasGrayScale: boolean,
	color: string,
	content?: string,
) => {
	const accessibleFillAndStroke = hasGrayScale
		? `fill="url(#pattern-${color})" stroke="black"`
		: customFillAndStroke;
	const accessibleTextColor = hasGrayScale ? "black" : customTextColor;
	const iconContent = isNbDisplayed
		? sourcesNb.toString()
		: content
			? content
			: "";
	return `
    <svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
		${hasGrayScale ? getPatternByColor(color) : ""}
      <rect x="5" y="5" width="90" height="90" ${accessibleFillAndStroke}
 stroke-width="5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="50"  fill=${accessibleTextColor} >
        ${hasGrayScale ? "" : iconContent}
      </text>
    </svg>
  `;
};

const getTriangleIcon = (
	sourcesNb: number,
	customFillAndStroke: string,
	customSize: number,
	customTextColor: string,
	isNbDisplayed: boolean,
	hasGrayScale: boolean,
	color: string,
	content?: string,
) => {
	const accessibleFillAndStroke = hasGrayScale
		? `fill="url(#pattern-${color})" stroke="black"`
		: customFillAndStroke;
	const accessibleTextColor = hasGrayScale ? "black" : customTextColor;
	const iconContent = isNbDisplayed
		? sourcesNb.toString()
		: content
			? content
			: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width=${customSize}  height=${customSize}  viewBox="0 0 100 100">
		${hasGrayScale ? getPatternByColor(color) : ""}
      <polygon points="50,10 90,90 10,90" ${accessibleFillAndStroke}
 stroke-width="5" />
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="50" fill=${accessibleTextColor}>
        ${hasGrayScale ? "" : iconContent}
      </text>
    </svg>
  `;
};

const getDiamondIcon = (
	sourcesNb: number,
	customFillAndStroke: string,
	customSize: number,
	customTextColor: string,
	isNbDisplayed: boolean,
	hasGrayScale: boolean,
	color: string,
	content?: string,
) => {
	const accessibleFillAndStroke = hasGrayScale
		? `fill="url(#pattern-${color})" stroke="black"`
		: customFillAndStroke;
	const accessibleTextColor = hasGrayScale ? "black" : customTextColor;
	const iconContent = isNbDisplayed
		? sourcesNb.toString()
		: content
			? content
			: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
		${hasGrayScale ? getPatternByColor(color) : ""}
      <polygon 
        points="50,5 95,50 50,95 5,50" 
        ${accessibleFillAndStroke}
        stroke-width="5"
      />
      <text 
        x="50%" 
        y="55%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-size="50" 
        fill=${accessibleTextColor} 
      >
	  	${hasGrayScale ? "" : iconContent}
      </text>
    </svg>
  `;
};

const getStarIcon = (
	sourcesNb: number,
	customFillAndStroke: string,
	customSize: number,
	customTextColor: string,
	isNbDisplayed: boolean,
	hasGrayScale: boolean,
	color: string,
	content?: string,
) => {
	const accessibleFillAndStroke = hasGrayScale
		? `fill="url(#pattern-${color})" stroke="black"`
		: customFillAndStroke;
	const accessibleTextColor = hasGrayScale ? "black" : customTextColor;
	const iconContent = isNbDisplayed
		? sourcesNb.toString()
		: content
			? content
			: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
	${hasGrayScale ? getPatternByColor(color) : ""}
	<defs>
		<filter id="blur" x="-5%" y = "-5%" width="110%" height="110%" >
			<feGaussianBlur in="SourceGraphic" stdDeviation = "0.5" />
				</filter>
				</defs>
				<path d="
				M60, 10
				L71, 42
				L105, 45
				L78, 65
				L87, 98
				L60, 80
				L33, 98
				L42, 65
				L15, 45
				L49, 42 
				Z"
        ${accessibleFillAndStroke}
        stroke-width="5"
      />
      <text 
        x="60" 
		y="60"
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-size="50" 
        fill=${accessibleTextColor}
      >
	  ${hasGrayScale ? "" : iconContent}
      </text>
    </svg>
  `;
};

const getShapedDivContent = (
	shape: string,
	color: string,
	sourcesNb: number,
	isSelected: boolean,
	isNbDisplayed: boolean,
	hasGrayScale: boolean,
	content?: string,
) => {
	let customSize = getShapeDependingOnNb(sourcesNb);
	const customColor = getColorDependingOnNb(sourcesNb, color);
	let customFillAndStroke = `fill=${customColor} stroke=${tinycolor(customColor).darken(10).toString()}`;
	let customTextColor = tinycolor(customColor).isDark() ? "white" : "black";

	if (isSelected) {
		customFillAndStroke = `fill="white" stroke-width="10" stroke=${tinycolor(customColor).darken(10).toString()}`;
		customTextColor = tinycolor(color).darken(40).toString();
	}
	customSize = 35;

	switch (shape) {
		case "circle":
			return getCircleIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
				hasGrayScale,
				color,
				content,
			);
		case "square":
			return getSquareIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
				hasGrayScale,
				color,
				content,
			);
		case "triangle":
			return getTriangleIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
				hasGrayScale,
				color,
				content,
			);
		case "diamond":
			return getDiamondIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
				hasGrayScale,
				color,
				content,
			);
		case "star":
			return getStarIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
				hasGrayScale,
				color,
				content,
			);

		default:
			return getCircleIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
				hasGrayScale,
				color,
				content,
			);
	}
};

const getIcon = (
	point: PointType,
	style: CSSModuleClasses,
	isSelected: boolean,
	isNbDisplayed: boolean,
	hasGrayScale: boolean,
	content?: string,
) => {
	let customIcon = getDefaultIcon(
		point.sources.length,
		style,
		getBackGroundColorClassName(point.sources.length),
		point.sources.length.toString(),
		hasGrayScale,
	);
	if (point.shape && point.color) {
		customIcon = L.divIcon({
			html: getShapedDivContent(
				point.shape,
				point.color,
				point.sources.length,
				isSelected,
				isNbDisplayed,
				hasGrayScale,
				content,
			),
			className: "",
			iconSize: [8, 8],
			iconAnchor: [16, 16],
		});
	}

	if (point.shape && !point.color) {
		customIcon = L.divIcon({
			html: getShapedDivContent(
				point.shape,
				"#AD9A85",
				point.sources.length,
				isSelected,
				isNbDisplayed,
				hasGrayScale,
				content,
			),
			className: "",
			iconSize: [8, 8],
			iconAnchor: [16, 16],
		});
	}
	return customIcon;
};

const getColorDependingOnNb = (sourcesNb: number, color: string) => {
	let customColor = color;
	if (sourcesNb >= 10 && sourcesNb < 50) {
		customColor = tinycolor(color).darken(10).toString();
	} else if (sourcesNb >= 50) {
		customColor = tinycolor(color).darken(15).toString();
	}
	return customColor;
};

const getShapeDependingOnNb = (sourcesNb: number): number => {
	let customSize = 32;
	if (sourcesNb >= 10 && sourcesNb < 50) {
		customSize = 40;
	} else if (sourcesNb >= 50) {
		customSize = 50;
	}
	return customSize;
};

const getShapeForLayerName = (
	shape: string | undefined,
	color: string | undefined,
	xAndY: string | undefined = "",
	isAddingWidthAndHeight = true,
) => {
	let defaultColor = color;
	if (!color) {
		defaultColor = "#AD9A85";
	}
	const size = isAddingWidthAndHeight ? 'width="20" height="20"' : "";
	switch (shape) {
		case "circle":
			return `<svg xmlns="http://www.w3.org/2000/svg" ${size} ${xAndY} viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill=${defaultColor} stroke="lightgrey" stroke-width="5" /></svg>`;
		case "square":
			return `<svg xmlns="http://www.w3.org/2000/svg" ${size} ${xAndY} viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" fill=${defaultColor} stroke="lightgrey" stroke-width="5"/></svg>`;
		case "triangle":
			return `<svg xmlns="http://www.w3.org/2000/svg" ${size} ${xAndY} viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill=${defaultColor} stroke="lightgrey" stroke-width="5" /></svg>`;
		case "diamond":
			return `<svg xmlns="http://www.w3.org/2000/svg" ${size} ${xAndY} viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill=${defaultColor} stroke="lightgrey" stroke-width="5"/></svg>`;
		case "star":
			return `<svg xmlns="http://www.w3.org/2000/svg" ${size} ${xAndY} viewBox="0 0 100 100"><defs><filter id="blur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/></filter></defs><path d="
			M60,10 
			L71,42 
			L105,45 
			L78,65 
			L87,98 
			L60,80 
			L33,98 
			L42,65 
			L15,45 
			L49,42 
			Z"
			fill=${defaultColor} stroke="lightgrey" stroke-width="5"  filter="url(#blur)" stroke-linejoin="round"/></svg>`;
		default:
			return `<svg xmlns="http://www.w3.org/2000/svg" ${size} ${xAndY} viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill=${defaultColor} stroke="lightgrey" stroke-width="5" /></svg>`;
	}
};

const getBlendIconHTML = (markers: Marker[]): string | undefined => {
	const markersColorsAndShapes = markers.map((marker) => {
		return (marker.options as CustomMarkerOptions).colorAndShape;
	});
	const uniqueMarkersColorsAndShapes = markersColorsAndShapes.filter(
		(marker, index) => {
			return (
				markersColorsAndShapes.findIndex(
					(m) => m?.color === marker?.color && m?.shape === marker?.shape,
				) === index
			);
		},
	);

	if (uniqueMarkersColorsAndShapes.length === 1) {
		const iconHTML =
			(markers[0].options.icon?.options as L.DivIconOptions)?.html ?? "";
		return iconHTML as string;
	}

	if (markers.length === 2 || uniqueMarkersColorsAndShapes.length === 2) {
		const uniqueMarkers = getUniqueMarkersByIcon(markers);
		let blendIcon = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" stroke="lightgrey" stroke-width="1"><clipPath id="left-half">
		<rect x="0" y="0" width="20" height="40" /></clipPath><clipPath id="right-half"><rect x="20" y="0" width="20" height="40" /></clipPath>`;
		for (let i = 0; i < 2; i++) {
			const side = i === 0 ? "left-half" : "right-half";
			const color = (uniqueMarkers[i].options as CustomMarkerOptions)
				.colorAndShape?.color;
			const shape = (uniqueMarkers[i].options as CustomMarkerOptions)
				.colorAndShape?.shape;
			const customIcon = getShapeForLayerName(shape, color, "", false);
			blendIcon += `<g clip-path="url(#${side})">${customIcon}</g>`;
		}
		return `${blendIcon}</svg>`;
	}

	if (markers.length > 2) {
		const markerColors = uniqueMarkersColorsAndShapes.map(
			(marker) => marker?.color ?? "",
		);
		const uniqueColors = [...new Set(markerColors)];
		return generateCamembertSVG(
			uniqueColors,
			uniqueMarkersColorsAndShapes as { color: string; shape: string }[],
		);
	}
};

/**
 * Fonction donnée au composant MarkerCluster pour créer une icône personnalisée
 * @param {L.MarkerCluster} cluster - Le cluster
 * @returns
 */
const createClusterCustomIcon = (cluster: MarkerCluster) => {
	const markers = cluster.getAllChildMarkers();

	const blendIcon = getBlendIconHTML(markers);
	return L.divIcon({
		html: `${blendIcon} `,
		className: "",
		iconSize: L.point(32, 32, true),
	});
};

/**
 * Fonction pour générer un SVG de camembert
 * @param {string[]} colors - Les couleurs des points
 * @param {number} size - La taille du SVG
 * @returns {string} - Le SVG généré
 */
function generateCamembertSVG(
	colors: string[],
	markersColorsAndShapes: {
		color: string;
		shape: string;
	}[],
	size = 35,
) {
	const cx = size / 2;
	const cy = size / 2;
	const radius = size / 2;
	const total =
		colors.length === 1 ? markersColorsAndShapes.length : colors.length;
	let angleStart = 0;
	let paths = "";
	const arrayForLoop = colors.length === 1 ? markersColorsAndShapes : colors;

	for (const color of arrayForLoop) {
		const angle = (2 * Math.PI) / total;
		const angleEnd = angleStart + angle;

		const x1 = cx + radius * Math.cos(angleStart);
		const y1 = cy + radius * Math.sin(angleStart);
		const x2 = cx + radius * Math.cos(angleEnd);
		const y2 = cy + radius * Math.sin(angleEnd);

		const largeArc = angle > Math.PI ? 1 : 0;

		const d = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

		paths += `<path d="${d}" fill="${colors.length === 1 ? (color as { color: string; shape: string }).color : color}" />`;

		angleStart = angleEnd;
	}

	return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" stroke="lightgrey" stroke-width="1" xmlns="http://www.w3.org/2000/svg">
      ${paths}
    </svg>
  `;
}

/**
 * Fonction pour obtenir un tableau de marqueurs uniques en fonction de leur icône
 * @param markers - Le tableau de marqueurs
 * @returns - Le tableau de marqueurs uniques
 */
const getUniqueMarkersByIcon = (markers: Marker[]) => {
	const seen = new Set();
	return markers.filter((marker) => {
		const iconHtml =
			((marker.options as CustomMarkerOptions).colorAndShape?.color ?? "") +
			((marker.options as CustomMarkerOptions).colorAndShape?.shape ?? "");
		if (seen.has(iconHtml)) return false;
		seen.add(iconHtml);
		return true;
	});
};

/**
 * Fonction pour obtenir un pattern en fonction de la couleur de l'icône
 * @param color - La couleur de l'icône
 * @returns - le code SVG du pattern
 */
const getPatternByColor = (color: string) => {
	switch (color) {
		case "#9F196B": // purple
			// diagonales
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><path d="M0,0 l25,25" stroke="black" stroke-width="3"/></pattern>`;
		case "#6BBADB": // blue
			// diagonales croisées
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><path d="M0,0 l25,25 M25,0 l-25,25" stroke="black" stroke-width="2"/></pattern>`;
		case "#7EB356": // green
			// petits cercles
			return `  <pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><circle cx="12" cy="12" r="5" fill="black"/></pattern>`;
		case "#FADF0F": // yellow
			// cadrillage
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><path d="M0,0H25V25H0Z" fill="none" stroke="black" stroke-width="2"/></pattern>`;
		case "#F3722C": // orange
			// petit cadrillage
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="25" height="25" fill="white"/><path d="M0,3h6M3,0v6" stroke="black" stroke-width="1"/></pattern>`;
		case "#AC2020": // red
			// "bulles"
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><circle cx="5" cy="5" r="8" fill="none" stroke="black" stroke-width="3"/></pattern>`;
		case "#525252": // gray
			// lignes horizontales
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><path d="M0,3h25" stroke="black" stroke-width="3"/></pattern>`;
		case "#AD9A85": // brown
			// lignes verticales
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><path d="M3,0v25" stroke="black" stroke-width="3"/></pattern>`;
		default:
			return `<pattern id="pattern-${color}" patternUnits="userSpaceOnUse" width="25" height="25"><rect width="25" height="25" fill="white"/><path d="M3,0v25" stroke="black" stroke-width="3"/></pattern>`;
	}
};

export {
	getDefaultIcon,
	getIcon,
	getBackGroundColorClassName,
	getLittleCircleIcon,
	getShapedDivContent,
	getShapeForLayerName,
	getBlendIconHTML,
	createClusterCustomIcon,
};
