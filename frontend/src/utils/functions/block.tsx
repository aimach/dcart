// import des bibliothèques
import DOMPurify from "dompurify";
// import des types
import type { BlockContentType } from "../types/storymapTypes";
import type { blockType, parsedPointType } from "../types/formTypes";
// import des icônes
import {
	Columns2,
	ExternalLink,
	GalleryVerticalEnd,
	Heading1,
	Heading2,
	Image,
	LayoutList,
	LetterText,
	Link,
	MapPinned,
	MessageSquareCode,
	Minus,
	ShieldQuestion,
	SquareMenu,
	Table,
} from "lucide-react";

/**
 * Tableau des clés requises pour un bloc
 */
const requiredBlockKeys: string[] = [
	"content1_lang1",
	"content1_lang2",
	"content2_lang1",
	"content2_lang2",
	"parentId",
	"storymapId",
	"typeName",
];

/**
 * Fonction qui renvoie un aperçu du texte d'un bloc (20 premiers caractères). Si c'est un bloc de type texte (WYSIWYG), le texte est nettoyé avec DOMPurify. Si le texte est trop long, il est tronqué à 20 caractères.
 * @param block - le bloc dont on veut l'aperçu
 * @param language - la langue de l'utilisateur
 */
const getPreviewText = (
	block: BlockContentType,
	selectedLanguage: "lang1" | "lang2",
) => {
	if (block.type.name === "text") {
		const sanitizedText = DOMPurify.sanitize(
			block[`content1_${selectedLanguage}`],
		).slice(0, 50);
		return (
			<p
				// biome-ignore lint/security/noDangerouslySetInnerHtml: texte est nettoyé avec DOMPurify
				dangerouslySetInnerHTML={{ __html: `${sanitizedText}...` }}
				style={{ fontSize: "13px" }}
			/>
		);
	}
	if (block.type.name === "layout") {
		const blockText = block.children.find(
			(child) => child.type.name === "text",
		);
		if (!blockText) {
			return "";
		}
		const sanitizedText = DOMPurify.sanitize(
			blockText[`content1_${selectedLanguage}`],
		).slice(0, 30);
		return (
			<p
				// biome-ignore lint/security/noDangerouslySetInnerHtml: texte est nettoyé avec DOMPurify
				dangerouslySetInnerHTML={{ __html: `${sanitizedText}...` }}
				style={{ fontSize: "13px" }}
			/>
		);
	}
	return (
		<p style={{ fontSize: "13px" }}>
			{block[`content1_${selectedLanguage}`].length > 30
				? `${block[`content1_${selectedLanguage}`].slice(0, 30)}...`
				: block[`content1_${selectedLanguage}`]}
		</p>
	);
};

/**
 * Fonction switch qui renvoie l'icône correspondant au type de bloc
 * @param typeName - le nom du type de bloc
 * @returns Icône Lucide
 */
const getTypeIcon = (typeName: string) => {
	switch (typeName) {
		case "title":
			return <Heading1 />;
		case "subtitle":
			return <Heading2 />;
		case "text":
			return <LetterText />;
		case "link":
			return <Link />;
		case "itemLink":
			return <ExternalLink />;
		case "image":
			return <Image />;
		case "quote":
			return <MessageSquareCode />;
		case "layout":
			return <LayoutList />;
		case "simple_map":
			return <MapPinned />;
		case "comparison_map":
			return <Columns2 />;
		case "scroll_map":
			return <GalleryVerticalEnd />;
		case "separator":
			return <Minus />;
		case "step":
			return <SquareMenu />;
		case "table":
			return <Table />;
		default:
			return <ShieldQuestion />;
	}
};

/**
 * Fonction qui normalise le body d'un bloc à insérer en ajoutant les clés manquantes avec une valeur null
 * @param body
 * @param keys
 * @returns
 */
const normalizeBody = (body: blockType, keys: string[]) => {
	return keys.reduce((acc: Record<string, string | null>, key) => {
		// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		const value = body.hasOwnProperty(key)
			? (body[key as keyof blockType] as string)
			: null;
		return { ...acc, [key]: value };
	}, {});
};

const addPanelToPoints = (points: Record<string, parsedPointType[]>) => {
	return Object.keys(points).reduce((acc: parsedPointType[][], key) => {
		const newPoints = points[key].map((point) => {
			return {
				...point,
				pane: key,
			};
		});
		acc.push(newPoints);
		return acc;
	}, []);
};

/**
 * Fonction pour avoir les tags et attributs autorisés par DOMPurify
 * @returns { ALLOWED_TAGS: string[]; ALLOWED_ATTR: string[] }
 */
const getAllowedTags = () => {
	return {
		ALLOWED_TAGS: [
			"p",
			"b",
			"s",
			"i",
			"u",
			"strong",
			"em",
			"a",
			"ul",
			"ol",
			"li",
			"sub",
			"sup",
			"br",
			"span",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"pre",
		],
		ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
	};
};

export {
	addPanelToPoints,
	requiredBlockKeys,
	getPreviewText,
	getTypeIcon,
	normalizeBody,
	getAllowedTags,
};
