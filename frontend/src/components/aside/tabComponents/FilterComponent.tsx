// import des services
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import TimeFilterComponent from "../filterComponents/TimeFilterComponent";

const FilterComponent = () => {
	const mapFilters = useMapAsideMenuStore((state) => state.mapFilters);
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
		</div>
	) : (
		<div>Pas de filtre défini</div>
	);
};

export default FilterComponent;
