// import des types
import type { InputType } from "../types/formTypes";

const tileOptions = [
	{
		label: "Consortium of Ancient World Mappers",
		value:
			"https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png",
	},
	{
		label: "Open Street Map Basic",
		value: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	},
	{
		label: "Stamen Toner Background",
		value:
			"https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.png",
	},
	{
		label: "Stamen Watercolor",
		value:
			"https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.png",
	},
];

const storymapInputs: InputType[] = [
	{
		label_fr: "Langue 1",
		label_en: "Language 1",
		name: "lang1",
		type: "select",
		options: [],
		required: {
			value: true,
			message: {
				fr: "La langue est requise",
				en: "The language is required",
			},
		},
	},
	{
		label_fr: "Langue 2",
		label_en: "Language 2",
		name: "lang2",
		type: "select",
		options: [],
		required: {
			value: false,
		},
	},
	{
		label_fr: "Titre en langue 1",
		label_en: "Title in language 1",
		name: "title_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en langue 1 est requis",
				en: "The title in language 1 is required",
			},
		},
	},
	{
		label_fr: "Titre en langue 2",
		label_en: "Title in language 2",
		name: "title_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en langue 2 est requis",
				en: "The title in language 2 is required",
			},
		},
	},
	{
		label_fr: "Description en langue 1",
		label_en: "Description in language 1",
		name: "description_lang1",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Description en langue 2",
		label_en: "Description in language 2",
		name: "description_lang2",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "URL de l'image",
		label_en: "Image URL",
		name: "image_url",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Auteur",
		label_en: "Author",
		name: "author",
		type: "text",
		required: {
			value: false,
		},
	},

	{
		label_fr: "Date de publication",
		label_en: "Publication date",
		name: "publishedAt",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Catégorie de la storymap",
		label_en: "Storymap category",
		name: "category_id",
		type: "select",
		options: [],
		required: {
			value: true,
			message: {
				fr: "La catégorie de la storymap est requise",
				en: "The storymap category is required",
			},
		},
	},
];

const titleInput: InputType[] = [
	{
		label_fr: "Titre en français",
		label_en: "Title in french",
		name: "content1_lang1",
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
		label_fr: "Titre en anglais",
		label_en: "Title in english",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en anglais est requis",
				en: "The title in english is required",
			},
		},
	},
];

const subtitleInputs: InputType[] = [
	{
		label_fr: "Titre en français",
		label_en: "Title in french",
		name: "content1_lang1",
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
		label_fr: "Titre en anglais",
		label_en: "Title in english",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en anglais est requis",
				en: "The title in english is required",
			},
		},
	},
];

const textInputs: InputType[] = [
	{
		label_fr: "Texte en français",
		label_en: "Texte in french",
		name: "content1_lang1",
		type: "wysiwyg",
		required: {
			value: true,
			message: {
				fr: "Le texte en français est requis",
				en: "The text in french is required",
			},
		},
	},
	{
		label_fr: "Texte en anglais",
		label_en: "Text in english",
		name: "content1_lang2",
		type: "wysiwyg",
		required: {
			value: true,
			message: {
				fr: "Le texte en anglais est requis",
				en: "The text in english is required",
			},
		},
	},
];

const linkInputs: InputType[] = [
	{
		label_fr: "Lien",
		label_en: "Link",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: { fr: "Le lien est requis", en: "The link is required" },
		},
	},
];

const quoteInputs: InputType[] = [
	{
		label_fr: "Citation en français",
		label_en: "Quote in french",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La citation en français est requise",
				en: "The quote in french is required",
			},
		},
	},
	{
		label_fr: "Citation en anglais",
		label_en: "Quote in english",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La citation en anglais est requise",
				en: "The quote in english is required",
			},
		},
	},
	{
		label_fr: "Source en français",
		label_en: "Source in french",
		name: "content2_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La source en français est requise",
				en: "The source in french is required",
			},
		},
	},
	{
		label_fr: "Source en anglais",
		label_en: "Source in english",
		name: "content2_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La source en anglais est requise",
				en: "The source in english is required",
			},
		},
	},
];

