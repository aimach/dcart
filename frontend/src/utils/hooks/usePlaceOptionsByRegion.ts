// import des bibliothèques
import { useEffect, useMemo } from "react";
// import des services
import { useMapFiltersStore } from "../stores/builtMap/mapFiltersStore";
import { useMapFilterReminderStore } from "../stores/builtMap/mapFilterReminderStore";
import { filterPlaceOptionsByGreatRegions } from "../functions/filter";
// import des types
import type { PlaceOptionType } from "../types/commonTypes";

/**
 * Hook qui restreint les options du filtre "lieu" aux grandes régions sélectionnées (userFilters.locationId)
 * et qui retire de la sélection les lieux qui ne sont plus dans ces régions
 * @param {PlaceOptionType[]} placeOptions - Toutes les options des lieux
 * @returns {{ options: PlaceOptionType[], selectedOptions: PlaceOptionType[] }} - Les options visibles et les options sélectionnées
 */
const usePlaceOptionsByRegion = (placeOptions: PlaceOptionType[]) => {
	const locationId = useMapFiltersStore(
		(state) => state.userFilters.locationId,
	);
	const placeId = useMapFiltersStore((state) => state.userFilters.placeId);

	const options = useMemo(
		() => filterPlaceOptionsByGreatRegions(placeOptions, locationId),
		[placeOptions, locationId],
	);

	const selectedOptions = useMemo(() => {
		if (!placeId) return [];
		const selectedPlaces = new Set(placeId.split("|"));
		return options.filter((option) =>
			selectedPlaces.has(option.value as string),
		);
	}, [options, placeId]);

	// si une région est retirée/ajoutée, on enlève de la sélection les lieux hors des régions choisies
	useEffect(() => {
		// tant que les options ne sont pas chargées, on ne touche pas à la sélection
		if (!placeId || placeOptions.length === 0) return;
		const selectedPlaces = placeId.split("|");
		if (selectedOptions.length === selectedPlaces.length) return;

		// on lit l'état courant du store pour ne pas écraser une mise à jour concurrente
		const { userFilters, setUserFilters } = useMapFiltersStore.getState();
		const newPlaceId = selectedOptions.map((option) => option.value).join("|");
		setUserFilters({
			...userFilters,
			placeId: newPlaceId === "" ? undefined : newPlaceId,
		});
		useMapFilterReminderStore
			.getState()
			.setPlaceNameValues(selectedOptions.map((option) => option.label));
	}, [placeId, placeOptions, selectedOptions]);

	return { options, selectedOptions };
};

export default usePlaceOptionsByRegion;
