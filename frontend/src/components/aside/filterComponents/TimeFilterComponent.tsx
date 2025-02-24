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
import type { TimeMarkersType } from "../../../utils/types/mapTypes";
// import du style
import style from "./filtersComponent.module.scss";
import "./timeFilterComponent.css";
import { set } from "react-hook-form";

interface TimeFilterComponentProps {
	timeMarkers: TimeMarkersType;
}

const TimeFilterComponent = ({ timeMarkers }: TimeFilterComponentProps) => {
	// on récupère les filtres de l'utilisateur dans le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => ({
			userFilters: state.userFilters,
			setUserFilters: state.setUserFilters,
			isReset: state.isReset,
		})),
	);
	const { mapInfos, setAllPoints } = useMapStore(
		useShallow((state) => ({
			mapInfos: state.mapInfos,
			setAllPoints: state.setAllPoints,
		})),
	);

	// ATTENTION : l'utilisation de setUserFilters entraînait malheureusement une boucle infinie, réglée grâce à l'usage d'un state indépendant
	const [timeValues, setTimeValues] = useState<{ ante: number; post: number }>({
		ante: 0,
		post: 0,
	});

	// on change quand même les user filters pour les bornes temporelles
	const changeUserFilters = (e: {
		min: number;
		max: number;
		minValue: number;
		maxValue: number;
	}) => {
		setUserFilters({ ...userFilters, ante: e.maxValue, post: e.minValue });
	};

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
			const mapId = mapInfos ? mapInfos.id : "exploration";
			const points = await getAllPointsByMapId(mapId, {
				...userFilters,
				ante: e.maxValue,
				post: e.minValue,
			});
			setAllPoints(points);
		} catch (error) {
			console.error("Erreur lors du chargement des points:", error);
		}
	};

	const step = 25;

	return (
		timeMarkers.ante && (
			<div className={style.rangeContainer}>
				<MultiRangeSlider
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					min={
						// si mapInfos existe (ce n'est pas "exploration"), si mapInfos[post/ante] n'est pas null, on prend sa valeur, sinon on prend la valeur la plus haute ou basse de la BDD
						mapInfos ? (mapInfos.post ?? timeMarkers.post) : timeMarkers.post
					}
					max={
						mapInfos ? (mapInfos.ante ?? timeMarkers.ante) : timeMarkers.ante
					}
					step={step}
					stepOnly
					baseClassName={"multi-range-slider-custom"}
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
						mapInfos ? (mapInfos.post ?? timeMarkers.post) : timeMarkers.post,
						mapInfos ? (mapInfos.ante ?? timeMarkers.ante) : timeMarkers.ante,
						step,
					)}
					onChange={(e) => {
						handleTimeFilter(e);
						changeUserFilters(e);
					}}
				/>
			</div>
		)
	);
};

export default TimeFilterComponent;
