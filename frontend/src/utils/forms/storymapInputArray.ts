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
		description_fr: "La langue principale de la storymap",
		description_en: "The main language of the storymap",
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
		description_fr: "La langue secondaire de la storymap (facultatif)",
		description_en: "The secondary language of the storymap (optional)",
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
		description_fr: "",
		description_en: "",
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
		description_fr: "",
		description_en: "",
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
		description_fr:
			"Lignes d'introduction de la storymap qui seront affichées dans le premier bloc",
		description_en:
			"Introduction lines of the storymap that will be displayed in the first block",
		name: "description_lang1",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Description en langue 2",
		label_en: "Description in language 2",
		description_fr:
			"Lignes d'introduction de la storymap qui seront affichées dans le premier bloc",
		description_en:
			"Introduction lines of the storymap that will be displayed in the first block",
		name: "description_lang2",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "URL de l'image",
		label_en: "Image URL",
		description_fr:
			"L'image de couverture de la storymap est affichée en arrière plan du titre'",
		description_en:
			"The cover image of the storymap is displayed in the background of the title",
		name: "image_url",
		type: "text",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Couleur de fond (si aucune image fournie)",
		label_en: "Background color (if no image provided)",
		description_fr:
			"Si aucune image n'est fournie, la couleur de fond est utilisée pour le bloc d'introduction",
		description_en:
			"If no background image is prrovided, the background color is used for the introduction block",
		name: "background_color",
		type: "color",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Auteur",
		label_en: "Author",
		description_fr:
			"L'auteur de la storymap, visible dans le premier bloc de la storymap (peut être différent du compteur auteur de la storymap)",
		description_en:
			"The author of the storymap visible in the first block of the storymap (can be different from the storymap author)",
		name: "author",
		type: "text",
		required: {
			value: false,
		},
	},

	{
		label_fr: "Date de publication",
		label_en: "Publication date",
		description_fr:
			"La date de publicatione est affichée, avec le nom de l'ateur, dans le premier bloc de la storymap",
		description_en:
			"The publication date is displayed, with the name of the author, in the first block of the storymap",
		name: "publishedAt",
		type: "text",
		required: {
			value: false,
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
		label_fr: "Texte du lien en langue 1",
		label_en: "Text of the link in language 1",
		name: "content1_lang1",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le texte du lien est requis",
				en: "The link text is required",
			},
		},
	},
	{
		label_fr: "Texte du lien en langue 2",
		label_en: "Text of the link in language 2",
		name: "content1_lang2",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le texte du lien est requis",
				en: "The link text is required",
			},
		},
	},
	{
		label_fr: "Lien",
		label_en: "Link",
		name: "content2_lang1",
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
		description_fr:
			"Le titre de l'étape sera automatiquement précédé du numéro de l'étape, il n'est pas nécessaire de le rajouter.",
		description_en:
			"The title of the step will be automatically preceded by the step number. It is not necessary to add it.",
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
		description_fr:
			"Le titre de l'étape sera automatiquement précédé du numéro de l'étape, il n'est pas nécessaire de le rajouter.",
		description_en:
			"The title of the step will be automatically preceded by the step number. It is not necessary to add it.",
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
		type: "wysiwyg",
		required: {
			value: false,
		},
	},
	{
		label_fr: "Description en langue 2",
		label_en: "Description in language 2",
		name: "content2_lang2",
		type: "wysiwyg",
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
