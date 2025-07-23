// import des composants
import MemoDraggableBlock from "./DraggableBlock"; // ton composant existant
import type { BlockContentType } from "../../../utils/types/storymapTypes";

type Props = {
	block: BlockContentType;
	type: string;
	index?: number;
};

const DraggableBlockOverlay = ({ block, type, index }: Props) => {
	return (
		<div
			style={{
				transform: "scale(1.05)",
				opacity: 0.9,
			}}
		>
			<MemoDraggableBlock block={block} type={type} index={index} />
		</div>
	);
};

export default DraggableBlockOverlay;
