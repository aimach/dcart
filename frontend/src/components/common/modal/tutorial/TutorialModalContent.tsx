// import des bibliothèques
import { useState } from "react";
// import des composants
// import du context
// import des services
// import des types
// import du style
import style from "./modalComponent.module.scss";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useShallow } from "zustand/shallow";
import { modalContentArray } from "../../../../utils/menu/modalArray";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";

const TutorialModalContent = () => {
	const {
		tutorialStep,
		incrementTutorialStep,
		decrementTutorialStep,
		closeTutorial,
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
		<div>
			{modalContentArray.map((content, index) => {
				if (tutorialStep === index + 1) {
					return (
						<div key={content.title + index.toString()}>
							<h4>{content.title}</h4>
							<p>{content.content}</p>
						</div>
					);
				}
				return null;
			})}
			<div>
				{tutorialStep > 1 && (
					<button
						type="button"
						onClick={() => handleDecrementTutorialStep(tutorialStep)}
						onKeyDown={() => handleDecrementTutorialStep(tutorialStep)}
					>
						Précédent
					</button>
				)}
				{tutorialStep < modalContentArray.length ? (
					<button
						type="button"
						onClick={() => handleIncrementTutorialStep(tutorialStep)}
						onKeyDown={() => handleIncrementTutorialStep(tutorialStep)}
					>
						Suivant
					</button>
				) : (
					<button
						type="button"
						onClick={() => {
							closeTutorial();
							setIsPanelDisplayed(false);
						}}
						onKeyDown={() => {
							closeTutorial();
							setIsPanelDisplayed(false);
						}}
					>
						Fermer
					</button>
				)}
			</div>
		</div>
	);
};

export default TutorialModalContent;
