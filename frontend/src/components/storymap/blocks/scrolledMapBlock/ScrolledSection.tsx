// import de bibliothèques
import { useMemo } from "react";
// @ts-ignore
import { Scrollama, Step } from "react-scrollama";
import DOMPurify from "dompurify";
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

	const stepsInOrder = useMemo(() => {
		return steps.sort((a, b) => {
			const aPosition = a.position as number;
			const bPosition = b.position as number;
			return aPosition - bPosition;
		});
	}, [steps]);

	return (
		<>
			<Scrollama offset={0.2} onStepEnter={onStepEnter}>
				{(stepsInOrder as BlockContentType[]).map((point, index) => {
					const description = DOMPurify.sanitize(
						point[`content2_${selectedLanguage}`],
					);
					return (
						<Step
							data={`${point.id}|${index}`}
							key={point.id + (point.position as number)}
						>
							<div
								id={point.id.toString()}
								style={{
									opacity: currentPoint === point.id ? 1 : 0.2,
								}}
							>
								<div className={style.infoElement}>
									<h4>
										{index + 1}. {point[`content1_${selectedLanguage}`]}
									</h4>
									<p className={style.description}>
										<span
											// biome-ignore lint/security/noDangerouslySetInnerHtml: c'est nettoyé avec DOMPurify
											dangerouslySetInnerHTML={{
												__html: description,
											}}
										/>
									</p>
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
