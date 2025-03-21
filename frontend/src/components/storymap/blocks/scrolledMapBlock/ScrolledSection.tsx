// import de bibliothèques
import { Scrollama, Step } from "react-scrollama";
// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./scrolledMapBlock.module.scss";

interface ScrolledSectionProps {
	onStepEnter: ({ data }: { data: string }) => void;
	steps: BlockContentType[];
	currentPoint: string | number;
}

const ScrolledSection = ({
	onStepEnter,
	steps,
	currentPoint,
}: ScrolledSectionProps) => {
	const { selectedLanguage } = useStorymapLanguageStore();

	return (
		<>
			<Scrollama offset={0.2} onStepEnter={onStepEnter}>
				{(steps as BlockContentType[]).map((point) => {
					return (
						<Step data={point.id} key={point.id + (point.position as number)}>
							<div
								id={point.id.toString()}
								style={{
									opacity: currentPoint === point.id ? 1 : 0.2,
								}}
							>
								<div className={style.infoElement}>
									<p>{point[`content1_${selectedLanguage}`]}</p>
									<p>{point[`content2_${selectedLanguage}`]}</p>
								</div>
							</div>
						</Step>
					);
				})}
			</Scrollama>
			<div className={style.spaceBottom} />
		</>
	);
};

export default ScrolledSection;
