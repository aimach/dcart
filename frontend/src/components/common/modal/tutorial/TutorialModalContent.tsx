// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
import { modalContentArray } from "../../../../utils/menu/modalArray";
// import du style
import style from "./tutorialModalContent.module.scss";
// import des images
import delta from "../../../../assets/delta.png";

const TutorialModalContent = () => {
	const { translation, language } = useTranslation();

	const {
		tutorialStep,
		incrementTutorialStep,
		decrementTutorialStep,
		closeTutorial,
		setSelectedMarker,
		allPoints,
	} = useMapStore(useShallow((state) => state));
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();

	const handleIncrementTutorialStep = (tutorialStep: number) => {
		if (tutorialStep < modalContentArray.length) {
			incrementTutorialStep(tutorialStep);
		}
		if (tutorialStep === 5) {
			setIsPanelDisplayed(true);
			setSelectedTabMenu("results");
		}
		if (tutorialStep === 6) {
			setSelectedMarker(allPoints[0]);
			setSelectedTabMenu("infos");
		}
		if (tutorialStep === 7) {
			setSelectedTabMenu("filters");
		}
	};
	const handleDecrementTutorialStep = (tutorialStep: number) => {
		if (tutorialStep > 1) {
			decrementTutorialStep(tutorialStep);
		}
		if (tutorialStep < 7) {
			setIsPanelDisplayed(false);
		}
		if (tutorialStep === 7) {
			setSelectedTabMenu("results");
		}
		if (tutorialStep === 8) {
			setSelectedTabMenu("infos");
		}
	};

	return (
		<div className={style.tutorialModalContent}>
			{modalContentArray.map((content, index) => {
				if (tutorialStep === index + 1) {
					return (
						<div
							key={content.title_fr + index.toString()}
							className={style.contentContainer}
						>
							<div className={style.modalTitleSection}>
								<img src={delta} alt="decoration" width={30} />
								<h4>{content[`title_${language}`]}</h4>
								<img src={delta} alt="decoration" width={30} />
							</div>

							<p>{content[`content_${language}`]}</p>
						</div>
					);
				}
				return null;
			})}
			<div className={style.buttonContainer}>
				{tutorialStep > 1 && (
					<button
						type="button"
						onClick={() => handleDecrementTutorialStep(tutorialStep)}
						onKeyDown={() => handleDecrementTutorialStep(tutorialStep)}
					>
						{translation[language].common.previous}
					</button>
				)}
				{tutorialStep < modalContentArray.length ? (
					<button
						type="button"
						onClick={() => handleIncrementTutorialStep(tutorialStep)}
						onKeyDown={() => handleIncrementTutorialStep(tutorialStep)}
					>
						{translation[language].common.next}
					</button>
				) : (
					<button
						type="button"
						onClick={() => {
							closeTutorial();
							setIsPanelDisplayed(false);
							setSelectedMarker(undefined);
						}}
						onKeyDown={() => {
							closeTutorial();
							setIsPanelDisplayed(false);
							setSelectedMarker(undefined);
						}}
					>
						{translation[language].common.close}
					</button>
				)}
			</div>
		</div>
	);
};

export default TutorialModalContent;
