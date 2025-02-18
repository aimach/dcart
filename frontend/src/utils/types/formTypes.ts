type InputType = {
	label: string;
	name: string;
	type: string;
	options?: { value: string; label: string }[];
	required: {
		value: boolean;
		message?: string;
	};
};

export type { InputType };
