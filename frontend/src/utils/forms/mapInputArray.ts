// import des types
import type { InputType } from "../types/formTypes";

const mapInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en français",
		label_en: "Map name in french",
		name: "name_fr",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en français est requis",
				en: "The title in french is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en anglais",
		label_en: "Map name in english",
		name: "name_en",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en anglais est requis",
				en: "The title in english is required",
			},
		},
	},
	{
		label_fr: "Description de la carte en français",
		label_en: "Map description in french",
		name: "description_fr",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Description de la carte en anglais",
		label_en: "Map description in english",
		name: "description_en",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Nombre d'éléments",
		label_en: "Elements number",
		name: "elementNb",
		type: "number",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Opérateur sur les éléments",
		label_en: "Element Operator",
		name: "elementOperator",
		type: "select",
		options: [
			{ value: "=", label: "=" },
			{ value: ">", label: ">" },
			{ value: "<", label: "<" },
			{ value: ">=", label: ">=" },
			{ value: "<=", label: "<=" },
		],
		required: {
			value: false,
		},
	},
	{
		label_fr: "Nombre de puissances divines",
		label_en: "Divinity number",
		name: "divinityNb",
		type: "number",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Opérateur sur les puissances divines",
		label_en: "Divinity Operator",
		name: "divinityOperator",
		type: "select",
		options: [
			{ value: "=", label: "=" },
			{ value: ">", label: ">" },
			{ value: "<", label: "<" },
			{ value: ">=", label: ">=" },
			{ value: "<=", label: "<=" },
		],
		required: {
			value: false,
		},
	},
	{
		label_fr: "Elements inclus",
		label_en: "Included elements",
		name: "includedElements",
		type: "asyncSelect",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Elements exclus",
		label_en: "Excluded elements",
		name: "excludedElements",
		type: "asyncSelect",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Type de localisation",
		label_en: "Location type",
		name: "locationType",
		type: "select",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Localisation",
		label_en: "Location",
		name: "locationId",
		type: "select",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Sources avant",
		label_en: "Sources before",
		name: "ante",
		type: "number",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Sources après",
		label_en: "Sources post",
		name: "post",
		type: "number",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Catégorie de la carte",
		label_en: "Map category",
		name: "categoryId",
		type: "select",
		options: [{ value: "0", label: "Choisir une catégorie" }],
		required: {
			value: false,
		},
	},
];

const firstStepInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en français",
		label_en: "Map name in french",
		name: "name_fr",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en français est requis",
				en: "The title in french is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en anglais",
		label_en: "Map name in english",
		name: "name_en",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en anglais est requis",
				en: "The title in english is required",
			},
		},
	},
	{
		label_fr: "Description de la carte en français",
		label_en: "Map description in french",
		name: "description_fr",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Description de la carte en anglais",
		label_en: "Map description in english",
		name: "description_en",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Catégorie de la carte",
		label_en: "Map category",
		name: "categoryId",
		type: "select",
		options: [{ value: "0", label: "Choisir une catégorie" }],
		required: {
			value: true,
			message: {
				fr: "La catégorie de la carte est requise",
				en: "Map category is required",
			},
		},
	},
];

export { mapInputs, firstStepInputs };
