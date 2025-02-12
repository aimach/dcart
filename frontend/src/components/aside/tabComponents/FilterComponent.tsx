// import des bibliothèques
import { useContext } from "react";
// import des composants
import TimeFilterComponent from "../filterComponents/TimeFilterComponent";
import LocationFilterComponent from "../filterComponents/LocationFilterComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { getAllPointsByMapId } from "../../../utils/loaders/loaders";
// import des types
import type { MapInfoType } from "../../../utils/types/mapTypes";
import type { UserFilterType } from "../../../utils/types/filterTypes";
import { useShallow } from "zustand/shallow";

type OptionType = { value: number; label: string };

interface FilterComponentProps {
	timeMarkers: {
		post: number;
		ante: number;
	};
	locationOptions: OptionType[];
	locationLevel: string;
}

const FilterComponent = ({
	timeMarkers,
	locationOptions,
	locationLevel,
}: FilterComponentProps) => {
	// on récupère les données de la langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère les données depuis les stores
	const mapFilters = useMapAsideMenuStore((state) => state.mapFilters);
	const { userFilters, resetUserFilters } = useMapFiltersStore(
		useShallow((state) => ({
			userFilters: state.userFilters,
			resetUserFilters: state.resetUserFilters,
		})),
	);
	const { mapInfos, setAllPoints, setMapReady } = useMapStore(
		useShallow((state) => state),
	);

	// on créé une fonction de chargements des points de la carte avec filtres
	const fetchAllPoints = async () => {
		try {
			const points = await getAllPointsByMapId(
				(mapInfos as MapInfoType).id as string,
				userFilters as UserFilterType,
			);
			setAllPoints(points);
			setMapReady(true);
		} catch (error) {
			console.error("Erreur lors du chargement des points:", error);
		}
	};

	const handleFilterButton = () => {
		fetchAllPoints();
	};

	return mapFilters.length ? (
		<div>
			{translation[language].mapPage.aside.filters}
			<div>
				{mapFilters.map((filter) => {
					if (filter.type === "time") {
						return (
							<TimeFilterComponent key={filter.id} timeMarkers={timeMarkers} />
						);
					}
					if (filter.type === "location") {
						return (
							<LocationFilterComponent
								key={filter.id}
								locationOptions={locationOptions}
								locationLevel={locationLevel}
							/>
						);
					}
				})}
			</div>
			<button type="button" onClick={handleFilterButton}>
				{translation[language].button.filter}
			</button>
			{/* <button type="button" onClick={resetUserFilters}>
				{translation[language].button.resetFilter}
			</button> */}
		</div>
	) : (
		<div>{translation[language].mapPage.aside.noFilter}</div>
	);
};

export default FilterComponent;
