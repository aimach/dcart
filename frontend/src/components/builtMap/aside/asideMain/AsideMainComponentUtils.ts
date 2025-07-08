// import des services
import {
	getAllAgentActivityFromPoints,
	getAllAgentGenderFromPoints,
	getAllAgentivityFromPoints,
	getAllAgentStatusFromPoints,
	getAllLocationsFromPoints,
	getAllSourceMaterialFromPoints,
	getAllSourceTypeFromPoints,
	getMinAndMaxElementNb,
	isSelectedFilterInThisMap,
} from "../../../../utils/functions/filter";
// import des types
import type { MapInfoType, PointType } from "../../../../utils/types/mapTypes";
import type { Language } from "../../../../utils/types/languageTypes";

const getSourceTypeOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
	language: Language,
) => {
	const sourceTypeFilter = isSelectedFilterInThisMap(mapInfos, "sourceType");
	if (sourceTypeFilter) {
		// récupération de toutes les sources depuis la liste des points
		return getAllSourceTypeFromPoints(allPoints, language);
	}
	return [];
};

const getLocationOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
	language: Language,
) => {
	const locationFilter = isSelectedFilterInThisMap(mapInfos, "location");
	if (locationFilter) {
		// récupération de toutes les localités depuis la liste des points
		let value = "grande_region_id";
		let label = `grande_region_${language}`;
		if (locationFilter.options?.solution === "subRegion") {
			value = "sous_region_id";
			label = `sous_region_${language}`;
		} else if (locationFilter.options?.solution === "location") {
			value = "nom_ville";
			label = "nom_ville";
		}
		const allLocationsFromPoints: Record<string, string>[] =
			getAllLocationsFromPoints(allPoints, label);

		// formattage des options pour le select
		return allLocationsFromPoints
			.map((option) => ({
				value: option[value],
				label: option[label],
			}))
			.sort((option1, option2) =>
				option1.label < option2.label
					? -1
					: option1.label > option2.label
						? 1
						: 0,
			);
	}
	return [];
};

const getAgentActivityOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
	language: Language,
) => {
	const agentActivityFilter = isSelectedFilterInThisMap(
		mapInfos,
		"agentActivity",
	);
	if (agentActivityFilter) {
		return getAllAgentActivityFromPoints(allPoints, language);
	}
	return [];
};

const getAgentStatusOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
	language: Language,
) => {
	const agentActivityFilter = isSelectedFilterInThisMap(
		mapInfos,
		"agentStatus",
	);
	if (agentActivityFilter) {
		return getAllAgentStatusFromPoints(allPoints, language);
	}
	return [];
};

const getAgentivityOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
	language: Language,
) => {
	const agentivityFilter = isSelectedFilterInThisMap(mapInfos, "agentivity");
	if (agentivityFilter) {
		return getAllAgentivityFromPoints(allPoints, language);
	}
	return [];
};

const getSourceMaterialOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
	language: Language,
) => {
	const sourceMaterialFilter = isSelectedFilterInThisMap(
		mapInfos,
		"sourceMaterial",
	);
	if (sourceMaterialFilter) {
		return getAllSourceMaterialFromPoints(allPoints, language);
	}
	return [];
};

const getGenderOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
) => {
	const sourceMaterialFilter = isSelectedFilterInThisMap(
		mapInfos,
		"agentGender",
	);
	if (sourceMaterialFilter) {
		return getAllAgentGenderFromPoints(allPoints);
	}
	return [];
};

const getElementNbOptions = (
	mapInfos: MapInfoType | null,
	allPoints: PointType[],
) => {
	const sourceMaterialFilter = isSelectedFilterInThisMap(
		mapInfos,
		"divinityNb",
	);
	if (sourceMaterialFilter) {
		return getMinAndMaxElementNb(allPoints);
	}
	return [];
};

export {
	getSourceTypeOptions,
	getLocationOptions,
	getAgentActivityOptions,
	getAgentStatusOptions,
	getAgentivityOptions,
	getSourceMaterialOptions,
	getGenderOptions,
	getElementNbOptions,
};
