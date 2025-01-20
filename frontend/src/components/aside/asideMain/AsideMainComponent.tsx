// import des bibliothèques
import { useContext } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
// import du contexte
import { MapAsideMenuContext } from "../../../context/MapAsideMenuContext";
import { MapContext } from "../../../context/MapContext";
// import des types
import type { PointType } from "../../../types/mapTypes";

interface AsideMainComponentProps {
	results: PointType[];
}

const AsideMainComponent = ({ results }: AsideMainComponentProps) => {
	// on récupère l'onglet en cours
	const { selectedTabMenu } = useContext(MapAsideMenuContext);
	// on récupère le point en cours
	const { selectedMarker } = useContext(MapContext);

	// on définit le composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent results={results} />;
		case "filters":
			return <FilterComponent />;
		case "infos":
			return <InfoComponent point={selectedMarker as PointType} />;
		default:
			return <ResultComponent results={results} />;
	}
};

export default AsideMainComponent;
