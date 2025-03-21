// import des types
import { getBlockComponentFromType } from "../../../../pages/BackOffice/BOStorymapPage/storymapPage/StorymapPage";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./layoutBlock.module.scss";

interface LayoutBlockProps {
	blockContent: BlockContentType;
}

const LayoutBlock = ({ blockContent }: LayoutBlockProps) => {
	// import des données du store
	const textSide = blockContent.content1_lang2;

	return (
		<section className={`${style.layoutSection} ${style[textSide]}`}>
			{blockContent.children.map((child, index) =>
				getBlockComponentFromType(child, index),
			)}
		</section>
	);
};

export default LayoutBlock;
