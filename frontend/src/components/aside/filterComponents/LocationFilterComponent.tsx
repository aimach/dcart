// import des bibliothèques
import { useState, useEffect } from "react";
// import des composants
// import du context
// import des services
import { getLocationOptions } from "../../../utils/loaders/loaders";
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
import type { MapInfoType } from "../../../utils/types/mapTypes";
// import du style
import style from "./filtersComponent.module.scss";

const LocationFilterComponent = () => {
	// on récupère les données de la carte depuis le store
	const { mapInfos } = useMapStore();
	const locationType = (mapInfos as MapInfoType).locationType;
	const locationId = (mapInfos as MapInfoType).locationId;
	let routeSegment = "";

	// on initie le state
	const [locationOptions, setLocationOptions] = useState([]);

	// on définit la granularité du filtre de localisation
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
	const fetchLocationOptions = async (routeSegment: string) => {
		try {
			const allLocationOptions = await getLocationOptions(routeSegment);
			setLocationOptions(allLocationOptions);
		} catch (error) {
			console.error("Erreur lors du chargement des localités:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchLocationOptions(routeSegment);
	}, [routeSegment, locationId]);
	locationOptions.map((option) => console.log(option));
	return (
		<div>
			{locationOptions.map((option) => (
				<p key={option.id}>{option.nom_fr}</p>
			))}
		</div>
	);
};

export default LocationFilterComponent;
