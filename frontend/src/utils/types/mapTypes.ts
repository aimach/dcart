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
		name_fr: string;
		name_en: string;
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
};

type MapInfoType = {
	id?: string;
	name_en: string;
	name_fr: string;
	description_en: string;
	description_fr: string;
	category: string | CategoryType;
	attestationIds: string;
	filters?: Record<string, string>[];
};

type MapType = {
	id: string;
	name_fr: string;
	name_en: string;
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
	filters: FilterType[];
};

type MenuTabType = "results" | "filters" | "infos";

type ParsedPointType = {
	latitude: number;
	longitude: number;
	great_region: string;
	sub_region: string;
	language: string;
	post_quem: number;
	ante_quem: number;
	formula: string;
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
};
