// import des bibliothèques
// import des composants
// import du context
// import des services
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
// import des types
// import du style
import style from "./navigationButtonComponent.module.scss";
// import des icônes
import { ChevronLeft, ChevronRight } from "lucide-react";

type NavigationButtonComponentProps = {
	step: number;
};

const NavigationButtonComponent = ({
	step,
}: NavigationButtonComponentProps) => {
	// on récupère les fonctions pour changer d'étape
	const { decrementStep } = useMapFormStore(useShallow((state) => state));

	return (
		<div className={style.navigationButtonContainer}>
			{step > 1 && (
				<button
					type="button"
					onClick={() => decrementStep(step)}
					onKeyUp={() => decrementStep(step)}
				>
					<ChevronLeft /> Précédent
				</button>
			)}

			<button type="submit">
				Suivant <ChevronRight />
			</button>
		</div>
	);
};

export default NavigationButtonComponent;
