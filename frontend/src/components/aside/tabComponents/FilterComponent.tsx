// import des services
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";

const FilterComponent = () => {
	const mapFilters = useMapAsideMenuStore((state) => state.mapFilters);
	return mapFilters.length ? (
		<div>
			Filtres
			<div>
				{mapFilters.map((filter) => (
					<p key={filter.id}>{filter.type}</p>
				))}
			</div>
		</div>
	) : (
		<div>Pas de filtre défini</div>
	);
};

export default FilterComponent;
