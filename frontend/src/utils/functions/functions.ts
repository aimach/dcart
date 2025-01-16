// utilisé pour définir la couleur du background pour les markers en fonction du nombre de sources
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

const getIconSize = (sourcesNb: number) => {
	if (sourcesNb < 10) {
		return 20;
	}
	if (sourcesNb >= 10 && sourcesNb < 50) {
		return 30;
	}
	if (sourcesNb >= 50) {
		return 40;
	}
	return 20;
};

export { getBackGroundColorClassName, getIconSize };
