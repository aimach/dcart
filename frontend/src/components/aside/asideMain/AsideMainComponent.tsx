import { useState, useEffect } from "react";
// import des composants
import ResultComponent from "../tabComponents/ResultComponent";
import FilterComponent from "../tabComponents/FilterComponent";
import InfoComponent from "../tabComponents/InfoComponent";
import ChartComponent from "../tabComponents/ChartComponent";
// import des services
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { getTimeMarkers } from "../../../utils/loaders/loaders";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
// import du style
import style from "./asideMainComponent.module.scss";

interface AsideMainComponentProps {
	results: PointType[];
	mapId: string;
}

const AsideMainComponent = ({ results, mapId }: AsideMainComponentProps) => {
	// on récupère l'onglet en cours
	const selectedTabMenu = useMapAsideMenuStore(
		(state) => state.selectedTabMenu,
	);

	// on récupère le point en cours
	const selectedMarker = useMapStore((state) => state.selectedMarker);

	// on récupère les filtres de l'utilisateur dans le store
	const { userFilters, setUserFilters } = useMapFiltersStore(
		useShallow((state) => ({
			userFilters: state.userFilters,
			setUserFilters: state.setUserFilters,
		})),
	);

	// on initie le state des marqueurs temporels
	const [timeMarkers, setTimeMarkers] = useState<{
		post: number;
		ante: number;
	}>({ post: 0, ante: 0 });
	// on récupère les marqueurs temporels depuis la base de données
	const fetchTimeMarkers = async () => {
		try {
			const newTimeMarkers = await getTimeMarkers();
			setTimeMarkers(newTimeMarkers);
			const newUserFilters = {
				...userFilters,
				post: newTimeMarkers.post,
				ante: newTimeMarkers.ante,
			};
			setUserFilters(newUserFilters);
		} catch (error) {
			console.error(
				"Erreur lors du chargement des marqueurs temporels:",
				error,
			);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchTimeMarkers();
	}, []);

	// on définit le composant à rendre
	switch (selectedTabMenu) {
		case "results":
			return <ResultComponent results={results} mapId={mapId} />;
		case "filters":
			return <FilterComponent timeMarkers={timeMarkers} />;
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
