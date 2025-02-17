// import des bibliothèques
import { useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
// import des services
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { getAllDatationLabels } from "../../../utils/functions/functions";
import { getAllPointsByMapId } from "../../../utils/loaders/loaders";
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
import type {
	TimeMarkersType,
	MapInfoType,
} from "../../../utils/types/mapTypes";
// import du style
import style from "./filtersComponent.module.scss";

interface TimeFilterComponentProps {
	timeMarkers: TimeMarkersType;
}

const TimeFilterComponent = ({ timeMarkers }: TimeFilterComponentProps) => {
	// on récupère les filtres de l'utilisateur dans le store
	const { userFilters } = useMapFiltersStore(
		useShallow((state) => ({
			userFilters: state.userFilters,
		})),
	);
	const { mapInfos, setAllPoints } = useMapStore(
		useShallow((state) => ({
			mapInfos: state.mapInfos,
			setAllPoints: state.setAllPoints,
		})),
	);

	// on définit les bornes temporelles
	// EXPLICATION : l'utilisation de setUserFilters entraînait malheureusement une boucle temporelle, réglée grâce à l'usage d'un state indépendant
	const [timeValues, setTimeValues] = useState<{ ante: number; post: number }>({
		ante: 0,
		post: 0,
	});

	// on gère le changement des bornes temporelles par l'utilisateur
	const handleTimeFilter = async (e: {
		min: number;
		max: number;
		minValue: number;
		maxValue: number;
	}) => {
		// si la valeur est la même, on ne fait rien
		if (e.minValue === timeValues.post && e.maxValue === timeValues.ante) {
			return;
		}
		// sinon on met à jour le state et on charge les points
		setTimeValues({ ante: e.maxValue, post: e.minValue });
		try {
			const points = await getAllPointsByMapId(
				(mapInfos as MapInfoType).id as string,
				{ ante: e.maxValue, post: e.minValue },
			);
			setAllPoints(points);
		} catch (error) {
			console.error("Erreur lors du chargement des points:", error);
		}
	};

	const step = 100;

	return (
		timeMarkers.ante && (
			<div className={style.rangeContainer}>
				<MultiRangeSlider
					min={timeMarkers.post}
					max={timeMarkers.ante}
					step={step}
					stepOnly
					minValue={
						userFilters.post === undefined
							? (timeMarkers.post as number)
							: (userFilters.post as number)
					}
					maxValue={
						userFilters.ante === undefined
							? (timeMarkers.ante as number)
							: (userFilters.ante as number)
					}
					labels={getAllDatationLabels(
						timeMarkers.post,
						timeMarkers.ante,
						step,
					)}
					onChange={(e) => {
						handleTimeFilter(e);
					}}
				/>
			</div>
		)
	);
};

export default TimeFilterComponent;
