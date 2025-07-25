type AgentType = {
	genres: [
		{
			nom_en: string;
			nom_fr: string;
		},
	];
	agentivites: {
		nom_en: string;
		nom_fr: string;
	}[];
	activite_en: string;
	activite_fr: string;
	activite_id: string;
	statut_fr: string;
	statut_en: string;
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
	points?: CustomPointType[] | null;
};

type CustomPointType = {
	latitude: number;
	longitude: number;
	location: string;
	attestation?: AttestationType | null;
};

type TagType = {
	id: string;
	name_fr: string;
	name_en: string;
	description_fr?: string;
	description_en?: string;
	slug: string;
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
	sourceType: boolean;
	agentActivity: boolean;
	agentGender: boolean;
	agentStatus: boolean;
	agentivity: boolean;
	sourceMaterial: boolean;
};

type MapInfoType = {
	id?: string;
	title_en: string;
	title_fr: string;
	description_en: string;
	description_fr: string;
	slug: string;
	tags: string | TagType[];
	attestations: AttestationType[];
	filters?: Record<string, string>[];
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
	pane?: string;
	color?: string;
};

type SourceType = {
	ante_quem: number;
	post_quem: number;
	source_id: number;
	support_en: string;
	support_fr: string;
	material_en: string;
	material_fr: string;
	material_category_fr: string;
	material_category_en: string;
	attestations: AttestationType[];
};

type TimeMarkersType = {
	post: number;
	ante: number;
};

export type {
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
	CustomPointType,
};
