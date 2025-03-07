// import des types
import { getBlockComponentFromType } from "../../../../pages/BackOffice/BOStorymapPage/storymapPage/StorymapPage";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./layoutBlock.module.scss";

interface LayoutBlockProps {
	blockContent: BlockContentType;
}

const LayoutBlock = ({ blockContent }: LayoutBlockProps) => {
	const textSide = blockContent.content1_en;

	return (
		<section className={`${style.layoutSection} ${style[textSide]}`}>
			{blockContent.children.map((child, index) =>
				getBlockComponentFromType(child, index),
			)}
		</section>
	);
};

export default LayoutBlock;
