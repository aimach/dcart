// import des bibiliothèques
import DOMPurify from "dompurify";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./tableBlock.module.scss";
import "quill/dist/quill.snow.css";

interface TableBlockProps {
	blockContent: BlockContentType;
}

const TableBlock = ({ blockContent }: TableBlockProps) => {
	// on récupère le language
	const { language } = useTranslation();

	return <section className={style.tableBlockContainer}></section>;
};

export default TableBlock;
