// import des bibliothèques
import { useContext } from "react";
// import des composants
import InfoComponent from "./InfoComponent";
// import du context
import { MapContext } from "../../../context/MapContext";
// import des services
import {
	isSelectedMarker,
	zoomOnMarkerOnClick,
} from "../../../utils/functions/functions";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
import type { Map as LeafletMap } from "leaflet";

interface ResultComponentProps {
	results: PointType[];
	mapId: string;
}
const ResultComponent = ({ results, mapId }: ResultComponentProps) => {
	// on récupère la carte depuis le context
	const { map, selectedMarker, setSelectedMarker } = useContext(MapContext);

	// on définit un style différent pour le point sélectionné
	const handleResultClick = (result: PointType) => {
		setSelectedMarker(result);
		zoomOnMarkerOnClick(map as LeafletMap, result as PointType);
	};
	return (
		<div>
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
		</div>
	);
};

export default ResultComponent;
