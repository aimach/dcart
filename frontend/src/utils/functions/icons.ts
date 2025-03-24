import L from "leaflet";

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
	customClassName: string,
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
	let classNameString = `${style[customClassName]}`;
	if (!backgroundColor && shape === "circle") {
		classNameString = `${style.circleBrownIcon} ${style[customClassName]}`;
	}
	const borderStyle =
		customClassName === "selectedBackgroundColor"
			? ""
			: "border: 1px solid black;";
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
	customClassName: string,
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
	let classNameString = `${style[customClassName]}`;
	if (!backgroundColor && shape === "circle") {
		classNameString = `${style.circleBrownIcon} ${style[customClassName]}`;
	}
	const borderStyle =
		customClassName === "selectedBackgroundColor"
			? ""
			: "border: 1px solid black;";
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
	customClassName: string,
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
	let classNameString = `${style[customClassName]}`;
	if (!backgroundColor && shape === "circle") {
		classNameString = `${style.circleBrownIcon} ${style[customClassName]}`;
	}
	const borderStyle =
		customClassName === "selectedBackgroundColor"
			? ""
			: "border: 1px solid black;";
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
const getIcon = (
	sourcesNb: number,
	style: CSSModuleClasses,
	customClassName: string,
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

export { getIcon, getBackGroundColorClassName, getLittleCircleIcon };
