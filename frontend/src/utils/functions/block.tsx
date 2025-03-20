// import des bibliothèques
import DOMPurify from "dompurify";
// import des types
import type { BlockContentType } from "../types/storymapTypes";
import type { blockType, parsedPointType } from "../types/formTypes";
import type { Language } from "../types/languageTypes";
// import des icônes
import {
	Columns2,
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
	"content1_fr",
	"content1_en",
	"content2_fr",
	"content2_en",
	"parentId",
	"storymapId",
	"typeName",
];

/**
 * Fonction qui renvoie un aperçu du texte d'un bloc (20 premiers caractères). Si c'est un bloc de type texte (WYSIWYG), le texte est nettoyé avec DOMPurify. Si le texte est trop long, il est tronqué à 20 caractères.
 * @param block - le bloc dont on veut l'aperçu
 * @param language - la langue de l'utilisateur
 */
const getPreviewText = (block: BlockContentType, language: Language) => {
	if (block.type.name === "text") {
		const sanitizedText = DOMPurify.sanitize(
			block[`content1_${language}`],
		).slice(0, 20);
		// biome-ignore lint/security/noDangerouslySetInnerHtml: texte est nettoyé avec DOMPurify
		return <p dangerouslySetInnerHTML={{ __html: sanitizedText }} />;
	}
	if (block.type.name !== "layout") {
		return block[`content1_${language}`].length > 20
			? `${block[`content1_${language}`].slice(0, 20)}...`
			: block[`content1_${language}`];
	}
	return "";
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
		acc[key] = value;
		return acc;
	}, body);
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

export {
	addPanelToPoints,
	requiredBlockKeys,
	getPreviewText,
	getTypeIcon,
	normalizeBody,
};
