// import des bibliothèques
import { useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
// import des services
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { getAllDatationLabels } from "../../../utils/functions/filter";
import { getAllPointsByMapId } from "../../../utils/api/getRequests";
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
// import du style
import style from "./filtersComponent.module.scss";
import "./timeFilterComponent.css";

interface TimeFilterComponentProps {
	disabled: boolean;
}

/**
 * Affiche le filtre du temps
 * @param {Object} props
 * @param {boolean} props.disabled - Si le filtre est désactivé
 * @returns MultiRangeSlider
 */
const TimeFilterComponent = ({ disabled }: TimeFilterComponentProps) => {
	// on récupère les filtres de l'utilisateur dans le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => ({
			userFilters: state.userFilters,
			setUserFilters: state.setUserFilters,
			isReset: state.isReset,
		})),
	);
	const { mapInfos, setAllPoints, setMapReady, setSelectedMarker } =
		useMapStore(
			useShallow((state) => ({
				mapInfos: state.mapInfos,
				setAllPoints: state.setAllPoints,
				setMapReady: state.setMapReady,
				setSelectedMarker: state.setSelectedMarker,
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
		setMapReady(false);

		const mapId = mapInfos ? mapInfos.id : "exploration";
		const points = await getAllPointsByMapId(mapId as string, {
			...userFilters,
			ante: e.maxValue,
			post: e.minValue,
		});
		setAllPoints(points);
		setSelectedMarker(undefined);
		setMapReady(true);
	};

	const step = 25;

	return (
		<div className={style.rangeContainer}>
			<MultiRangeSlider
				disabled={disabled}
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				min={-1000}
				max={400}
				step={step}
				stepOnly
				baseClassName={"multi-range-slider-custom"}
				minValue={
					userFilters.post === undefined ? -1000 : (userFilters.post as number)
				}
				maxValue={
					userFilters.ante === undefined ? 400 : (userFilters.ante as number)
				}
				labels={getAllDatationLabels(-1000, 400, step)}
				onChange={(e) => {
					handleTimeFilter(e);
					changeUserFilters(e);
				}}
			/>
		</div>
	);
};

export default TimeFilterComponent;
