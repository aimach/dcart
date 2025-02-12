// import des composants
import InfoComponent from "./InfoComponent";

// import des services
import {
	isSelectedMarker,
	zoomOnMarkerOnClick,
} from "../../../utils/functions/functions";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
import type { Map as LeafletMap } from "leaflet";

interface ResultComponentProps {
	results: PointType[];
	mapId: string;
}
const ResultComponent = ({ results, mapId }: ResultComponentProps) => {
	// on récupère la carte depuis le context
	const { map, selectedMarker, setSelectedMarker } = useMapStore(
		useShallow((state) => ({
			map: state.map,
			selectedMarker: state.selectedMarker,
			setSelectedMarker: state.setSelectedMarker,
		})),
	);

	// on définit un style différent pour le point sélectionné
	const handleResultClick = (result: PointType) => {
		setSelectedMarker(result);
		zoomOnMarkerOnClick(map as LeafletMap, result as PointType);
	};
	return (
		<>
			{results.map((result: PointType) => {
				const isSelected = isSelectedMarker(
					selectedMarker as PointType,
					result,
				);
				return (
					<div
						key={`${result.latitude}-${result.longitude}`}
						onClick={() => handleResultClick(result)}
						onKeyUp={() => handleResultClick(result)}
					>
						<InfoComponent
							point={result}
							isSelected={isSelected}
							mapId={mapId}
						/>
					</div>
				);
			})}
		</>
	);
};

export default ResultComponent;
