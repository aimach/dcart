// import des types
import type { OptionType } from "./commonTypes";

type AgentType = {
	genres: [
		{
			nom_en: string;
			nom_fr: string;
		},
	];
	activite_id: number;
	activite_en: string;
	activite_fr: string;
	designation: string;
};

type AttestationType = {
	agents: AgentType[] | null;
	nom_en: string;
	nom_fr: string;
	formule: string;
	elements: ElementType[];
	attestation_id: number;
	translitteration: string;
	extrait_avec_restitution: string;
};

type TagType = {
	id: string;
	name_fr: string;
	name_en: string;
	description_fr?: string;
	description_en?: string;
	maps: {
		id: string;
		title_fr: string;
		title_en: string;
		locationType: string;
	}[];
};

type DivinityListType = { divinity_list: string };

type DivinityType = {
	id: number;
	nom_fr: string;
	nom_en: string;
};

type ElementType = {
	element_id: number;
	etat_absolu: string;
	element_nom_en: string;
	element_nom_fr: string;
};

type GreatRegionType = {
	id: number;
	nom_fr: string;
	nom_en: string;
};

type MapFilterType = {
	location: boolean;
	language: boolean;
	element: boolean;
	divinityNb: boolean;
	sourceType: boolean;
};

type MapInfoType = {
	id?: string;
	title_en: string;
	title_fr: string;
	description_en: string;
	description_fr: string;
	image_url?: string;
	tags: string | TagType[];
	attestations: PointSetType[];
	filterMapContent?: FilterMapContentType[];
	isLayered: boolean;
	isNbDisplayed: boolean;
	divinity_in_chart: boolean;
};

type MapType = {
	id: string;
	title_fr: string;
	title_en: string;
	description_fr: string;
	description_en: string;
	elementNb: number;
	elementOperator: string;
	divinityNb: number;
	divinityOperator: string;
	locationType: string;
	locationId: number;
	ante: number;
	post: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	uploadPointsLastDate: string;
	divinity_in_chart: boolean;
	filters: {
		id: number;
		options: Record<string, string> | null;
		filter: { type: string };
	}[];
	category: TagType;
	creator?: {
		pseudo: string;
	};
	modifier?: {
		pseudo: string;
	};
	image_url?: string;
};

type MenuTabType = "results" | "filters" | "infos";

type ParsedPointType = {
	latitude: number;
	longitude: number;
	site: string;
	id: number;
};

type PointType = {
	key?: string;
	latitude: number;
	longitude: number;
	grande_region_id: string;
	grande_region_fr: string;
	grande_region_en: string;
	sous_region_id: string;
	sous_region_fr: string;
	sous_region_en: string;
	localisation_id: string;
	nom_ville: string;
	sources: SourceType[];
	selectedClassName?: string;
	isSelected?: boolean;
	color?: string;
	shape?: string;
	shapeCode?: string;
	layerName?: string;
};

type SourceType = {
	ante_quem: number;
	post_quem: number;
	source_id: number;
	support_en: string;
	support_fr: string;
	materiau_en: string;
	materiau_fr: string;
	type_source_fr: string[];
	type_source_en: string[];
	attestations: AttestationType[];
};

type TimeMarkersType = {
	post: number;
	ante: number;
};

type MapIconType = {
	id?: string;
	name_fr: string;
	name_en: string;
	svg_code: string;
};

type MapColorType = {
	id?: string;
	name_fr: string;
	name_en: string;
	code_hex: string;
};

type PointSetType = {
	id?: string;
	name: string;
	attestationIds: string;
	color?: MapColorType | string;
	icon?: MapIconType | string;
	mapId?: string;
	blockId?: string;
};

type FilterMapContentType = {
	id: string;
	filter: { type: string };
	options: {
		solution: string;
		checkbox?: {
			firstLevelIds: OptionType[];
			secondLevelIds: OptionType[];
		}[];
	} | null;
};

/**
 * Fonction pour déterminer si l'élément est de type MapType
 * @param {MapType | StorymapType} item - L'élément à vérifier
 * @returns boolean - true si l'élément est de type MapType, false sinon
 */
const isMapType = (item): item is MapType => {
	return (item as MapType).title_fr !== undefined;
};

export type {
	MapType,
	PointType,
	SourceType,
	AttestationType,
	AgentType,
	ElementType,
	MenuTabType,
	MapInfoType,
	GreatRegionType,
	DivinityType,
	TimeMarkersType,
	TagType,
	ParsedPointType,
	MapFilterType,
	MapIconType,
	PointSetType,
	MapColorType,
	FilterMapContentType,
	DivinityListType,
};

export { isMapType };
