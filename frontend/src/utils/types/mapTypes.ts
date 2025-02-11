// import des types
import type { FilterType } from "./filterTypes";

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
	isActive: true;
	createdAt: string;
	updatedAt: string;
	filters: FilterType[];
};

type ElementType = {
	element_id: number;
	etat_absolu: string;
	element_nom_en: string;
	element_nom_fr: string;
};

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

type SourceType = {
	ante: number;
	post: number;
	source_id: number;
	support_en: string;
	support_fr: string;
	materiau_en: string;
	materiau_fr: string;
	attestations: AttestationType[];
};

type PointType = {
	latitude: number;
	longitude: number;
	sous_region_fr: string;
	sous_region_en: string;
	nom_ville: string;
	sources: SourceType[];
};

type MenuTabType = "results" | "filters" | "infos";

type MapInfoType = { [key: string]: string };

type GreatRegionType = {
	id: number;
	nom_fr: string;
	nom_en: string;
};

type DivinityType = {
	id: number;
	nom_fr: string;
	nom_en: string;
};

type TimeMarkersType = {
	post: number;
	ante: number;
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
};
