// import des bibliothèques
import { useContext } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
// import des types
import type { PointType } from "../../../types/mapTypes";
// import des services
import { MapAsideMenuContext } from "../../../context/MapAsideMenuContext";

interface AsideMainComponentProps {
	point: PointType;
	results: PointType[];
}

const AsideMainComponent = ({ point, results }: AsideMainComponentProps) => {
	// on récupère l'onglet en cours
	const { selectedTabMenu } = useContext(MapAsideMenuContext);

	// on définit le composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent results={results} />;
		case "filters":
			return <FilterComponent />;
		case "infos":
			return <InfoComponent point={point} />;
		default:
			return <ResultComponent results={results} />;
	}
};

export default AsideMainComponent;
