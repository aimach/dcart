// import de bibliothèques
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
// import des composants
import MapSection from "./MapSection";
import ScrolledSection from "./ScrolledSection";
// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./scrolledMapBlock.module.scss";

interface SimpleMapBlockProps {
	blockContent: BlockContentType;
}

const ScrolledMapBlock = ({ blockContent }: SimpleMapBlockProps) => {
	const { selectedLanguage } = useStorymapLanguageStore();
	const [currentPoint, setCurrentPoint] = useState("");

	const onStepEnter = ({ data }: { data: string }) => {
		setCurrentPoint(data);
	};
	const mapName = `map-${uuidv4()}`;

	return (
		<>
			<div className={style.mapContainer}>
				<MapSection
					blockContent={blockContent}
					mapName={mapName}
					currentPoint={currentPoint}
					setCurrentPoint={setCurrentPoint}
				/>
				<div className={style.scrolledSection}>
					<ScrolledSection
						onStepEnter={onStepEnter}
						steps={blockContent.children as BlockContentType[]}
						currentPoint={currentPoint}
					/>
				</div>
			</div>
			<h4 className={style.mapTitle}>
				{blockContent[`content1_${selectedLanguage}`]}
			</h4>
		</>
	);
};

export default ScrolledMapBlock;
