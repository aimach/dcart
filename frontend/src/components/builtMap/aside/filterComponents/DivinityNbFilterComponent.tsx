// import des bibliothèques
import MultiRangeSlider from "multi-range-slider-react";
import { useMemo, useState } from "react";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { getMinAndMaxElementNumbers } from "../../../../utils/functions/filter";

/**
 * Composant de filtre pour les langues (grec, sémitique)
 */
const DivinityNbComponent = () => {
	// récupération des données des filtres depuis le store
	const { allPoints } = useMapStore();
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	const { min, max } = useMemo(() => {
		return getMinAndMaxElementNumbers(allPoints);
	}, [allPoints]);

	// définition de la fonction qui permet de gérer le changement d'état des checkboxs
	function handleRangeChange(minValue: string, maxValue: string) {
		const newLanguageFiltersObject = {
			...userFilters,
			divinityNb: { min: minValue, max: maxValue },
		};

		setUserFilters(newLanguageFiltersObject);
	}

	return (
		min &&
		max && (
			<div>
				<MultiRangeSlider
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					min={min}
					max={max}
					step={1}
					stepOnly
					baseClassName={"multi-range-slider-custom"}
					minValue={userFilters.divinityNb?.min ?? min}
					maxValue={userFilters.divinityNb?.max ?? max}
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
