// import des types
import type { FilterType } from "./filterTypes";

type AgentType = {
	genres: [
		{
			nom_en: string;
			nom_fr: string;
		},
	];
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

type CategoryType = {
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
};

type MapInfoType = {
	id?: string;
	title_en: string;
	title_fr: string;
	description_en: string;
	description_fr: string;
	image_url?: string;
	category: string | CategoryType;
	attestations: PointSetType[];
	filterMapContent?:
	Record<string, string>
	| Record<string, Record<string, string>[]>;
	isLayered: boolean;
	isNbDisplayed: boolean;
	relatedStorymap?: string;
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
	filters: {
		id: number;
		options: Record<string, string> | null;
		filter: { type: string };
	}[];
	category: CategoryType;
	creator: {
		pseudo: string;
	};
	modifier: {
		pseudo: string;
	};
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
}

type PointSetType = {
	id?: string;
	name: string;
	attestationIds: string;
	color?: { id: string; name_fr: string; name_en: string; code_hex: string } | string;
	icon?: { id: string; name_fr: string; name_en: string; svg_code: string } | string;
	mapId?: string;
	blockId?: string;
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
	CategoryType,
	ParsedPointType,
	MapFilterType,
	MapIconType,
	PointSetType,
	MapColorType
};
