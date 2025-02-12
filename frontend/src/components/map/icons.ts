import L from "leaflet";

const getLittleIcon = (
	style: CSSModuleClasses,
	customClassName: string,
	content: string,
) => {
	return L.divIcon({
		className: `${style.circleBrownIcon} ${style[customClassName]}`,
		html: `<div style="display:flex; justify-content:center; align-items:center; width: 25px; height: 25px; color: #DED6CE">${content}</div>`,
		iconSize: [30, 30], // Dimensions du conteneur
		iconAnchor: [15, 15], // Centre du marqueur
	});
};

const getMediumIcon = (
	style: CSSModuleClasses,
	customClassName: string,
	content: string,
) => {
	return L.divIcon({
		className: `${style.circleBrownIcon} ${style[customClassName]}`,
		html: `<div style="display:flex; justify-content:center; align-items:center; width: 35px; height: 35px; color: #DED6CE">${content}</div>`,
		iconSize: [40, 40], // Dimensions du conteneur
		iconAnchor: [20, 20], // Centre du marqueur
	});
};

const getDarkIcon = (
	style: CSSModuleClasses,
	customClassName: string,
	content: string,
) => {
	return L.divIcon({
		className: `${style.circleBrownIcon} ${style[customClassName]}`,
		html: `<div style="display:flex; justify-content:center; align-items:center; width: 45px; height: 45px; color: #DED6CE">${content}</div>`,
		iconSize: [50, 50], // Dimensions du conteneur
		iconAnchor: [25, 25], // Centre du marqueur
	});
};

// utilisée pour définir la taille de l'icone en fonction du nombre de sources
const getIcon = (
	sourcesNb: number,
	style: CSSModuleClasses,
	customClassName: string,
	content: string,
) => {
	if (sourcesNb < 10) {
		return getLittleIcon(style, customClassName, content);
	}
	if (sourcesNb >= 10 && sourcesNb < 50) {
		return getMediumIcon(style, customClassName, content);
	}
	if (sourcesNb >= 50) {
		return getDarkIcon(style, customClassName, content);
	}
	return getLittleIcon(style, customClassName, content);
};

export { getIcon };
