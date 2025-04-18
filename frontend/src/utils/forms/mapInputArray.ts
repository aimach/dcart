// import des types
import type { InputType } from "../types/formTypes";

const firstStepInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en français",
		label_en: "Map name in french",
		description_fr:
			"Le nom de la carte sera affiché dans la liste des cartes et dans la modale d'introduction lorsque l'utilisateur ouvrira la carte.",
		description_en:
			"The map name will be displayed in the map list and in the introduction modal when the user opens the map.",
		name: "title_fr",
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
		description_fr:
			"Le nom de la carte sera affiché dans la liste des cartes et dans la modale d'introduction lorsque l'utilisateur ouvrira la carte.",
		description_en:
			"The map name will be displayed in the map list and in the introduction modal when the user opens the map.",
		name: "title_en",
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
		description_fr:
			"La description de la carte sera affichée dans la modale d'introduction lorsque l'utilisateur ouvrira la carte.",
		description_en:
			"The map description will be displayed in the introduction modal when the user opens the map.",
		type: "wysiwyg",
		required: {
			value: true,
			message: {
				fr: "La description en français est requise",
				en: "The description in french is required",
			},
		},
	},
	{
		label_fr: "Description de la carte en anglais",
		label_en: "Map description in english",
		description_fr:
			"La description de la carte sera affichée dans la modale d'introduction lorsque l'utilisateur ouvrira la carte.",
		description_en:
			"The map description will be displayed in the introduction modal when the user opens the map.",
		name: "description_en",
		type: "wysiwyg",
		required: {
			value: true,
			message: {
				fr: "La description en anglais est requise",
				en: "The description in english is required",
			},
		},
	},
	{
		label_fr: "Image accompagnant la description",
		label_en: "Image accompanying the description",
		description_fr:
			"L'image sera affichée dans la modale d'introduction lorsque l'utilisateur ouvrira la carte.",
		description_en:
			"The image will be displayed in the introduction modal when the user opens the map.",
		name: "image_url",
		type: "text",
		required: {
			value: false,
		},
	},
];

const mapInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en français",
		label_en: "Map name in french",
		name: "title_fr",
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
		name: "title_en",
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

const secondStepInputs: InputType[] = [
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
];

export { firstStepInputs, mapInputs, secondStepInputs };
