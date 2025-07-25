// import des bibliothèques
import { useLocation, useNavigate } from "react-router";
// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
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
	onChangeFunction?: () => void;
};

/**
 * Composant des boutons de navigation du formulaire de création de la carte
 * @param {Object} props
 * @param {number} props.step - L'étape actuelle
 * @param {number} props.nextButtonDisplayed - Booléen pour afficher ou non le bouton suivant
 * @param {Function} props.onChangeFunction - Fonction à appeler lors du changement d'étape
 */
const NavigationButtonComponent = ({
	step,
	nextButtonDisplayed,
	onChangeFunction,
}: NavigationButtonComponentProps) => {
	// récupération des données de la langue
	const { translation, language } = useTranslation();

	const { pathname } = useLocation();

	// récupération des données du store
	const { decrementStep, incrementStep } = useMapFormStore(
		useShallow((state) => state),
	);

	const navigate = useNavigate();

	return (
		<div className={style.navigationButtonContainer}>
			{step > 1 && (
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].common.previous}
					onClickFunction={() => {
						decrementStep(step);
					}}
					icon={<ChevronLeft />}
				/>
			)}
			{step === 2 && nextButtonDisplayed && (
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].common.next}
					onClickFunction={() => {
						incrementStep(step);
						if (onChangeFunction) {
							onChangeFunction();
						}
					}}
					icon={<ChevronRight />}
				/>
			)}
			{step !== 2 && nextButtonDisplayed && (
				<ButtonComponent
					type="submit"
					color="brown"
					textContent={
						step <= 2
							? translation[language].common.next
							: translation[language].backoffice.mapFormPage[
									pathname.includes("create") ? "create" : "edit"
								]
					}
					icon={<ChevronRight />}
				/>
			)}
			{step === 3 && (
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].common.close}
					onClickFunction={() => navigate("/backoffice/maps")}
				/>
			)}
		</div>
	);
};

export default NavigationButtonComponent;
