// import des bibliothèques
import L from "leaflet";
import tinycolor from "tinycolor2";
// import des types
import type { PointType } from "../types/mapTypes";

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
		iconSize: [8, 8], // Dimensions du conteneur
		iconAnchor: [4, 4], // Centre du marqueur
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

const getCircleIcon = (sourcesNb: number, color: string) => {
	const customColor = getColorDependingOnNb(sourcesNb, color);
	const customSize = getShapeDependingOnNb(sourcesNb);
	const customTextColor = tinycolor(customColor).isDark() ? "white" : "black";
	return `
    <svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill=${customColor} stroke="#ffffff" stroke-width="5" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill=${customTextColor} font-family="Arial, sans-serif">
        ${sourcesNb.toString()}
      </text>
    </svg>
  `;
};

const getSquareIcon = (sourcesNb: number, color: string) => {
	const customColor = getColorDependingOnNb(sourcesNb, color);
	const customSize = getShapeDependingOnNb(sourcesNb);
	const customTextColor = tinycolor(customColor).isDark() ? "white" : "black";
	return `
    <svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
      <rect x="5" y="5" width="90" height="90" fill=${customColor} stroke="#ffffff" stroke-width="5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill=${customTextColor} font-family="Arial, sans-serif">
        ${sourcesNb.toString()}
      </text>
    </svg>
  `;
};

const getTriangleIcon = (sourcesNb: number, color: string) => {
	const customColor = getColorDependingOnNb(sourcesNb, color);
	const customSize = getShapeDependingOnNb(sourcesNb);
	const customTextColor = tinycolor(customColor).isDark() ? "white" : "black";
	return `
     <svg xmlns="http://www.w3.org/2000/svg" width=${customSize}  height=${customSize}  viewBox="0 0 100 100">
      <polygon points="50,10 90,90 10,90" fill=${customColor} stroke="#ffffff" stroke-width="5" />
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="35" fill=${customTextColor} font-family="Arial, sans-serif">
       ${sourcesNb.toString()}
      </text>
    </svg>
  `;
};

const getDiamondIcon = (sourcesNb: number, color: string) => {
	const customColor = getColorDependingOnNb(sourcesNb, color);
	const customSize = getShapeDependingOnNb(sourcesNb);
	const customTextColor = tinycolor(customColor).isDark() ? "white" : "black";

	return `<svg xmlns="http://www.w3.org/2000/svg" width=${customSize} height=${customSize} viewBox="0 0 100 100">
      <polygon 
        points="50,5 95,50 50,95 5,50" 
        fill=${customColor}
        stroke="#ffffff"
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
        ${sourcesNb.toString()}
      </text>
    </svg>
  `;
};

const getShapedDivContent = (
	shape: string,
	color: string,
	sourcesNb: number,
) => {
	switch (shape) {
		case "circle":
			return getCircleIcon(sourcesNb, color);
		case "square":
			return getSquareIcon(sourcesNb, color);
		case "triangle":
			return getTriangleIcon(sourcesNb, color);
		case "diamond":
			return getDiamondIcon(sourcesNb, color);

		default:
			return getCircleIcon(sourcesNb, color);
	}
};

const getIcon = (point: PointType, style: CSSModuleClasses) => {
	let customIcon = getDefaultIcon(
		point.sources.length,
		style,
		getBackGroundColorClassName(point.sources.length),
		point.sources.length.toString(),
	);
	if (point.shape && point.color) {
		customIcon = L.divIcon({
			html: getShapedDivContent(point.shape, point.color, point.sources.length),
			className: "",
			iconSize: [8, 8],
			iconAnchor: [16, 4],
		});
	}

	if (point.shape && !point.color) {
		customIcon = L.divIcon({
			html: getShapedDivContent(point.shape, "#AD9A85", point.sources.length),
			className: "",
			iconSize: [8, 8],
			iconAnchor: [14, 4],
		});
	}
	return customIcon;
};

const getColorDependingOnNb = (sourcesNb: number, color: string) => {
	let customColor = color;
	if (sourcesNb >= 10 && sourcesNb < 50) {
		customColor = tinycolor(color).darken(10).toString();
	} else if (sourcesNb >= 50) {
		customColor = tinycolor(color).darken(20).toString();
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

export {
	getIcon,
	getBackGroundColorClassName,
	getLittleCircleIcon,
	getShapedDivContent,
};
