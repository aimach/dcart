// import des bibliothèques
import L from "leaflet";
// import des types
import type { PointType } from "../types/mapTypes";
import type { MarkerOptions, Marker } from "leaflet";

interface CustomMarkerOptions extends MarkerOptions {
	colorAndShape?: {
		color: string;
		shape: string;
	};
}
import tinycolor from "tinycolor2";

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
	backgroundColor?: string,
	shape?: string,
) => {
	let backgroundColorStyle = "";
	if (customClassName !== "selectedBackgroundColor" && backgroundColor) {
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
	backgroundColor?: string,
	shape?: string,
) => {
	let backgroundColorStyle = "";
	let shapeStyle = "";
	if (customClassName !== "selectedBackgroundColor" && backgroundColor) {
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
	backgroundColor?: string,
	shape?: string,
) => {
	let backgroundColorStyle = "";
	let shapeStyle = "";
	if (customClassName !== "selectedBackgroundColor" && backgroundColor) {
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
	backgroundColor?: string,
	shape?: string,
) => {
	if (sourcesNb < 10) {
		return getLittleIcon(
			style,
			customClassName,
			content,
			backgroundColor,
			shape,
		);
	}
	if (sourcesNb >= 10 && sourcesNb < 50) {
		return getMediumIcon(
			style,
			customClassName,
			content,
			backgroundColor,
			shape,
		);
	}
	if (sourcesNb >= 50) {
		return getDarkIcon(style, customClassName, content, backgroundColor, shape);
	}
	return getLittleIcon(style, customClassName, content, backgroundColor, shape);
};

const getLittleCircleIcon = (style: CSSModuleClasses) => {
	return L.divIcon({
		className: style.littleCircle,
		iconSize: [8, 8],
		iconAnchor: [16, 4],
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
) => {
	return `
    <svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" ${customFillAndStroke} stroke-width="5" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill=${customTextColor} font-family="Arial, sans-serif">
        ${isNbDisplayed ? sourcesNb.toString() : ""}
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
) => {
	return `
    <svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
      <rect x="5" y="5" width="90" height="90" ${customFillAndStroke}
 stroke-width="5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill=${customTextColor} font-family="Arial, sans-serif">
        ${isNbDisplayed ? sourcesNb.toString() : ""}
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
) => {
	return `
     <svg xmlns="http://www.w3.org/2000/svg" width=${customSize}  height=${customSize}  viewBox="0 0 100 100">
      <polygon points="50,10 90,90 10,90" ${customFillAndStroke}
 stroke-width="5" />
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="35" fill=${customTextColor} font-family="Arial, sans-serif">
        ${isNbDisplayed ? sourcesNb.toString() : ""}
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
) => {
	return `<svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
      <polygon 
        points="50,5 95,50 50,95 5,50" 
        ${customFillAndStroke}}
        stroke-width="5"
      />
      <text 
        x="50%" 
        y="55%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-size="35" 
        fill=${customTextColor}
        font-family="Arial, sans-serif"
      >
        ${isNbDisplayed ? sourcesNb.toString() : ""}
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
) => {
	let customSize = getShapeDependingOnNb(sourcesNb);
	const customColor = getColorDependingOnNb(sourcesNb, color);
	let customFillAndStroke = `fill=${customColor} stroke=${tinycolor(customColor).darken(10).toString()}`;
	let customTextColor = tinycolor(customColor).isDark()
		? tinycolor(color).lighten(40).toString()
		: tinycolor(color).darken(40).toString();

	if (isSelected) {
		customFillAndStroke = `fill="white" stroke=${tinycolor(customColor).darken(10).toString()}`;
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
			);
		case "square":
			return getSquareIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
			);
		case "triangle":
			return getTriangleIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
			);
		case "diamond":
			return getDiamondIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
			);

		default:
			return getCircleIcon(
				sourcesNb,
				customFillAndStroke,
				customSize,
				customTextColor,
				isNbDisplayed,
			);
	}
};

const getIcon = (
	point: PointType,
	style: CSSModuleClasses,
	isSelected: boolean,
	isNbDisplayed: boolean,
) => {
	let customIcon = getDefaultIcon(
		point.sources.length,
		style,
		getBackGroundColorClassName(point.sources.length),
		point.sources.length.toString(),
	);
	if (point.shape && point.color) {
		customIcon = L.divIcon({
			html: getShapedDivContent(
				point.shape,
				point.color,
				point.sources.length,
				isSelected,
				isNbDisplayed,
			),
			className: "",
			iconSize: [8, 8],
			iconAnchor: [16, 4],
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
			),
			className: "",
			iconSize: [8, 8],
			iconAnchor: [16, 4],
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
	name: string,
	color: string | undefined,
) => {
	let defaultColor = color;
	if (!color) {
		defaultColor = "#AD9A85";
	}
	switch (shape) {
		case "circle":
			return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill=${defaultColor} stroke="lightgrey" stroke-width="5" /></svg> ${name}`;
		case "square":
			return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" fill=${defaultColor} stroke="lightgrey" stroke-width="5"/></svg> ${name}`;
		case "triangle":
			return `<svg xmlns="http://www.w3.org/2000/svg" width="20"  height="20"  viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill=${defaultColor} stroke="lightgrey" stroke-width="5" /></svg> ${name}`;
		case "diamond":
			return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill=${defaultColor} stroke="lightgrey" stroke-width="5"/></svg> ${name}`;
		default:
			return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill=${defaultColor} stroke="lightgrey" stroke-width="5" /></svg> ${name}`;
	}
};

const getBlendIcon = (markers: Marker[]): string | undefined => {
	const blendIcon: string[] = [];
	for (const marker of markers) {
		const color = (marker.options as CustomMarkerOptions).colorAndShape?.color;
		const shape = (marker.options as CustomMarkerOptions).colorAndShape?.shape;
		const customIcon = getShapeForLayerName(shape, "", color);
		blendIcon.push(customIcon);
	}

	return blendIcon.join("");
};

/**
 * Fonction donnée au composant MarkerCluster pour créer une icône personnalisée
 * @param {L.MarkerCluster} cluster - Le cluster
 * @returns
 */
const createClusterCustomIcon = (cluster) => {
	const markers = cluster.getAllChildMarkers();

	const blendIcon = getBlendIcon(markers);
	return L.divIcon({
		html: `<div class="marker-cluster-custom">${blendIcon}</div>`,
		className: "",
		iconSize: L.point(32, 32, true),
	});
};

export {
	getDefaultIcon,
	getIcon,
	getBackGroundColorClassName,
	getLittleCircleIcon,
	getShapedDivContent,
	getShapeForLayerName,
	getBlendIcon,
	createClusterCustomIcon,
};
