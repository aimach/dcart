// import des bibliothèques
import { useState, useEffect, useContext } from "react";
import Select from "react-select";
// import des composants
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { getLocationOptions } from "../../../utils/loaders/loaders";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";
// import des types
import type {
	GreatRegionType,
	MapInfoType,
} from "../../../utils/types/mapTypes";
import type { MultiValue } from "react-select";
// import du style
import style from "./filtersComponent.module.scss";

type OptionType = { value: string; label: string };

const LocationFilterComponent = () => {
	// on récupère les données de la langue
	const { language } = useContext(TranslationContext);

	// on récupère les données de la carte depuis le store
	const { mapInfos } = useMapStore();
	// on récupère les données des filtres depuis le store
	const { userFilters, setUserFilters } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// on va chercher les options du filtre de localisation
	const [locationOptions, setLocationOptions] = useState<OptionType[]>([]);
	const [fetchLocation, setFetchLocation] = useState<string>("");
	const fetchLocationOptions = async (routeSegment: string) => {
		try {
			const allLocationOptions = await getLocationOptions(routeSegment);
			const formatedLocationOptions: OptionType[] = allLocationOptions.map(
				(option: GreatRegionType) => ({
					value: option.id,
					label: option[`nom_${language}`],
				}),
			);
			setLocationOptions(formatedLocationOptions);
		} catch (error) {
			console.error("Erreur lors du chargement des localités:", error);
		}
	};

	// on récupère le route segment
	const getRouteSegment = (mapInfos: MapInfoType) => {
		const locationType = (mapInfos as MapInfoType).locationType;
		const locationId = (mapInfos as MapInfoType).locationId;

		// on définit l'url de la requête selon la granularité du filtre de localisation
		let routeSegment = "";
		let fetchLocation = "";

		switch (locationType) {
			case null:
				routeSegment = "regions/all";
				fetchLocation = "greatRegion";
				break;
			case "greatRegion":
				routeSegment = `regions/${locationId}/subRegions`;
				fetchLocation = "subRegion";
				break;
			default:
				routeSegment = "regions/all";
				fetchLocation = "greatRegion";
				break;
		}
		setFetchLocation(fetchLocation);
		return routeSegment;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (mapInfos) {
			const routeSegment = getRouteSegment(mapInfos);
			fetchLocationOptions(routeSegment);
		}
	}, [mapInfos]);

	// on gère les changements du filtre générés par l'utilisateur
	const onMultiSelectChange = (selectedOptions: MultiValue<OptionType>) => {
		const locationValuesArray: string[] = [];
		for (const option of selectedOptions) {
			locationValuesArray.push(option.value);
		}
		const locationValuesString = locationValuesArray.join("|");
		setUserFilters({
			...userFilters,
			locationType: fetchLocation,
			locationId: locationValuesString,
		});
	};

	return (
		<div>
			<Select
				options={locationOptions}
				delimiter=", "
				isMulti
				onChange={(newValue) => onMultiSelectChange(newValue)}
			/>
		</div>
	);
};

export default LocationFilterComponent;
