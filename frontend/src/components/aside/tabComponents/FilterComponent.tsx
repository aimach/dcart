// import des composants
import TimeFilterComponent from "../filterComponents/TimeFilterComponent";
// import des services
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { getAllPointsByMapId } from "../../../utils/loaders/loaders";
// import des types
import type { MapInfoType } from "../../../utils/types/mapTypes";
import type { UserFilterType } from "../../../utils/types/filterTypes";

const FilterComponent = () => {
	const mapFilters = useMapAsideMenuStore((state) => state.mapFilters);
	const { mapInfos, setAllPoints, setMapReady } = useMapStore();
	const userFilters = useMapFiltersStore((state) => state.userFilters);

	// on charge les points de la carte
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
			Filtres
			<div>
				{mapFilters.map((filter) => {
					if (filter.type === "time") {
						return <TimeFilterComponent key={filter.id} />;
					}
				})}
			</div>
			<button type="button" onClick={handleFilterButton}>
				Filtrer
			</button>
		</div>
	) : (
		<div>Pas de filtre défini</div>
	);
};

export default FilterComponent;
