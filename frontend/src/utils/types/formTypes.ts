type InputType = {
	label_fr: string;
	label_en: string;
	name: string;
	type: string;
	options?: { value: string; label: string }[];
	required: {
		value: boolean;
		message?: { fr: string; en: string };
	};
};

export type { InputType };