const imageInputs: InputType[] = [
	{
		label_fr: "Lien de l'image",
		label_en: "Link of the image",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le lien de l'image est requis",
				en: "The link of the image is required",
			},
		},
	},
	{
		label_fr: "Légende de l'image en français",
		label_en: "Image legend in french",
		name: "content2_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La légende de l'image en français est requise",
				en: "The image legend in french is required",
			},
		},
	},
	{
		label_fr: "Légende de l'image en anglais",
		label_en: "Image legend in english",
		name: "content2_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La légende de l'image en anglais est requise",
				en: "The image legend in english is required",
			},
		},
	},
];

const simpleMapInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en français",
		label_en: "Map name in french",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en français est requis",
				en: "The map name in french is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en anglais",
		label_en: "Map name in english",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en anglais est requis",
				en: "The map name in english is required",
			},
		},
	},
	{
		label_fr: "Fond de carte",
		label_en: "Map background tiles",
		name: "content2_lang1",
		type: "select",
		options: tileOptions,
		required: {
			value: true,
			message: {
				fr: "Le fond de carte est requis",
				en: "The map background tiles are required",
			},
		},
	},
];

const comparisonMapInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en français",
		label_en: "Map name in french",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en français est requis",
				en: "The map name in french is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en anglais",
		label_en: "Map name in english",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en anglais est requis",
				en: "The map name in english is required",
			},
		},
	},
	{
		label_fr: "Fond de carte pour le panel de gauche",
		label_en: "Map background tiles for the left panel",
		name: "content2_lang1",
		type: "select",
		options: tileOptions,
		required: {
			value: true,
			message: {
				fr: "Le fond de carte est requis",
				en: "The map background tiles are required",
			},
		},
	},
	{
		label_fr: "Fond de carte pour le panel de droite",
		label_en: "Map background tiles for the right panel",
		name: "content2_lang2",
		type: "select",
		options: tileOptions,
		required: {
			value: true,
			message: {
				fr: "Le fond de carte est requis",
				en: "The map background tiles are required",
			},
		},
	},
];

const scrollMapInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en français",
		label_en: "Map name in french",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en français est requis",
				en: "The map name in french is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en anglais",
		label_en: "Map name in english",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en anglais est requis",
				en: "The map name in english is required",
			},
		},
	},
	{
		label_fr: "Fond de carte",
		label_en: "Map background tiles",
		name: "content2_lang1",
		type: "select",
		options: tileOptions,
		required: {
			value: true,
			message: {
				fr: "Le fond de carte est requis",
				en: "The map background tiles are required",
			},
		},
	},
];

const stepInputs: InputType[] = [
	{
		label_fr: "Titre en français",
		label_en: "Title in french",
		name: "content1_lang1",
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
		label_fr: "Titre en anglais",
		label_en: "Title in english",
		name: "content1_lang2",
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
		label_fr: "Description en français",
		label_en: "Description in french",
		name: "content2_lang1",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Description en anglais",
		label_en: "Description in english",
		name: "content2_lang2",
		type: "text",
		required: {
			value: false,
		},
	},
];

const tableInputs: InputType[] = [
	{
		label_fr: "Titre du tableau en français",
		label_en: "Table title in french",
		name: "content1_lang1",
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
		label_fr: "Titre du tableau en anglais",
		label_en: "Table title in english",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en anglais est requis",
				en: "The title in english is required",
			},
		},
	},
];

export {
	storymapInputs,
	titleInput,
	subtitleInputs,
	textInputs,
	linkInputs,
	quoteInputs,
	simpleMapInputs,
	comparisonMapInputs,
	scrollMapInputs,
	stepInputs,
	imageInputs,
	tableInputs,
};
