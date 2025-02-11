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
	const locationType = (mapInfos as MapInfoType).locationType;
	const locationId = (mapInfos as MapInfoType).locationId;

	// on récupère les données des filtres depuis le store
	const { userFilters, setUserFilters } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// on définit l'url de la requête selon la granularité du filtre de localisation
	let routeSegment = "";

	switch (locationType) {
		case null:
			routeSegment = "regions/all";
			break;
		case "greatRegion":
			routeSegment = `regions/${locationId}/subRegions`;
			break;
		case "subRegion":
			routeSegment = `subRegions/${locationId}/cities`;
			break;
		default:
			routeSegment = "regions/all";
			break;
	}

	// on va chercher les options du filtre de localisation
	const [locationOptions, setLocationOptions] = useState<OptionType[]>([]);
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

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchLocationOptions(routeSegment);
	}, [routeSegment, locationId]);

	// on gère les changements du filtre générés par l'utilisateur
	const onMultiSelectChange = (selectedOptions: MultiValue<OptionType>) => {
		const locationValuesArray: string[] = [];
		for (const option of selectedOptions) {
			locationValuesArray.push(option.value);
		}
		const locationValuesString = locationValuesArray.join("|");
		setUserFilters({ ...userFilters, location: locationValuesString });
	};

	return (
		<div>
			<Select
				options={locationOptions}
				delimiter="|"
				isMulti
				onChange={(newValue) => onMultiSelectChange(newValue)}
			/>
		</div>
	);
};

export default LocationFilterComponent;
