// import des types
import type { OptionType } from "./commonTypes";

type InputType = {
	label_fr: string;
	label_en: string;
	name: string;
	type: string;
	options?: OptionType[];
	required: {
		value: boolean;
		message?: { fr: string; en: string };
	};
};

export type { InputType };
