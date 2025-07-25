// import des bibliothèques
import { useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
// import des custom hooks
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useShallow } from "zustand/shallow";
import { getAllDatationLabels } from "../../../../utils/functions/filter";
import { getAllPointsByMapId } from "../../../../utils/api/builtMap/getRequests";
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
	const { translation, language } = useTranslation();
	const { isMobile, isDesktop } = useWindowSize();

	// récupération des données des stores
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);
	const {
		mapInfos,
		setAllPoints,
		setAllResults,
		setMapReady,
		setSelectedMarker,
	} = useMapStore(useShallow((state) => state));

	// ATTENTION : l'utilisation de setUserFilters entraînait malheureusement une boucle infinie, réglée grâce à l'usage d'un state indépendant
	const [timeValues, setTimeValues] = useState<{ ante: number; post: number }>({
		ante: 400,
		post: -1000,
	});

	// fonction de mise à jour des user filters pour les bornes temporelles
	const changeUserFilters = (e: {
		min: number;
		max: number;
		minValue: number;
		maxValue: number;
	}) => {
		const newUserFilters = {
			...userFilters,
			ante: e.maxValue,
			post: e.minValue,
		};
		setUserFilters(newUserFilters);
	};

	// fonction qui met à jour les bornes temporelles dans le selecteur de temps et charge les points
	const handleTimeFilter = async (e: {
		min: number;
		max: number;
		minValue: number;
		maxValue: number;
	}) => {
		// si la valeur est la même, rien ne se passe
		if (e.minValue === timeValues.post && e.maxValue === timeValues.ante) {
			return;
		}
		// sinon mise à jour du state et chargement des points
		setTimeValues({ ante: e.maxValue, post: e.minValue });
		setMapReady(false);

		const mapId = (mapInfos?.id as string) ?? "exploration";
		const points = await getAllPointsByMapId(mapId, {
			...userFilters,
			ante: e.maxValue,
			post: e.minValue,
		});
		setAllPoints(points);
		setAllResults(points);
		setSelectedMarker(undefined);
		setMapReady(true);
	};

	return (
		<div className={style.rangeContainer}>
			{isMobile && (
				<h4>
					{translation[language].common.filter} :{" "}
					{translation[language].mapPage.aside.timeLimits}
				</h4>
			)}
			<MultiRangeSlider
				disabled={disabled}
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				min={-1000}
				max={400}
				step={25}
				stepOnly
				baseClassName={"multi-range-slider-custom"}
				minValue={
					userFilters.post === undefined ? -1000 : (userFilters.post as number)
				}
				maxValue={
					userFilters.ante === undefined ? 400 : (userFilters.ante as number)
				}
				labels={getAllDatationLabels(-1000, 400, isDesktop)}
				onChange={(e) => {
					handleTimeFilter(e);
					changeUserFilters(e);
				}}
			/>
		</div>
	);
};

export default TimeFilterComponent;
