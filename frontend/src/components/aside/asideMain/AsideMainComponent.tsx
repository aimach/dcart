// import des bibliothèques
import { useContext } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
// import du contexte
import { MapAsideMenuContext } from "../../../context/MapAsideMenuContext";
// import des services
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
import ChartComponent from "../tabComponents/ChartComponent";
// import du style
import style from "./asideMainComponent.module.scss";

interface AsideMainComponentProps {
	results: PointType[];
	mapId: string;
}

const AsideMainComponent = ({ results, mapId }: AsideMainComponentProps) => {
	// on récupère l'onglet en cours
	const { selectedTabMenu } = useContext(MapAsideMenuContext);
	// on récupère le point en cours
	const selectedMarker = useMapStore((state) => state.selectedMarker);

	// on définit le composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent results={results} mapId={mapId} />;
		case "filters":
			return <FilterComponent />;
		case "infos":
			return (
				selectedMarker && (
					<div className={style.infoContainer}>
						<InfoComponent
							point={selectedMarker as PointType}
							isSelected={true}
							mapId={mapId}
						/>
						{mapId !== "exploration" && (
							<ChartComponent point={selectedMarker as PointType} />
						)}
					</div>
				)
			);
		default:
			return <ResultComponent results={results} mapId={mapId} />;
	}
};

export default AsideMainComponent;
