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
		label_fr: "Titre en langue 1",
		label_en: "Title in language 1",
		name: "content1_lang1",
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
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en langue 2 est requis",
				en: "The title in language 2 is required",
			},
		},
	},
];

const subtitleInputs: InputType[] = [
	{
		label_fr: "Titre en langue 1",
		label_en: "Title in language 1",
		name: "content1_lang1",
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
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en langue 2 est requis",
				en: "The title in language 2 is required",
			},
		},
	},
];

const textInputs: InputType[] = [
	{
		label_fr: "Texte en langue 1",
		label_en: "Texte in language 1",
		name: "content1_lang1",
		type: "wysiwyg",
		required: {
			value: true,
			message: {
				fr: "Le texte en langue 1 est requis",
				en: "The text in language 1 is required",
			},
		},
	},
	{
		label_fr: "Texte en langue 2",
		label_en: "Text in language 2",
		name: "content1_lang2",
		type: "wysiwyg",
		required: {
			value: true,
			message: {
				fr: "Le texte en langue 2 est requis",
				en: "The text in language 2 is required",
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
		label_fr: "Citation en langue 1",
		label_en: "Quote in language 1",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La citation en langue 1 est requise",
				en: "The quote in language 1 is required",
			},
		},
	},
	{
		label_fr: "Citation en langue 2",
		label_en: "Quote in language 2",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La citation en langue 2 est requise",
				en: "The quote in language 2 is required",
			},
		},
	},
	{
		label_fr: "Source en langue 1",
		label_en: "Source in language 1",
		name: "content2_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La source en langue 1 est requise",
				en: "The source in language 1 is required",
			},
		},
	},
	{
		label_fr: "Source en langue 2",
		label_en: "Source in language 2",
		name: "content2_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La source en langue 2 est requise",
				en: "The source in language 2 is required",
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
		label_fr: "Légende de l'image en langue 1",
		label_en: "Image legend in language 1",
		name: "content2_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La légende de l'image en langue 1 est requise",
				en: "The image legend in language 1 is required",
			},
		},
	},
	{
		label_fr: "Légende de l'image en langue 2",
		label_en: "Image legend in language 2",
		name: "content2_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "La légende de l'image en langue 2 est requise",
				en: "The image legend in language 2 is required",
			},
		},
	},
];

const simpleMapInputs: InputType[] = [
	{
		label_fr: "Nom de la carte en langue 1",
		label_en: "Map name in language 1",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en langue 1 est requis",
				en: "The map name in language 1 is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en langue 2",
		label_en: "Map name in language 2",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en langue 2 est requis",
				en: "The map name in language 2 is required",
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
		label_fr: "Nom de la carte en langue 1",
		label_en: "Map name in language 1",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en langue 1 est requis",
				en: "The map name in language 1 is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en langue 2",
		label_en: "Map name in language 2",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en langue 2 est requis",
				en: "The map name in language 2 is required",
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
		label_fr: "Nom de la carte en langue 1",
		label_en: "Map name in language 1",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en langue 1 est requis",
				en: "The map name in language 1 is required",
			},
		},
	},
	{
		label_fr: "Nom de la carte en langue 2",
		label_en: "Map name in language 2",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom de la carte en langue 2 est requis",
				en: "The map name in language 2 is required",
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
		label_fr: "Titre en langue 1",
		label_en: "Title in language 1",
		name: "content1_lang1",
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
		name: "content1_lang2",
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
		name: "content2_lang1",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Description en langue 2",
		label_en: "Description in language 2",
		name: "content2_lang2",
		type: "text",
		required: {
			value: false,
		},
	},
];

const tableInputs: InputType[] = [
	{
		label_fr: "Titre du tableau en langue 1",
		label_en: "Table title in language 1",
		name: "content1_lang1",
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
		label_fr: "Titre du tableau en langue 2",
		label_en: "Table title in language 2",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le titre en langue 2 est requis",
				en: "The title in language 2 is required",
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
