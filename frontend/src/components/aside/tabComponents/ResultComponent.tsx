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
// import du style
import style from "./tabComponent.module.scss";
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";

interface ResultComponentProps {
	results: PointType[];
	mapId: string;
}
const ResultComponent = ({ results, mapId }: ResultComponentProps) => {
	// on récupère les informations de la carte depuis le store
	const { map, selectedMarker, setSelectedMarker } = useMapStore(
		useShallow((state) => ({
			map: state.map,
			selectedMarker: state.selectedMarker,
			setSelectedMarker: state.setSelectedMarker,
		})),
	);
	const { setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);

	// on définit un style différent pour le point sélectionné
	const handleResultClick = (result: PointType) => {
		setSelectedMarker(result);
		setSelectedTabMenu("infos");
		zoomOnMarkerOnClick(map as LeafletMap, result as PointType);
	};
	return (
		<div className={style.resultContainer}>
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
