// import des entités
import type { Point } from "../../entities/storymap/Point";
import type { Block } from "../../entities/storymap/Block";
import type { Storymap } from "../../entities/storymap/Storymap";

interface StorymapInterface extends Storymap {
	blocks: Block[] | BlockInterface[];
}

interface BlockInterface extends Block {
	points: Point[];
	groupedPoints?: GroupedPoint[];
}

type PointType = {
	id: number;
	latitude: number;
	longitude: number;
	great_region: string | null;
	sub_region: string | null;
	site: string | null;
	extraction: string | null;
	transliteration: string | null;
	translation_fr: string | null;
	title_en?: string | null;
	title_fr?: string | null;
	description_en?: string | null;
	description_fr?: string | null;
	blockId: string;
};

type GroupedPoint = {
	latitude: number;
	longitude: number;
	attestations?: Point[];
};

export type { BlockInterface, StorymapInterface, PointType, GroupedPoint };
