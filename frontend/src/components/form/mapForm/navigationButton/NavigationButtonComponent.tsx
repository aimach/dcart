// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
// import des types
// import du style
import style from "./navigationButtonComponent.module.scss";
// import des icônes
import { ChevronLeft, ChevronRight } from "lucide-react";

type NavigationButtonComponentProps = {
	step: number;
	nextButtonDisplayed: boolean;
};

/**
 * Composant des boutons de navigation du formulaire de création de la carte
 * @param {Object} props
 * @param {number} props.step - L'étape actuelle
 * @param {number} props.nextButtonDisplayed - Booléen pour afficher ou non le bouton suivant
 */
const NavigationButtonComponent = ({
	step,
	nextButtonDisplayed,
}: NavigationButtonComponentProps) => {
	// récupération des données de la langue
	const { translation, language } = useTranslation();

	// récupération des données du store
	const { decrementStep, incrementStep } = useMapFormStore(
		useShallow((state) => state),
	);

	return (
		<div className={style.navigationButtonContainer}>
			{step > 1 && (
				<button
					type="button"
					onClick={() => decrementStep(step)}
					onKeyUp={() => decrementStep(step)}
				>
					<ChevronLeft /> {translation[language].common.previous}
				</button>
			)}
			{step === 2 && nextButtonDisplayed && (
				<button
					type="button"
					onClick={() => incrementStep(step)}
					onKeyUp={() => incrementStep(step)}
				>
					{translation[language].common.next}
					<ChevronRight />
				</button>
			)}

			{step !== 2 && nextButtonDisplayed && (
				<button type="submit">
					{step <= 2
						? translation[language].common.next
						: translation[language].backoffice.mapFormPage.create}{" "}
					<ChevronRight />
				</button>
			)}
		</div>
	);
};

export default NavigationButtonComponent;
