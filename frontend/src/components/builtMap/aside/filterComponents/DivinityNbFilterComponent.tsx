// import des bibliothèques
import MultiRangeSlider from "multi-range-slider-react";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
import LoaderComponent from "../../../common/loader/LoaderComponent";

interface DivinityNbComponentProps {
	setElementNbValues: (values: { min: number; max: number } | null) => void;
}

/**
 * Composant de filtre pour les langues (grec, sémitique)
 */
const DivinityNbComponent = ({
	setElementNbValues,
}: DivinityNbComponentProps) => {
	// récupération des données des filtres depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	const { initialElementNbOptions, filteredElementNbOptions } =
		useMapFilterOptionsStore();

	// définition de la fonction qui permet de gérer le changement d'état des checkboxs
	function handleRangeChange(minValue: string, maxValue: string) {
		const newLanguageFiltersObject = {
			...userFilters,
			minDivinityNb: minValue,
			maxDivinityNb: maxValue,
		};

		setUserFilters(newLanguageFiltersObject);
		setElementNbValues({
			min: Number.parseInt(minValue, 10),
			max: Number.parseInt(maxValue, 10),
		});
	}

	return initialElementNbOptions ? (
		<div>
			<MultiRangeSlider
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				min={initialElementNbOptions?.min}
				max={initialElementNbOptions?.max}
				step={1}
				stepOnly
				baseClassName={"multi-range-slider-custom"}
				minValue={
					userFilters.minDivinityNb ??
					filteredElementNbOptions?.min ??
					initialElementNbOptions?.min
				}
				maxValue={
					userFilters.maxDivinityNb ??
					filteredElementNbOptions?.max ??
					initialElementNbOptions?.max
				}
				labels={[]}
				onChange={(e) => {
					handleRangeChange(e.minValue.toString(), e.maxValue.toString());
				}}
			/>
		</div>
	) : (
		<LoaderComponent size={40} />
	);
};

export default DivinityNbComponent;
