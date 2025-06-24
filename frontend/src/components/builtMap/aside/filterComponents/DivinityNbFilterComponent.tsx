// import des bibliothèques
import MultiRangeSlider from "multi-range-slider-react";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";

type DivinityNbComponentProps = {
	timeBoundsRef: React.MutableRefObject<{ min: number; max: number } | null>;
};

/**
 * Composant de filtre pour les langues (grec, sémitique)
 */
const DivinityNbComponent = ({ timeBoundsRef }: DivinityNbComponentProps) => {
	// récupération des données des filtres depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// définition de la fonction qui permet de gérer le changement d'état des checkboxs
	function handleRangeChange(minValue: string, maxValue: string) {
		const newLanguageFiltersObject = {
			...userFilters,
			minDivinityNb: minValue,
			maxDivinityNb: maxValue,
		};

		setUserFilters(newLanguageFiltersObject);
	}

	return (
		timeBoundsRef.current && (
			<div>
				<MultiRangeSlider
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					min={timeBoundsRef.current.min}
					max={timeBoundsRef.current.max}
					step={1}
					stepOnly
					baseClassName={"multi-range-slider-custom"}
					minValue={userFilters.minDivinityNb ?? timeBoundsRef.current.min}
					maxValue={userFilters.maxDivinityNb ?? timeBoundsRef.current.max}
					labels={[]}
					onChange={(e) => {
						handleRangeChange(e.minValue.toString(), e.maxValue.toString());
					}}
				/>
			</div>
		)
	);
};

export default DivinityNbComponent;
